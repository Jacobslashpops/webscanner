"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, RotateCcw, Bug } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AnalysisFlow } from "@/components/diagnosis/analysis-flow";
import { useDiagnosis } from "@/hooks/use-diagnosis";
import { CoreWebVitalsData } from "@/lib/types/diagnosis";

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { diagnosis, isLoading, updateStep, saveStepResult, completeAnalysis } = useDiagnosis(id);
  const [isAnalyzingPerformance, setIsAnalyzingPerformance] = useState(false);
  const [performanceError, setPerformanceError] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [mobileData, setMobileData] = useState<any>(null);
  const [desktopData, setDesktopData] = useState<any>(null);

  // 保存诊断数据到 localStorage 供调试页面使用
  useEffect(() => {
    if (diagnosis) {
      localStorage.setItem(`diagnosis-${id}`, JSON.stringify(diagnosis));
    }
  }, [diagnosis, id]);

  // 自动开始性能分析（当步骤为 performance 时）
  const runPerformanceAnalysis = useCallback(async () => {
    if (!diagnosis || diagnosis.currentStep !== "performance") return;
    
    // 如果已经有结果了，跳过
    if (diagnosis.results?.performance) {
      setAnalysisComplete(true);
      setMobileData(diagnosis.results.performance.mobile);
      setDesktopData(diagnosis.results.performance.desktop);
      return;
    }

    setIsAnalyzingPerformance(true);
    setPerformanceError(null);

    try {
      // 先分析移动端
      const mobileRes = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(diagnosis.url)}&strategy=mobile`
      );

      if (!mobileRes.ok) {
        const errorData = await mobileRes.json();
        throw new Error(errorData.message || "性能分析失败");
      }

      const mobile: CoreWebVitalsData = await mobileRes.json();
      setMobileData(mobile);
      
      // 等待一下避免 QPS 限制
      await new Promise((resolve) => setTimeout(resolve, 1100));
      
      // 再分析桌面端
      const desktopRes = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(diagnosis.url)}&strategy=desktop`
      );

      let desktop: CoreWebVitalsData | undefined;
      if (desktopRes.ok) {
        desktop = await desktopRes.json();
        setDesktopData(desktop);
      }

      // 保存分析结果
      const result = {
        mobile,
        desktop,
        analyzedAt: new Date().toISOString(),
      };

      saveStepResult("performance", result);
      setAnalysisComplete(true);
      
      // 延迟后进入下一步
      setTimeout(() => {
        updateStep("analyzing-structure");
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "分析失败";
      setPerformanceError(errorMessage);
    } finally {
      setIsAnalyzingPerformance(false);
    }
  }, [diagnosis, saveStepResult, updateStep]);

  // 监听步骤变化，自动开始分析
  useEffect(() => {
    if (diagnosis?.currentStep === "performance" && !isAnalyzingPerformance && !analysisComplete) {
      runPerformanceAnalysis();
    }
  }, [diagnosis?.currentStep, runPerformanceAnalysis, isAnalyzingPerformance, analysisComplete]);

  // 模拟后续步骤
  useEffect(() => {
    if (!diagnosis) return;

    const steps = [
      { from: "analyzing-structure", to: "analyzing-content", delay: 3000 },
      { from: "analyzing-content", to: "analyzing-seo", delay: 3000 },
      { from: "analyzing-seo", to: "analyzing-design", delay: 3000 },
      { from: "analyzing-design", to: "analyzing-security", delay: 3000 },
      { from: "analyzing-security", to: "generating-report", delay: 3000 },
    ];

    const currentStep = steps.find(s => s.from === diagnosis.currentStep);
    if (currentStep) {
      const timer = setTimeout(() => updateStep(currentStep.to as any), currentStep.delay);
      return () => clearTimeout(timer);
    }

    if (diagnosis.currentStep === "generating-report") {
      const timer = setTimeout(() => completeAnalysis(Math.floor(Math.random() * 30) + 70), 3000);
      return () => clearTimeout(timer);
    }
  }, [diagnosis?.currentStep, updateStep, completeAnalysis]);

  // 初始化：从 pending 进入 performance
  useEffect(() => {
    if (diagnosis?.currentStep === "init") {
      updateStep("performance");
    }
  }, [diagnosis?.currentStep, updateStep]);

  if (isLoading) {
    return (
      <div data-element-id="analysis-loading" className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div data-element-id="analysis-not-found" className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">诊断任务不存在</p>
        <Button onClick={() => router.push("/dashboard/diagnosis")}>
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div data-element-id="analysis-page">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset data-element-id="analysis-inset">
          <header data-element-id="analysis-header" className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div data-element-id="analysis-header-content" className="flex items-center gap-2 px-3">
              <SidebarTrigger data-element-id="btn-sidebar-toggle" />
              <Separator data-element-id="header-separator" orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb data-element-id="analysis-breadcrumb">
                <BreadcrumbList data-element-id="breadcrumb-list">
                  <BreadcrumbItem data-element-id="breadcrumb-item-dashboard" className="hidden md:block">
                    <BreadcrumbLink data-element-id="breadcrumb-link-dashboard" href="/dashboard">
                      控制台
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator data-element-id="breadcrumb-separator-1" className="hidden md:block" />
                  <BreadcrumbItem data-element-id="breadcrumb-item-diagnosis" className="hidden md:block">
                    <BreadcrumbLink data-element-id="breadcrumb-link-diagnosis" href="/dashboard/diagnosis">
                      网站诊断
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator data-element-id="breadcrumb-separator-2" className="hidden md:block" />
                  <BreadcrumbItem data-element-id="breadcrumb-item-analysis">
                    <BreadcrumbPage data-element-id="breadcrumb-page-analysis">分析中</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main data-element-id="analysis-main" className="flex-1 p-6">
            <div data-element-id="analysis-content" className="mx-auto max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <Button
                  data-element-id="btn-back"
                  variant="ghost"
                  size="sm"
                  className="-ml-2"
                  onClick={() => router.push("/dashboard/diagnosis")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回列表
                </Button>
                
                {/* 调试工具入口 */}
                <Link href={`/dashboard/diagnosis/${id}/debug`}>
                  <Button variant="outline" size="sm">
                    <Bug className="mr-2 h-4 w-4" />
                    API 调试
                  </Button>
                </Link>
              </div>

              {/* 错误提示 */}
              {performanceError && (
                <div data-element-id="performance-error-banner" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div className="flex-1">
                      <p className="font-medium text-red-700">性能分析失败</p>
                      <p className="text-sm text-red-600">{performanceError}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={runPerformanceAnalysis}
                      disabled={isAnalyzingPerformance}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      重试
                    </Button>
                  </div>
                </div>
              )}

              <AnalysisFlow
                diagnosis={diagnosis}
                isAnalyzingPerformance={isAnalyzingPerformance}
                performanceData={diagnosis.results?.performance}
                onComplete={() => router.push(`/dashboard/diagnosis/${id}`)}
              />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

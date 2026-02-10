"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle2,
  Loader2,
  Clock,
  Globe,
  LayoutTemplate,
  FileText,
  Search,
  Zap,
  Shield,
  FileCheck,
  AlertCircle,
  Gauge,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Diagnosis,
  AnalysisStep,
  ANALYSIS_STEPS,
  AnalysisStepInfo,
  PerformanceResultData,
} from "@/lib/types/diagnosis";
import { PageSpeedDashboard } from "@/components/analysis/pagespeed-dashboard";
import { AIThinkingPanel } from "@/components/analysis/ai-thinking-panel";
import { useStreamingAnalysis } from "@/hooks/use-streaming-analysis";

interface AnalysisFlowProps {
  diagnosis: Diagnosis;
  isAnalyzingPerformance: boolean;
  performanceData?: PerformanceResultData;
  onComplete?: () => void;
  onPerformanceDataReceived?: (data: PerformanceResultData) => void;
}

// 步骤图标映射
const STEP_ICONS: Record<AnalysisStep, React.ReactNode> = {
  init: <Clock className="h-5 w-5" />,
  performance: <Gauge className="h-5 w-5" />,
  "analyzing-structure": <LayoutTemplate className="h-5 w-5" />,
  "analyzing-content": <FileText className="h-5 w-5" />,
  "analyzing-seo": <Search className="h-5 w-5" />,
  "analyzing-design": <Zap className="h-5 w-5" />,
  "analyzing-security": <Shield className="h-5 w-5" />,
  "generating-report": <FileCheck className="h-5 w-5" />,
};

export function AnalysisFlow({ 
  diagnosis, 
  isAnalyzingPerformance, 
  performanceData,
  onComplete,
  onPerformanceDataReceived,
}: AnalysisFlowProps) {
  const [expandedStep, setExpandedStep] = useState<AnalysisStep | null>("performance");
  const [localPerformanceData, setLocalPerformanceData] = useState<PerformanceResultData | undefined>(performanceData);
  const [analysisPhase, setAnalysisPhase] = useState<"idle" | "analyzing-mobile" | "analyzing-desktop" | "completed" | "error">("idle");
  
  // 使用 ref 防止重复执行
  const hasStartedRef = useRef(false);
  
  // 只使用一个流式分析状态（用于展示）
  const { 
    state: streamingState, 
    startAnalysis, 
    reset: resetStreaming 
  } = useStreamingAnalysis();

  // 是否正在分析
  const isAnalyzing = analysisPhase === "analyzing-mobile" || analysisPhase === "analyzing-desktop";
  
  // 是否分析完成
  const isComplete = analysisPhase === "completed" || !!localPerformanceData;

  // 自动开始分析 - 只执行一次
  useEffect(() => {
    if (isAnalyzingPerformance && 
        diagnosis.currentStep === "performance" && 
        analysisPhase === "idle" &&
        !hasStartedRef.current) {
      hasStartedRef.current = true;
      handleStartAnalysis();
    }
  }, [isAnalyzingPerformance, diagnosis.currentStep, analysisPhase]);

  // 处理开始分析 - 只展示移动端的分析过程，桌面端静默分析
  const handleStartAnalysis = async () => {
    resetStreaming();
    
    // 第一阶段：移动端分析（展示完整流程）
    setAnalysisPhase("analyzing-mobile");
    const mobileData = await startAnalysis(diagnosis.url, "mobile", (state) => {
      // 可以在这里添加进度回调
    });
    
    if (!mobileData) {
      setAnalysisPhase("error");
      return;
    }

    // 第二阶段：桌面端分析（静默执行，不展示阶段变化）
    setAnalysisPhase("analyzing-desktop");
    
    // 等待避免 QPS 限制
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // 静默分析桌面端（不传onProgress，不更新streamingState）
    let desktopData;
    try {
      const response = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(diagnosis.url)}&strategy=desktop`
      );
      if (response.ok) {
        desktopData = await response.json();
      }
    } catch (e) {
      console.log("Desktop analysis failed, using mobile data only");
    }

    // 完成
    const result: PerformanceResultData = {
      mobile: mobileData,
      desktop: desktopData || undefined,
      analyzedAt: new Date().toISOString(),
    };
    
    setLocalPerformanceData(result);
    setAnalysisPhase("completed");
    onPerformanceDataReceived?.(result);
  };

  // 自动展开当前步骤
  useEffect(() => {
    if (diagnosis.currentStep !== "init") {
      setExpandedStep(diagnosis.currentStep);
    }
  }, [diagnosis.currentStep]);

  const isCompleted = diagnosis.status === "completed";
  const isFailed = diagnosis.status === "failed";

  // 获取步骤状态
  const getStepStatus = (step: AnalysisStepInfo): "pending" | "current" | "completed" => {
    const currentOrder = ANALYSIS_STEPS.find(s => s.id === diagnosis.currentStep)?.order || 0;
    
    if (step.order < currentOrder) return "completed";
    if (step.order === currentOrder) return isCompleted ? "completed" : "current";
    return "pending";
  };

  // 使用本地或传入的性能数据
  const displayPerformanceData = localPerformanceData || performanceData;

  return (
    <div data-element-id="analysis-flow" className="space-y-6">
      {/* 顶部状态卡片 */}
      <Card data-element-id="analysis-status-card">
        <CardHeader data-element-id="status-card-header" className="pb-3">
          <div data-element-id="status-card-title-row" className="flex items-center justify-between">
            <CardTitle data-element-id="status-card-title" className="text-lg flex items-center gap-2">
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : isFailed ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
              {isCompleted
                ? "分析完成"
                : isFailed
                ? "分析失败"
                : "正在分析网站"}
            </CardTitle>
            <Badge
              data-element-id="status-badge"
              variant={isCompleted ? "default" : isFailed ? "destructive" : "secondary"}
            >
              {diagnosis.progress}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent data-element-id="status-card-content" className="space-y-4">
          {/* 网站信息 */}
          <div data-element-id="site-info" className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div data-element-id="site-info-text">
              <p data-element-id="site-url" className="font-medium truncate max-w-md">
                {diagnosis.url}
              </p>
              <p data-element-id="site-type" className="text-sm text-muted-foreground">
                {diagnosis.type === "b2b" ? "B2B 网站" : "B2C 网站"}
              </p>
            </div>
          </div>

          {/* 进度条 */}
          <div data-element-id="progress-wrapper" className="space-y-2">
            <div data-element-id="progress-labels" className="flex justify-between text-sm">
              <span data-element-id="progress-current-step" className="text-muted-foreground">
                {ANALYSIS_STEPS.find((s) => s.id === diagnosis.currentStep)?.label ||
                  "准备开始"}
              </span>
              <span data-element-id="progress-percentage" className="font-medium">
                {diagnosis.progress}%
              </span>
            </div>
            <Progress
              data-element-id="analysis-progress-bar"
              value={diagnosis.progress}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 步骤列表 */}
      <Card data-element-id="analysis-steps-card">
        <CardHeader data-element-id="steps-card-header">
          <CardTitle data-element-id="steps-card-title">分析步骤</CardTitle>
        </CardHeader>
        <CardContent data-element-id="steps-card-content">
          <div data-element-id="steps-list" className="space-y-2">
            {ANALYSIS_STEPS.map((step, index) => {
              const status = getStepStatus(step);
              const isExpanded = expandedStep === step.id;
              
              // 性能步骤特殊处理
              const isPerformance = step.id === "performance";
              const isPerformanceRunning = isPerformance && isAnalyzing;
              const hasPerformanceData = isPerformance && displayPerformanceData;

              return (
                <div key={step.id}>
                  <div
                    data-element-id={`step-${step.id}`}
                    className={`flex items-center gap-4 rounded-lg border p-4 transition-all cursor-pointer ${
                      status === "current"
                        ? "border-primary bg-primary/5"
                        : status === "completed"
                        ? "border-green-200 bg-green-50/50"
                        : "border-muted bg-muted/50 opacity-60"
                    }`}
                    onClick={() => {
                      if (status !== "pending") {
                        setExpandedStep(isExpanded ? null : step.id);
                      }
                    }}
                  >
                    {/* 步骤编号/图标 */}
                    <div
                      data-element-id={`step-${step.id}-icon`}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        status === "current"
                          ? "bg-primary text-primary-foreground"
                          : status === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : status === "current" ? (
                        isPerformanceRunning ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          STEP_ICONS[step.id]
                        )
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* 步骤信息 */}
                    <div data-element-id={`step-${step.id}-info`} className="flex-1 min-w-0">
                      <div data-element-id={`step-${step.id}-header`} className="flex items-center gap-2">
                        <span
                          data-element-id={`step-${step.id}-label`}
                          className={`font-medium ${
                            status === "current" ? "text-primary" : ""
                          }`}
                        >
                          {step.label}
                        </span>
                        {isPerformanceRunning && (
                          <Badge data-element-id={`step-${step.id}-badge`} variant="outline" className="text-xs animate-pulse">
                            {analysisPhase === "analyzing-desktop" ? "分析桌面端..." : "AI 分析中..."}
                          </Badge>
                        )}
                        {hasPerformanceData && (
                          <Badge data-element-id={`step-${step.id}-score`} variant="secondary" className="text-xs">
                            性能 {displayPerformanceData.mobile.scores.performance}分
                            {displayPerformanceData.desktop && " (双端)"}
                          </Badge>
                        )}
                      </div>
                      <p
                        data-element-id={`step-${step.id}-desc`}
                        className="text-sm text-muted-foreground truncate"
                      >
                        {isPerformanceRunning 
                          ? analysisPhase === "analyzing-desktop"
                            ? "正在分析桌面端性能..."
                            : streamingState.currentThinkingMessage || "AI 正在深度分析网站性能..." 
                          : step.description}
                      </p>
                    </div>

                    {/* 右侧指示器 */}
                    <div className="flex items-center gap-2">
                      {status !== "pending" && (
                        isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )
                      )}
                    </div>
                  </div>

                  {/* 展开的内容 */}
                  {isExpanded && status !== "pending" && (
                    <div 
                      data-element-id={`step-${step.id}-content`}
                      className="border border-t-0 rounded-b-lg bg-background"
                    >
                      {isPerformance ? (
                        isPerformanceRunning ? (
                          // AI Thinking 面板 - 只展示移动端的分析过程
                          <div className="p-4">
                            <AIThinkingPanel 
                              state={streamingState}
                              url={diagnosis.url}
                              isExpanded={true}
                            />
                            {analysisPhase === "analyzing-desktop" && (
                              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 text-blue-700">
                                  <Monitor className="h-4 w-4" />
                                  <span className="text-sm">正在补充分析桌面端数据...</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : hasPerformanceData ? (
                          // 完整的性能仪表盘
                          <div className="p-4">
                            <PageSpeedDashboard 
                              mobileData={displayPerformanceData.mobile} 
                              desktopData={displayPerformanceData.desktop}
                              url={diagnosis.url}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            等待开始分析
                          </div>
                        )
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>该步骤的分析结果将在此处显示</p>
                          <p className="text-sm mt-1">功能开发中...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
    })}
          </div>
        </CardContent>
      </Card>

      {/* 底部操作 */}
      {isCompleted && (
        <div data-element-id="analysis-complete-actions" className="flex justify-end gap-3">
          <Button
            data-element-id="btn-view-report"
            variant="outline"
            onClick={() => onComplete?.()}
          >
            查看详情
          </Button>
          <Button data-element-id="btn-back-to-list" onClick={() => onComplete?.()}>
            返回列表
          </Button>
        </div>
      )}
    </div>
  );
}

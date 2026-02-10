"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDiagnosis } from "@/hooks/use-diagnosis";

export default function DiagnosisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { diagnosis, isLoading } = useDiagnosis(id);

  if (isLoading) {
    return (
      <div data-element-id="detail-loading" className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div data-element-id="detail-not-found" className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">诊断任务不存在</p>
        <Button onClick={() => router.push("/dashboard/diagnosis")}>
          返回列表
        </Button>
      </div>
    );
  }

  // 如果正在分析中，重定向到分析页面
  if (diagnosis.status === "analyzing" || diagnosis.status === "pending") {
    router.push(`/dashboard/diagnosis/${id}/analysis`);
    return null;
  }

  return (
    <div data-element-id="diagnosis-detail-page">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset data-element-id="detail-inset">
          <header data-element-id="detail-header" className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div data-element-id="detail-header-content" className="flex items-center gap-2 px-3">
              <SidebarTrigger data-element-id="btn-sidebar-toggle" />
              <Separator data-element-id="header-separator" orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb data-element-id="detail-breadcrumb">
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
                  <BreadcrumbItem data-element-id="breadcrumb-item-detail">
                    <BreadcrumbPage data-element-id="breadcrumb-page-detail">诊断详情</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main data-element-id="detail-main" className="flex-1 p-6">
            <div data-element-id="detail-content" className="mx-auto max-w-5xl space-y-6">
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

              {/* 概览卡片 */}
              <div data-element-id="detail-overview">
                <h1 data-element-id="detail-title" className="text-2xl font-bold mb-6">
                  诊断报告
                </h1>
                
                <Card data-element-id="detail-summary-card">
                  <CardHeader data-element-id="detail-summary-header">
                    <CardTitle data-element-id="detail-summary-title">概览</CardTitle>
                  </CardHeader>
                  <CardContent data-element-id="detail-summary-content" className="space-y-4">
                    <div data-element-id="detail-url-row" className="flex items-center justify-between">
                      <span data-element-id="detail-url-label" className="text-muted-foreground">网站 URL</span>
                      <span data-element-id="detail-url-value" className="font-medium">{diagnosis.url}</span>
                    </div>
                    <div data-element-id="detail-type-row" className="flex items-center justify-between">
                      <span data-element-id="detail-type-label" className="text-muted-foreground">网站类型</span>
                      <Badge data-element-id="detail-type-value" variant="outline">
                        {diagnosis.type === "b2b" ? "B2B" : "B2C"}
                      </Badge>
                    </div>
                    <div data-element-id="detail-status-row" className="flex items-center justify-between">
                      <span data-element-id="detail-status-label" className="text-muted-foreground">状态</span>
                      <Badge data-element-id="detail-status-value">
                        {diagnosis.status === "completed" ? "已完成" : "失败"}
                      </Badge>
                    </div>
                    {diagnosis.score !== undefined && (
                      <div data-element-id="detail-score-row" className="flex items-center justify-between">
                        <span data-element-id="detail-score-label" className="text-muted-foreground">综合评分</span>
                        <span 
                          data-element-id="detail-score-value" 
                          className={`text-2xl font-bold ${
                            diagnosis.score >= 80
                              ? "text-green-500"
                              : diagnosis.score >= 60
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {diagnosis.score}
                          <span className="text-sm text-muted-foreground font-normal">/100</span>
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 占位：详细报告内容 */}
              <Card data-element-id="detail-report-card">
                <CardHeader data-element-id="detail-report-header">
                  <CardTitle data-element-id="detail-report-title">详细分析报告</CardTitle>
                </CardHeader>
                <CardContent data-element-id="detail-report-content">
                  <div data-element-id="detail-report-placeholder" className="flex flex-col items-center justify-center py-12 text-center">
                    <RefreshCw className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 data-element-id="report-placeholder-title" className="text-lg font-semibold mb-2">
                      报告生成中
                    </h3>
                    <p data-element-id="report-placeholder-desc" className="text-sm text-muted-foreground max-w-md">
                      详细分析报告正在由 AI 生成，包括结构分析、内容分析、SEO 建议等内容。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

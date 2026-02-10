"use client";

import { useState, useEffect } from "react";
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

interface AnalysisFlowProps {
  diagnosis: Diagnosis;
  isAnalyzingPerformance: boolean;
  performanceData?: PerformanceResultData;
  onComplete?: () => void;
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
  onComplete 
}: AnalysisFlowProps) {
  const [expandedStep, setExpandedStep] = useState<AnalysisStep | null>("performance");

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
              const isPerformanceRunning = isPerformance && isAnalyzingPerformance;
              const hasPerformanceData = isPerformance && performanceData;

              return (
                <div key={step.id}>
                  <div
                    data-element-id={`step-${step.id}`}
                    className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
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
                            分析中...
                          </Badge>
                        )}
                        {hasPerformanceData && (
                          <Badge data-element-id={`step-${step.id}-score`} variant="secondary" className="text-xs">
                            性能 {performanceData.mobile.scores.performance}分
                          </Badge>
                        )}
                      </div>
                      <p
                        data-element-id={`step-${step.id}-desc`}
                        className="text-sm text-muted-foreground truncate"
                      >
                        {isPerformanceRunning 
                          ? "正在调用 Google PageSpeed Insights API..." 
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
                      className="border border-t-0 rounded-b-lg p-4 bg-background"
                    >
                      {isPerformance ? (
                        hasPerformanceData ? (
                          <PerformanceResult data={performanceData} />
                        ) : isPerformanceRunning ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span className="text-muted-foreground">正在获取性能数据...</span>
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

// 性能分析结果展示
function PerformanceResult({ data }: { data: PerformanceResultData }) {
  const { mobile, desktop } = data;
  const [activeDevice, setActiveDevice] = useState<"mobile" | "desktop">("mobile");
  const deviceData = activeDevice === "mobile" ? mobile : (desktop || mobile);

  return (
    <div data-element-id="performance-result" className="space-y-4">
      {/* 设备切换 */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium">性能分析结果</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDevice("mobile")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeDevice === "mobile" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            移动端
          </button>
          <button
            onClick={() => desktop && setActiveDevice("desktop")}
            disabled={!desktop}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
              !desktop 
                ? "opacity-50 cursor-not-allowed" 
                : activeDevice === "desktop"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <Monitor className="h-4 w-4" />
            桌面端
          </button>
        </div>
      </div>

      {/* 评分卡片 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "性能", score: deviceData.scores.performance },
          { label: "可访问性", score: deviceData.scores.accessibility },
          { label: "最佳实践", score: deviceData.scores.bestPractices },
          { label: "SEO", score: deviceData.scores.seo },
        ].map((item) => (
          <div key={item.label} className="text-center p-3 rounded-lg bg-muted">
            <div className={`text-2xl font-bold ${
              item.score >= 90 ? "text-green-500" : 
              item.score >= 70 ? "text-yellow-500" : "text-red-500"
            }`}>
              {item.score}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Core Web Vitals */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium">Core Web Vitals</h5>
        <div className="grid grid-cols-2 gap-2">
          <CWVBadge 
            label="LCP" 
            value={formatTime(deviceData.coreWebVitals.labData.lcp.value)}
            rating={deviceData.coreWebVitals.labData.lcp.rating}
          />
          <CWVBadge 
            label="CLS" 
            value={deviceData.coreWebVitals.labData.cls.value.toFixed(3)}
            rating={deviceData.coreWebVitals.labData.cls.rating}
          />
          <CWVBadge 
            label="FCP" 
            value={formatTime(deviceData.coreWebVitals.labData.fcp.value)}
            rating={deviceData.coreWebVitals.labData.fcp.rating}
          />
          <CWVBadge 
            label="TBT" 
            value={formatTime(deviceData.coreWebVitals.labData.tbt.value)}
            rating={deviceData.coreWebVitals.labData.tbt.score > 0.5 ? "good" : "needs-improvement"}
          />
        </div>
      </div>

      {/* 建议 */}
      {deviceData.summary.recommendations.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium">优化建议</h5>
          <ul className="space-y-1">
            {deviceData.summary.recommendations.slice(0, 3).map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-right">
        分析时间: {new Date(data.analyzedAt).toLocaleString()}
      </div>
    </div>
  );
}

// Core Web Vitals 小徽章
function CWVBadge({ label, value, rating }: { label: string; value: string; rating: string }) {
  const colors = {
    good: "bg-green-100 text-green-700 border-green-200",
    "needs-improvement": "bg-yellow-100 text-yellow-700 border-yellow-200",
    poor: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-md border text-sm ${colors[rating as keyof typeof colors] || colors["needs-improvement"]}`}>
      <span className="font-medium">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

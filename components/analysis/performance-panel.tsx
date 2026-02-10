"use client";

import { useEffect, useState } from "react";
import {
  Gauge,
  Zap,
  Clock,
  LayoutTemplate,
  Monitor,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CoreWebVitalsData } from "@/lib/types/diagnosis";

interface PerformancePanelProps {
  url: string;
  onComplete?: (data: CoreWebVitalsData) => void;
  onError?: (error: string) => void;
}

export function PerformancePanel({ url, onComplete, onError }: PerformancePanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activeStrategy, setActiveStrategy] = useState<"mobile" | "desktop">("mobile");
  const [data, setData] = useState<CoreWebVitalsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [url, activeStrategy]);

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${activeStrategy}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch performance data");
      }

      const result: CoreWebVitalsData = await response.json();
      setData(result);
      onComplete?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <PerformanceSkeleton />;
  }

  if (error) {
    return (
      <Card data-element-id="performance-error" className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>性能分析失败: {error}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={fetchPerformanceData}
          >
            重试
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { scores, coreWebVitals, summary } = data;
  const labData = coreWebVitals.labData;

  return (
    <div data-element-id="performance-panel" className="space-y-6">
      {/* 策略切换和设备选择 */}
      <div data-element-id="performance-header" className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            性能分析报告
          </h3>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={activeStrategy === "mobile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveStrategy("mobile")}
              className="gap-2"
            >
              <Smartphone className="h-4 w-4" />
              移动端
            </Button>
            <Button
              variant={activeStrategy === "desktop" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveStrategy("desktop")}
              className="gap-2"
            >
              <Monitor className="h-4 w-4" />
              桌面端
            </Button>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          分析时间: {new Date(data.timestamp).toLocaleString()}
        </span>
      </div>

      {/* 总体评分卡片 */}
      <div data-element-id="performance-scores" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard
          title="性能"
          score={scores.performance}
          icon={<Zap className="h-4 w-4" />}
        />
        <ScoreCard
          title="可访问性"
          score={scores.accessibility}
          icon={<LayoutTemplate className="h-4 w-4" />}
        />
        <ScoreCard
          title="最佳实践"
          score={scores.bestPractices}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <ScoreCard
          title="SEO"
          score={scores.seo}
          icon={<Gauge className="h-4 w-4" />}
        />
      </div>

      {/* Core Web Vitals */}
      <Card data-element-id="cwv-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Core Web Vitals (实验室数据)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CWVMetric
            name="LCP"
            label="Largest Contentful Paint"
            value={labData.lcp.value}
            rating={labData.lcp.rating}
            description="最大内容绘制 - 加载性能指标"
            threshold="< 2.5s 良好"
            format="time"
          />
          <CWVMetric
            name="INP"
            label="Interaction to Next Paint"
            value={labData.fid.value}
            rating={labData.fid.rating}
            description="交互响应延迟"
            threshold="< 200ms 良好"
            format="time"
          />
          <CWVMetric
            name="CLS"
            label="Cumulative Layout Shift"
            value={labData.cls.value}
            rating={labData.cls.rating}
            description="累积布局偏移 - 视觉稳定性"
            threshold="< 0.1 良好"
            format="number"
          />
          <CWVMetric
            name="FCP"
            label="First Contentful Paint"
            value={labData.fcp.value}
            rating={labData.fcp.rating}
            description="首次内容绘制"
            threshold="< 1.8s 良好"
            format="time"
          />
        </CardContent>
      </Card>

      {/* 其他性能指标 */}
      <Card data-element-id="other-metrics-card">
        <CardHeader>
          <CardTitle className="text-base">其他性能指标</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <SimpleMetric
            label="Speed Index"
            value={formatTime(labData.speedIndex.value)}
            score={labData.speedIndex.score}
          />
          <SimpleMetric
            label="Total Blocking Time"
            value={formatTime(labData.tbt.value)}
            score={labData.tbt.score}
          />
          <SimpleMetric
            label="Time to Interactive"
            value={formatTime(labData.tti.value)}
            score={labData.tti.score}
          />
        </CardContent>
      </Card>

      {/* 问题摘要 */}
      {summary.issues.length > 0 && (
        <Card data-element-id="performance-issues" className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              发现的问题 ({summary.issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {summary.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 优化建议 */}
      <Card data-element-id="performance-recommendations">
        <CardHeader>
          <CardTitle className="text-base">优化建议</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// 评分卡片组件
function ScoreCard({
  title,
  score,
  icon,
}: {
  title: string;
  score: number;
  icon: React.ReactNode;
}) {
  const colorClass =
    score >= 90 ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-red-500";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            {icon}
            {title}
          </span>
          <span className={`text-2xl font-bold ${colorClass}`}>{score}</span>
        </div>
        <Progress value={score} className="h-2" />
      </CardContent>
    </Card>
  );
}

// Core Web Vital 指标组件
function CWVMetric({
  name,
  label,
  value,
  rating,
  description,
  threshold,
  format,
}: {
  name: string;
  label: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  description: string;
  threshold: string;
  format: "time" | "number";
}) {
  const ratingConfig = {
    good: {
      color: "bg-green-500",
      textColor: "text-green-600",
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: "良好",
    },
    "needs-improvement": {
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "需改进",
    },
    poor: {
      color: "bg-red-500",
      textColor: "text-red-600",
      icon: <AlertCircle className="h-4 w-4" />,
      label: "较差",
    },
  };

  const config = ratingConfig[rating];
  const displayValue = format === "time" ? formatTime(value) : value.toFixed(3);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">{name}</Badge>
          <span className="font-medium">{label}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <p className="text-xs text-muted-foreground">阈值: {threshold}</p>
      </div>
      <div className="text-right">
        <div className={`text-xl font-bold ${config.textColor}`}>{displayValue}</div>
        <div className={`flex items-center gap-1 text-xs ${config.textColor}`}>
          {config.icon}
          {config.label}
        </div>
      </div>
    </div>
  );
}

// 简单指标组件
function SimpleMetric({
  label,
  value,
  score,
}: {
  label: string;
  value: string;
  score: number;
}) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">
        得分: {Math.round(score * 100)}
      </div>
    </div>
  );
}

// 加载骨架屏
function PerformanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
              <div className="h-8 w-12 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// 格式化时间
function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

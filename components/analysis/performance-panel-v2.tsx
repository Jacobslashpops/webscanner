"use client";

import { useEffect, useState } from "react";
import {
  Gauge,
  Zap,
  Clock,
  Smartphone,
  Monitor,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileCode,
  Image as ImageIcon,
  LayoutGrid,
  Globe,
  Database,
  Shield,
  Search,
  Code2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformancePanelV2Props {
  url: string;
  mobileData?: any;
  desktopData?: any;
  isLoading?: boolean;
}

export function PerformancePanelV2({ 
  url, 
  mobileData, 
  desktopData, 
  isLoading 
}: PerformancePanelV2Props) {
  const [activeDevice, setActiveDevice] = useState<"mobile" | "desktop">("mobile");
  
  const data = activeDevice === "mobile" ? mobileData : (desktopData || mobileData);
  
  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-3" />
        <span className="text-muted-foreground">正在分析性能数据...</span>
      </div>
    );
  }

  const { lighthouseResult, loadingExperience } = data;
  const categories = lighthouseResult?.categories || {};
  const audits = lighthouseResult?.audits || {};

  return (
    <div className="space-y-6">
      {/* 设备切换 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
          <Button
            variant={activeDevice === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveDevice("mobile")}
            className="gap-2"
          >
            <Smartphone className="h-4 w-4" />
            移动端
          </Button>
          <Button
            variant={activeDevice === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveDevice("desktop")}
            className="gap-2"
            disabled={!desktopData}
          >
            <Monitor className="h-4 w-4" />
            桌面端
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          Lighthouse v{lighthouseResult?.lighthouseVersion}
        </span>
      </div>

      {/* 四大评分 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard
          title="性能"
          score={Math.round((categories.performance?.score || 0) * 100)}
          icon={<Zap className="h-4 w-4" />}
          description="加载速度和交互响应"
        />
        <ScoreCard
          title="可访问性"
          score={Math.round((categories.accessibility?.score || 0) * 100)}
          icon={<LayoutGrid className="h-4 w-4" />}
          description="残障用户友好度"
        />
        <ScoreCard
          title="最佳实践"
          score={Math.round((categories["best-practices"]?.score || 0) * 100)}
          icon={<Shield className="h-4 w-4" />}
          description="代码质量和安全性"
        />
        <ScoreCard
          title="SEO"
          score={Math.round((categories.seo?.score || 0) * 100)}
          icon={<Search className="h-4 w-4" />}
          description="搜索引擎优化"
        />
      </div>

      {/* 详细标签页 */}
      <Tabs defaultValue="cwv" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cwv">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="metrics">性能指标</TabsTrigger>
          <TabsTrigger value="opportunities">优化机会</TabsTrigger>
          <TabsTrigger value="resources">资源分析</TabsTrigger>
          <TabsTrigger value="diagnostics">诊断</TabsTrigger>
        </TabsList>

        {/* Core Web Vitals */}
        <TabsContent value="cwv" className="space-y-4">
          <CoreWebVitalsSection 
            labData={audits} 
            fieldData={loadingExperience?.metrics}
            overallCategory={loadingExperience?.overall_category}
          />
        </TabsContent>

        {/* 性能指标 */}
        <TabsContent value="metrics" className="space-y-4">
          <MetricsSection audits={audits} />
        </TabsContent>

        {/* 优化机会 */}
        <TabsContent value="opportunities" className="space-y-4">
          <OpportunitiesSection audits={audits} />
        </TabsContent>

        {/* 资源分析 */}
        <TabsContent value="resources" className="space-y-4">
          <ResourcesSection audits={audits} />
        </TabsContent>

        {/* 诊断 */}
        <TabsContent value="diagnostics" className="space-y-4">
          <DiagnosticsSection audits={audits} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 评分卡片
function ScoreCard({ 
  title, 
  score, 
  icon, 
  description 
}: { 
  title: string; 
  score: number; 
  icon: React.ReactNode;
  description?: string;
}) {
  const getColor = (s: number) => {
    if (s >= 90) return "text-green-500 border-green-200 bg-green-50";
    if (s >= 70) return "text-yellow-500 border-yellow-200 bg-yellow-50";
    return "text-red-500 border-red-200 bg-red-50";
  };

  const getLabel = (s: number) => {
    if (s >= 90) return "优秀";
    if (s >= 70) return "良好";
    if (s >= 50) return "需改进";
    return "较差";
  };

  return (
    <Card className={`border ${getColor(score)}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${getColor(score).split(" ")[0]}`}>
            {score}
          </span>
          <Badge variant="outline" className="text-xs">
            {getLabel(score)}
          </Badge>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Core Web Vitals 部分
function CoreWebVitalsSection({ 
  labData, 
  fieldData,
  overallCategory 
}: { 
  labData: any;
  fieldData?: any;
  overallCategory?: string;
}) {
  const metrics = [
    {
      id: "largest-contentful-paint",
      name: "LCP",
      fullName: "Largest Contentful Paint",
      description: "最大内容绘制",
      thresholds: { good: 2500, poor: 4000 },
      unit: "ms",
    },
    {
      id: "first-contentful-paint",
      name: "FCP",
      fullName: "First Contentful Paint",
      description: "首次内容绘制",
      thresholds: { good: 1800, poor: 3000 },
      unit: "ms",
    },
    {
      id: "cumulative-layout-shift",
      name: "CLS",
      fullName: "Cumulative Layout Shift",
      description: "累积布局偏移",
      thresholds: { good: 0.1, poor: 0.25 },
      unit: "",
    },
    {
      id: "total-blocking-time",
      name: "TBT",
      fullName: "Total Blocking Time",
      description: "总阻塞时间",
      thresholds: { good: 200, poor: 600 },
      unit: "ms",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 真实用户数据 */}
      {fieldData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>真实用户数据 (CrUX)</span>
              {overallCategory && (
                <Badge className={
                  overallCategory === "FAST" ? "bg-green-500" :
                  overallCategory === "AVERAGE" ? "bg-yellow-500" : "bg-red-500"
                }>
                  {overallCategory}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "LARGEST_CONTENTFUL_PAINT_MS", label: "LCP" },
                { key: "FIRST_CONTENTFUL_PAINT_MS", label: "FCP" },
                { key: "CUMULATIVE_LAYOUT_SHIFT_SCORE", label: "CLS" },
                { key: "INTERACTION_TO_NEXT_PAINT", label: "INP" },
              ].map(({ key, label }) => {
                const metric = fieldData[key];
                if (!metric) return null;
                const value = key === "CUMULATIVE_LAYOUT_SHIFT_SCORE" 
                  ? (metric.percentile / 100).toFixed(3)
                  : metric.percentile;
                return (
                  <div key={key} className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{value}{key.includes("MS") ? "ms" : ""}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {metric.category}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 实验室数据 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">实验室数据 (Lighthouse)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.map((metric) => {
            const audit = labData[metric.id];
            if (!audit) return null;
            
            const value = metric.id === "cumulative-layout-shift" 
              ? parseFloat(audit.displayValue || "0")
              : parseFloat(audit.displayValue?.replace(/[^0-9.]/g, "") || "0");
            
            const isGood = value <= metric.thresholds.good;
            const isPoor = value >= metric.thresholds.poor;
            const rating = isGood ? "good" : isPoor ? "poor" : "needs-improvement";
            
            return (
              <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{metric.name}</Badge>
                    <span className="font-medium">{metric.fullName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  <p className="text-xs text-muted-foreground">
                    阈值: ≤ {metric.thresholds.good}{metric.unit} 良好
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    rating === "good" ? "text-green-500" :
                    rating === "poor" ? "text-red-500" : "text-yellow-500"
                  }`}>
                    {audit.displayValue}
                  </div>
                  <Badge variant="outline" className={`text-xs ${
                    rating === "good" ? "text-green-500" :
                    rating === "poor" ? "text-red-500" : "text-yellow-500"
                  }`}>
                    {rating === "good" ? "良好" : rating === "poor" ? "较差" : "需改进"}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// 性能指标部分
function MetricsSection({ audits }: { audits: any }) {
  const metrics = [
    { id: "speed-index", name: "Speed Index", description: "速度指数" },
    { id: "interactive", name: "Time to Interactive", description: "可交互时间" },
    { id: "max-potential-fid", name: "Max Potential FID", description: "最大潜在FID" },
    { id: "server-response-time", name: "Server Response Time", description: "服务器响应时间" },
    { id: "first-meaningful-paint", name: "First Meaningful Paint", description: "首次有效绘制" },
    { id: "estimated-input-latency", name: "Estimated Input Latency", description: "预估输入延迟" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const audit = audits[metric.id];
            if (!audit) return null;
            
            return (
              <div key={metric.id} className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">{metric.name}</div>
                <div className="text-xl font-semibold mt-1">{audit.displayValue || "N/A"}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// 优化机会部分
function OpportunitiesSection({ audits }: { audits: any }) {
  const opportunityIds = [
    "render-blocking-resources",
    "unminified-css",
    "unminified-javascript",
    "unused-css-rules",
    "unused-javascript",
    "modern-image-formats",
    "uses-responsive-images",
    "offscreen-images",
    "uses-optimized-images",
    "efficient-animated-content",
    "duplicatd-javascript",
    "legacy-javascript",
    "redirects",
  ];

  const opportunities = opportunityIds
    .map((id) => audits[id])
    .filter((audit) => audit && audit.details && audit.details.overallSavingsMs > 0)
    .sort((a, b) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0));

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
          <p>没有明显的优化机会，性能表现优秀！</p>
        </CardContent>
      </Card>
    );
  }

  const totalSavings = opportunities.reduce(
    (sum, audit) => sum + (audit.details?.overallSavingsMs || 0), 
    0
  );

  return (
    <div className="space-y-4">
      <Card className="bg-primary/5 border-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">潜在节省时间</p>
              <p className="text-2xl font-bold">{(totalSavings / 1000).toFixed(1)}s</p>
            </div>
            <Zap className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {opportunities.map((audit) => (
          <CollapsibleAudit key={audit.id} audit={audit} />
        ))}
      </div>
    </div>
  );
}

// 可折叠的 Audit 项
function CollapsibleAudit({ audit }: { audit: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const savings = audit.details?.overallSavingsMs || 0;
  const savingsBytes = audit.details?.overallSavingsBytes || 0;

  return (
    <Card className="overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-medium">{audit.title}</h4>
            {savings > 0 && (
              <Badge variant="secondary">
                节省 {formatTime(savings)}
              </Badge>
            )}
            {savingsBytes > 0 && (
              <Badge variant="outline">
                节省 {formatBytes(savingsBytes)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{audit.description}</p>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      
      {isOpen && audit.details?.items && audit.details.items.length > 0 && (
        <div className="px-4 pb-4 border-t bg-muted/30">
          <div className="mt-3 space-y-2 max-h-64 overflow-auto">
            {audit.details.items.slice(0, 10).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-background rounded text-sm">
                <div className="truncate flex-1 mr-4">
                  {item.url ? (
                    <span className="font-mono text-xs">{item.url}</span>
                  ) : item.node ? (
                    <span className="font-mono text-xs">{item.node.selector}</span>
                  ) : (
                    <span className="text-muted-foreground">Item {index + 1}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.wastedMs > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {formatTime(item.wastedMs)}
                    </Badge>
                  )}
                  {item.wastedBytes > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {formatBytes(item.wastedBytes)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {audit.details.items.length > 10 && (
              <p className="text-center text-sm text-muted-foreground">
                还有 {audit.details.items.length - 10} 项...
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// 资源分析部分
function ResourcesSection({ audits }: { audits: any }) {
  const summary = audits["resource-summary"]?.details;
  const networkRequests = audits["network-requests"]?.details;

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          资源摘要数据不可用
        </CardContent>
      </Card>
    );
  }

  const items = summary.items || [];
  const total = items.find((i: any) => i.resourceType === "total");
  const byType = items.filter((i: any) => i.resourceType !== "total");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">资源概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{total?.requestCount || 0}</div>
              <div className="text-sm text-muted-foreground">总请求数</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{formatBytes(total?.transferSize || 0)}</div>
              <div className="text-sm text-muted-foreground">传输大小</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{formatBytes(total?.size || total?.transferSize || 0)}</div>
              <div className="text-sm text-muted-foreground">资源大小</div>
            </div>
          </div>

          <div className="space-y-3">
            {byType.map((item: any) => (
              <div key={item.resourceType} className="flex items-center gap-4">
                <div className="w-24 text-sm capitalize">{item.resourceType}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(item.transferSize / (total?.transferSize || 1)) * 100} 
                      className="h-2"
                    />
                    <span className="text-sm text-muted-foreground w-16">
                      {formatBytes(item.transferSize)}
                    </span>
                  </div>
                </div>
                <div className="w-12 text-sm text-muted-foreground text-right">
                  {item.requestCount}个
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {networkRequests && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">网络请求详情</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-auto space-y-2">
              {networkRequests.items?.slice(0, 20).map((req: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                  <div className="truncate flex-1 mr-4 font-mono text-xs">
                    {req.url}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{req.resourceType}</Badge>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {formatBytes(req.transferSize)}
                    </span>
                  </div>
                </div>
              ))}
              {networkRequests.items?.length > 20 && (
                <p className="text-center text-sm text-muted-foreground">
                  还有 {networkRequests.items.length - 20} 个请求...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 诊断部分
function DiagnosticsSection({ audits }: { audits: any }) {
  const diagnosticIds = [
    "main-thread-tasks",
    "diagnostics",
    "bootup-time",
    "uses-long-cache-ttl",
    "total-byte-weight",
    "dom-size",
    "no-document-write",
    "js-libraries",
    "no-vulnerable-libraries",
    "deprecations",
    "errors-in-console",
    "valid-source-maps",
    "insight-content-width",
  ];

  const diagnostics = diagnosticIds
    .map((id) => audits[id])
    .filter(Boolean)
    .filter((audit) => audit.score !== 1 && audit.score !== null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">诊断信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {diagnostics.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>没有诊断问题</p>
          </div>
        ) : (
          diagnostics.map((audit) => (
            <div key={audit.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium">{audit.title}</h4>
                <p className="text-sm text-muted-foreground">{audit.description}</p>
                {audit.displayValue && (
                  <Badge variant="outline" className="mt-2">
                    {audit.displayValue}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// 工具函数
function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

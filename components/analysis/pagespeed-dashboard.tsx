"use client";

import { useState } from "react";
import {
  Gauge,
  Zap,
  LayoutGrid,
  Shield,
  Search,
  Smartphone,
  Monitor,
  Clock,
  Globe,
  Image as ImageIcon,
  FileCode,
  Database,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Code2,
  Lock,
  Eye,
  MousePointer,
  Type,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 完整的数据类型定义
interface PageSpeedData {
  lighthouseResult: {
    categories: {
      performance: { score: number; title: string };
      accessibility: { score: number; title: string };
      "best-practices": { score: number; title: string };
      seo: { score: number; title: string };
    };
    audits: Record<string, any>;
    configSettings: { emulatedFormFactor: string };
    fetchTime: string;
  };
  loadingExperience?: {
    metrics: Record<string, any>;
    overall_category: string;
  };
  analysisUTCTimestamp: string;
}

interface PageSpeedDashboardProps {
  mobileData: PageSpeedData;
  desktopData?: PageSpeedData;
  url: string;
}

export function PageSpeedDashboard({ mobileData, desktopData, url }: PageSpeedDashboardProps) {
  const [activeDevice, setActiveDevice] = useState<"mobile" | "desktop">("mobile");
  const data = activeDevice === "mobile" ? mobileData : (desktopData || mobileData);
  
  const { lighthouseResult, loadingExperience } = data;
  const categories = lighthouseResult.categories;
  const audits = lighthouseResult.audits;

  // 计算总体评分
  const overallScore = Math.round(
    ((categories.performance?.score || 0) * 0.4 +
      (categories.accessibility?.score || 0) * 0.2 +
      (categories["best-practices"]?.score || 0) * 0.2 +
      (categories.seo?.score || 0) * 0.2) * 100
  );

  return (
    <div className="space-y-6">
      {/* 头部控制栏 */}
      <DashboardHeader
        url={url}
        overallScore={overallScore}
        activeDevice={activeDevice}
        onDeviceChange={setActiveDevice}
        hasDesktopData={!!desktopData}
        timestamp={data.analysisUTCTimestamp}
      />

      {/* 核心评分卡片 */}
      <ScoreCards categories={categories} />

      {/* 详细数据标签页 */}
      <Tabs defaultValue="cwv" className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto">
          <TabsTrigger value="cwv" className="text-xs sm:text-sm">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs sm:text-sm">性能指标</TabsTrigger>
          <TabsTrigger value="opportunities" className="text-xs sm:text-sm">优化机会</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs sm:text-sm">资源分析</TabsTrigger>
          <TabsTrigger value="diagnostics" className="text-xs sm:text-sm">诊断</TabsTrigger>
          <TabsTrigger value="details" className="text-xs sm:text-sm">详细检查</TabsTrigger>
        </TabsList>

        <TabsContent value="cwv" className="mt-6">
          <CoreWebVitalsTab audits={audits} loadingExperience={loadingExperience} />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <MetricsTab audits={audits} />
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          <OpportunitiesTab audits={audits} />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <ResourcesTab audits={audits} />
        </TabsContent>

        <TabsContent value="diagnostics" className="mt-6">
          <DiagnosticsTab audits={audits} />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <DetailsTab audits={audits} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ========== 子组件 ==========

// 头部控制栏
function DashboardHeader({
  url,
  overallScore,
  activeDevice,
  onDeviceChange,
  hasDesktopData,
  timestamp,
}: {
  url: string;
  overallScore: number;
  activeDevice: "mobile" | "desktop";
  onDeviceChange: (device: "mobile" | "desktop") => void;
  hasDesktopData: boolean;
  timestamp: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* 左侧：URL 和总体评分 */}
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-full ${getScoreBg(overallScore)} flex items-center justify-center text-white shadow-lg`}>
              <div className="text-center">
                <div className="text-3xl font-bold">{overallScore}</div>
                <div className="text-xs opacity-90">总分</div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold truncate">{url}</h2>
              <p className="text-sm text-muted-foreground">
                分析时间: {new Date(timestamp).toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={overallScore >= 90 ? "default" : overallScore >= 70 ? "secondary" : "destructive"}>
                  {overallScore >= 90 ? "优秀" : overallScore >= 70 ? "良好" : "需改进"}
                </Badge>
                <span className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
                  {overallScore >= 90 ? "性能表现优秀" : overallScore >= 70 ? "还有优化空间" : "需要立即优化"}
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：设备切换和导出 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={activeDevice === "mobile" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onDeviceChange("mobile")}
                className="gap-2"
              >
                <Smartphone className="h-4 w-4" />
                移动端
              </Button>
              <Button
                variant={activeDevice === "desktop" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onDeviceChange("desktop")}
                disabled={!hasDesktopData}
                className="gap-2"
              >
                <Monitor className="h-4 w-4" />
                桌面端
              </Button>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              导出报告
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 评分卡片
function ScoreCards({
  categories,
}: {
  categories: PageSpeedData["lighthouseResult"]["categories"];
}) {
  const cards = [
    {
      key: "performance",
      title: "性能",
      score: Math.round((categories.performance?.score || 0) * 100),
      icon: <Zap className="h-5 w-5" />,
      description: "加载速度和交互响应",
      color: "from-orange-500 to-red-500",
    },
    {
      key: "accessibility",
      title: "可访问性",
      score: Math.round((categories.accessibility?.score || 0) * 100),
      icon: <LayoutGrid className="h-5 w-5" />,
      description: "残障用户友好度",
      color: "from-blue-500 to-cyan-500",
    },
    {
      key: "best-practices",
      title: "最佳实践",
      score: Math.round((categories["best-practices"]?.score || 0) * 100),
      icon: <Shield className="h-5 w-5" />,
      description: "代码质量和安全性",
      color: "from-green-500 to-emerald-500",
    },
    {
      key: "seo",
      title: "SEO",
      score: Math.round((categories.seo?.score || 0) * 100),
      icon: <Search className="h-5 w-5" />,
      description: "搜索引擎优化",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.key} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color}`} />
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} text-white`}>
                {card.icon}
              </div>
              <span className={`text-3xl font-bold ${
                card.score >= 90 ? "text-green-500" :
                card.score >= 70 ? "text-yellow-500" : "text-red-500"
              }`}>
                {card.score}
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </div>
            <div className="mt-3">
              <Progress value={card.score} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Core Web Vitals 标签页
function CoreWebVitalsTab({
  audits,
  loadingExperience,
}: {
  audits: Record<string, any>;
  loadingExperience?: PageSpeedData["loadingExperience"];
}) {
  const labMetrics = [
    { id: "largest-contentful-paint", name: "LCP", fullName: "Largest Contentful Paint", desc: "最大内容绘制", thresholds: { good: 2500, poor: 4000 }, unit: "ms" },
    { id: "first-contentful-paint", name: "FCP", fullName: "First Contentful Paint", desc: "首次内容绘制", thresholds: { good: 1800, poor: 3000 }, unit: "ms" },
    { id: "cumulative-layout-shift", name: "CLS", fullName: "Cumulative Layout Shift", desc: "累积布局偏移", thresholds: { good: 0.1, poor: 0.25 }, unit: "" },
    { id: "total-blocking-time", name: "TBT", fullName: "Total Blocking Time", desc: "总阻塞时间", thresholds: { good: 200, poor: 600 }, unit: "ms" },
    { id: "speed-index", name: "SI", fullName: "Speed Index", desc: "速度指数", thresholds: { good: 3400, poor: 5800 }, unit: "ms" },
    { id: "interactive", name: "TTI", fullName: "Time to Interactive", desc: "可交互时间", thresholds: { good: 3800, poor: 7300 }, unit: "ms" },
  ];

  const fieldMetrics = loadingExperience?.metrics;

  return (
    <div className="space-y-6">
      {/* 真实用户数据 */}
      {fieldMetrics && (
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              真实用户数据 (CrUX)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>基于 Chrome 真实用户过去 28 天的体验数据</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              基于数百万真实用户的访问数据，比实验室数据更能反映实际情况
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "LARGEST_CONTENTFUL_PAINT_MS", name: "LCP", thresholds: { good: 2500, poor: 4000 }, unit: "ms" },
                { key: "FIRST_CONTENTFUL_PAINT_MS", name: "FCP", thresholds: { good: 1800, poor: 3000 }, unit: "ms" },
                { key: "CUMULATIVE_LAYOUT_SHIFT_SCORE", name: "CLS", thresholds: { good: 0.1, poor: 0.25 }, unit: "" },
                { key: "INTERACTION_TO_NEXT_PAINT", name: "INP", thresholds: { good: 200, poor: 500 }, unit: "ms" },
              ].map((metric) => {
                const data = fieldMetrics[metric.key];
                if (!data) return null;
                
                const value = metric.key === "CUMULATIVE_LAYOUT_SHIFT_SCORE" 
                  ? data.percentile / 100 
                  : data.percentile;
                const category = data.category; // FAST, AVERAGE, SLOW
                
                return (
                  <CWVCard
                    key={metric.key}
                    name={metric.name}
                    value={value}
                    unit={metric.unit}
                    category={category}
                    thresholds={metric.thresholds}
                    isFieldData={true}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 实验室数据 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            实验室数据 (Lighthouse)
          </CardTitle>
          <CardDescription>
            在受控环境下模拟的加载性能指标
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {labMetrics.map((metric) => {
              const audit = audits[metric.id];
              if (!audit) return null;

              const value = metric.id === "cumulative-layout-shift"
                ? parseFloat(audit.displayValue || "0")
                : parseFloat(audit.displayValue?.replace(/[^0-9.]/g, "") || "0");

              const isGood = value <= metric.thresholds.good;
              const isPoor = value >= metric.thresholds.poor;
              const category = isGood ? "FAST" : isPoor ? "SLOW" : "AVERAGE";

              return (
                <CWVCard
                  key={metric.id}
                  name={metric.name}
                  fullName={metric.fullName}
                  description={metric.desc}
                  value={value}
                  unit={metric.unit}
                  category={category}
                  thresholds={metric.thresholds}
                  score={audit.score}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Core Web Vital 卡片
function CWVCard({
  name,
  fullName,
  description,
  value,
  unit,
  category,
  thresholds,
  score,
  isFieldData = false,
}: {
  name: string;
  fullName?: string;
  description?: string;
  value: number;
  unit: string;
  category: string;
  thresholds: { good: number; poor: number };
  score?: number;
  isFieldData?: boolean;
}) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "FAST":
      case "good":
        return "border-green-200 bg-green-50 text-green-700";
      case "AVERAGE":
      case "needs-improvement":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
      case "SLOW":
      case "poor":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case "FAST":
      case "good":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "AVERAGE":
      case "needs-improvement":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "SLOW":
      case "poor":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const displayValue = unit === "" ? value.toFixed(3) : `${Math.round(value)}${unit}`;

  return (
    <div className={`p-4 rounded-lg border ${getCategoryColor(category)}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{displayValue}</span>
            {getIcon(category)}
          </div>
          <div className="mt-1">
            <span className="font-semibold">{name}</span>
            {fullName && <span className="text-xs text-muted-foreground ml-1">({fullName})</span>}
          </div>
          {description && <p className="text-xs opacity-80 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
        <div className="flex items-center justify-between text-xs">
          <span>≤ {thresholds.good}{unit} 良好</span>
          <Badge variant="outline" className="text-xs">
            {category === "FAST" || category === "good" ? "良好" :
             category === "AVERAGE" ? "需改进" : "较差"}
          </Badge>
        </div>
        {score !== undefined && (
          <div className="mt-2">
            <Progress value={score * 100} className="h-1" />
          </div>
        )}
      </div>
    </div>
  );
}

// 性能指标标签页
function MetricsTab({ audits }: { audits: Record<string, any> }) {
  const additionalMetrics = [
    { id: "max-potential-fid", name: "Max Potential FID", desc: "最大潜在首次输入延迟" },
    { id: "first-meaningful-paint", name: "First Meaningful Paint", desc: "首次有效绘制" },
    { id: "estimated-input-latency", name: "Estimated Input Latency", desc: "预估输入延迟" },
    { id: "server-response-time", name: "Server Response Time", desc: "服务器响应时间" },
    { id: "mainthread-work-breakdown", name: "Main Thread Work", desc: "主线程工作时间" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {additionalMetrics.map((metric) => {
        const audit = audits[metric.id];
        if (!audit) return null;

        return (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">{metric.name}</div>
              <div className="text-2xl font-bold mt-1">{audit.displayValue || "N/A"}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.desc}</p>
              {audit.score !== null && audit.score !== undefined && (
                <div className="mt-2">
                  <Progress value={audit.score * 100} className="h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// 优化机会标签页
function OpportunitiesTab({ audits }: { audits: Record<string, any> }) {
  const opportunityIds = [
    "render-blocking-resources",
    "unused-css-rules",
    "unused-javascript",
    "modern-image-formats",
    "efficient-animated-content",
    "unminified-css",
    "unminified-javascript",
    "duplicatd-javascript",
    "legacy-javascript",
    "uses-responsive-images",
    "offscreen-images",
    "uses-optimized-images",
    "redirects",
  ];

  const opportunities = opportunityIds
    .map((id) => audits[id])
    .filter((audit) => audit && audit.details && (audit.details.overallSavingsMs > 0 || audit.details.overallSavingsBytes > 0))
    .sort((a, b) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0));

  const totalTimeSavings = opportunities.reduce((sum, audit) => sum + (audit.details?.overallSavingsMs || 0), 0);
  const totalByteSavings = opportunities.reduce((sum, audit) => sum + (audit.details?.overallSavingsBytes || 0), 0);

  if (opportunities.length === 0) {
    return (
      <Card className="border-green-200">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold">没有明显的优化机会</h3>
          <p className="text-muted-foreground mt-2">性能表现优秀！继续保持良好的优化实践。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 总体节省 */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">潜在性能提升</p>
              <div className="flex items-baseline gap-4 mt-1">
                <div>
                  <span className="text-4xl font-bold">{(totalTimeSavings / 1000).toFixed(1)}s</span>
                  <span className="text-white/80 ml-1">时间节省</span>
                </div>
                {totalByteSavings > 0 && (
                  <div>
                    <span className="text-2xl font-bold">{formatBytes(totalByteSavings)}</span>
                    <span className="text-white/80 ml-1">体积减少</span>
                  </div>
                )}
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-white/50" />
          </div>
        </CardContent>
      </Card>

      {/* 优化机会列表 */}
      <div className="space-y-3">
        {opportunities.map((audit) => (
          <OpportunityCard key={audit.id} audit={audit} />
        ))}
      </div>
    </div>
  );
}

// 优化机会卡片
function OpportunityCard({ audit }: { audit: any }) {
  const [expanded, setExpanded] = useState(false);
  const savingsMs = audit.details?.overallSavingsMs || 0;
  const savingsBytes = audit.details?.overallSavingsBytes || 0;
  const items = audit.details?.items || [];

  return (
    <Card>
      <div
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold">{audit.title}</h4>
              <div className="flex items-center gap-2">
                {savingsMs > 0 && (
                  <Badge variant="secondary" className="text-green-600 bg-green-100">
                    节省 {(savingsMs / 1000).toFixed(1)}s
                  </Badge>
                )}
                {savingsBytes > 0 && (
                  <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                    节省 {formatBytes(savingsBytes)}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{audit.description}</p>
            {audit.displayValue && (
              <p className="text-sm font-medium mt-2">{audit.displayValue}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && items.length > 0 && (
        <div className="border-t">
          <div className="p-4 bg-muted/30 max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2">资源</th>
                  <th className="pb-2 text-right">节省</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 10).map((item: any, idx: number) => (
                  <tr key={idx} className="border-t border-border/50">
                    <td className="py-2 truncate max-w-md font-mono text-xs">
                      {item.url || item.node?.selector || "-"}
                    </td>
                    <td className="py-2 text-right whitespace-nowrap">
                      {item.wastedMs > 0 && <span className="text-green-600">{(item.wastedMs / 1000).toFixed(2)}s</span>}
                      {item.wastedBytes > 0 && <span className="text-blue-600 ml-2">{formatBytes(item.wastedBytes)}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length > 10 && (
              <p className="text-center text-sm text-muted-foreground mt-3">
                还有 {items.length - 10} 项...
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// 资源分析标签页
function ResourcesTab({ audits }: { audits: Record<string, any> }) {
  const summary = audits["resource-summary"]?.details;
  const networkRequests = audits["network-requests"]?.details;

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          资源摘要数据不可用
        </CardContent>
      </Card>
    );
  }

  const items = summary.items || [];
  const total = items.find((i: any) => i.resourceType === "total");
  const resources = items.filter((i: any) => i.resourceType !== "total");

  const resourceColors: Record<string, string> = {
    "script": "bg-yellow-500",
    "stylesheet": "bg-blue-500",
    "image": "bg-purple-500",
    "font": "bg-pink-500",
    "document": "bg-green-500",
    "other": "bg-gray-500",
    "media": "bg-red-500",
    "third-party": "bg-orange-500",
  };

  return (
    <div className="space-y-6">
      {/* 总体统计 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{total?.requestCount || 0}</div>
            <div className="text-sm text-muted-foreground">总请求数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{formatBytes(total?.transferSize || 0)}</div>
            <div className="text-sm text-muted-foreground">传输大小</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{formatBytes(total?.size || total?.transferSize || 0)}</div>
            <div className="text-sm text-muted-foreground">资源大小</div>
          </CardContent>
        </Card>
      </div>

      {/* 资源分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">资源类型分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((item: any) => (
              <div key={item.resourceType} className="flex items-center gap-4">
                <div className="w-24 text-sm capitalize font-medium">{item.resourceType}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={(item.transferSize / (total?.transferSize || 1)) * 100} 
                      className="h-3 flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-20 text-right">
                      {formatBytes(item.transferSize)}
                    </span>
                  </div>
                </div>
                <div className="w-16 text-sm text-muted-foreground text-right">
                  {item.requestCount} 个
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 网络请求详情 */}
      {networkRequests && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">网络请求详情 (前 20 个)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="pb-2">URL</th>
                    <th className="pb-2">类型</th>
                    <th className="pb-2 text-right">大小</th>
                    <th className="pb-2 text-right">耗时</th>
                  </tr>
                </thead>
                <tbody>
                  {networkRequests.items?.slice(0, 20).map((req: any, idx: number) => (
                    <tr key={idx} className="border-b border-border/50 last:border-0">
                      <td className="py-2 truncate max-w-xs font-mono text-xs" title={req.url}>
                        {req.url}
                      </td>
                      <td className="py-2">
                        <Badge variant="outline" className="text-xs">{req.resourceType}</Badge>
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {formatBytes(req.transferSize)}
                      </td>
                      <td className="py-2 text-right text-muted-foreground">
                        {req.endTime ? `${Math.round((req.endTime - req.startTime) * 1000)}ms` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 诊断标签页
function DiagnosticsTab({ audits }: { audits: Record<string, any> }) {
  const diagnosticIds = [
    "mainthread-work-breakdown",
    "bootup-time",
    "uses-long-cache-ttl",
    "total-byte-weight",
    "dom-size",
    "js-libraries",
    "no-vulnerable-libraries",
    "deprecations",
    "errors-in-console",
    "valid-source-maps",
    "insight-content-width",
  ];

  const diagnostics = diagnosticIds
    .map((id) => ({ id, audit: audits[id] }))
    .filter(({ audit }) => audit && audit.score !== null)
    .sort((a, b) => (a.audit.score || 0) - (b.audit.score || 0));

  const passedCount = diagnostics.filter(({ audit }) => audit.score === 1).length;
  const failedCount = diagnostics.filter(({ audit }) => audit.score === 0).length;
  const warningCount = diagnostics.filter(({ audit }) => audit.score !== 0 && audit.score !== 1).length;

  return (
    <div className="space-y-6">
      {/* 诊断统计 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{passedCount}</div>
            <div className="text-sm text-green-700">通过</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-yellow-700">警告</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-red-700">失败</div>
          </CardContent>
        </Card>
      </div>

      {/* 诊断列表 */}
      <div className="space-y-3">
        {diagnostics.map(({ id, audit }) => (
          <DiagnosticItem key={id} audit={audit} />
        ))}
      </div>
    </div>
  );
}

// 诊断项
function DiagnosticItem({ audit }: { audit: any }) {
  const getIcon = () => {
    if (audit.score === 1) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (audit.score === 0) return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <Card className={audit.score === 0 ? "border-red-200" : audit.score === 1 ? "border-green-200" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {getIcon()}
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
      </CardContent>
    </Card>
  );
}

// 详细检查标签页
function DetailsTab({ audits }: { audits: Record<string, any> }) {
  const [activeCategory, setActiveCategory] = useState<"accessibility" | "best-practices" | "seo">("accessibility");

  const categories = {
    accessibility: {
      title: "可访问性检查",
      icon: <LayoutGrid className="h-5 w-5" />,
      audits: Object.entries(audits).filter(([_, audit]: [string, any]) => 
        audit?.description?.toLowerCase().includes("accessibility") || 
        audit?.title?.toLowerCase().includes("aria") ||
        audit?.title?.toLowerCase().includes("screen reader")
      ),
    },
    "best-practices": {
      title: "最佳实践检查",
      icon: <Shield className="h-5 w-5" />,
      audits: Object.entries(audits).filter(([_, audit]: [string, any]) => 
        audit?.id?.includes("https") ||
        audit?.id?.includes("security") ||
        audit?.id?.includes("vulnerable") ||
        audit?.id?.includes("deprecat")
      ),
    },
    seo: {
      title: "SEO 检查",
      icon: <Search className="h-5 w-5" />,
      audits: Object.entries(audits).filter(([_, audit]: [string, any]) => 
        audit?.id?.includes("seo") ||
        audit?.id?.includes("crawlable") ||
        audit?.id?.includes("canonical") ||
        audit?.id?.includes("meta")
      ),
    },
  };

  return (
    <div className="space-y-4">
      {/* 分类切换 */}
      <div className="flex items-center gap-2">
        {(Object.keys(categories) as Array<keyof typeof categories>).map((key) => (
          <Button
            key={key}
            variant={activeCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(key)}
            className="gap-2"
          >
            {categories[key].icon}
            {categories[key].title}
          </Button>
        ))}
      </div>

      {/* 检查项列表 */}
      <div className="space-y-2">
        {categories[activeCategory].audits.slice(0, 20).map(([key, audit]: [string, any]) => (
          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">{audit.title || key}</div>
              {audit.description && (
                <p className="text-xs text-muted-foreground">{audit.description.slice(0, 100)}...</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {audit.score === 1 && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              {audit.score === 0 && <XCircle className="h-5 w-5 text-red-500" />}
              {audit.score !== undefined && audit.score !== 1 && audit.score !== 0 && (
                <span className="text-sm font-medium">{Math.round(audit.score * 100)}</span>
              )}
              {audit.score === null && <span className="text-xs text-muted-foreground">N/A</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 工具函数
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

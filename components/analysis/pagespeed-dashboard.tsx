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
import { CoreWebVitalsData } from "@/lib/types/diagnosis";

interface PageSpeedDashboardProps {
  mobileData: CoreWebVitalsData;
  desktopData?: CoreWebVitalsData;
  url: string;
}

export function PageSpeedDashboard({ mobileData, desktopData, url }: PageSpeedDashboardProps) {
  const [activeDevice, setActiveDevice] = useState<"mobile" | "desktop">("mobile");
  
  const data = activeDevice === "mobile" ? mobileData : (desktopData || mobileData);

  // 计算总体评分
  const overallScore = Math.round(
    ((data.scores.performance || 0) * 0.4 +
      (data.scores.accessibility || 0) * 0.2 +
      (data.scores.bestPractices || 0) * 0.2 +
      (data.scores.seo || 0) * 0.2)
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
        timestamp={data.timestamp}
      />

      {/* 核心评分卡片 */}
      <ScoreCards scores={data.scores} />

      {/* 详细数据标签页 */}
      <Tabs defaultValue="cwv" className="w-full">
        <TabsList className="grid w-full grid-cols-6 h-auto">
          <TabsTrigger value="cwv" className="text-xs sm:text-sm">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs sm:text-sm">性能指标</TabsTrigger>
          <TabsTrigger value="opportunities" className="text-xs sm:text-sm">优化机会</TabsTrigger>
          <TabsTrigger value="diagnostics" className="text-xs sm:text-sm">诊断</TabsTrigger>
          <TabsTrigger value="summary" className="text-xs sm:text-sm">分析摘要</TabsTrigger>
        </TabsList>

        <TabsContent value="cwv" className="mt-6">
          <CoreWebVitalsTab data={data} />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <MetricsTab data={data} />
        </TabsContent>

        <TabsContent value="opportunities" className="mt-6">
          <OpportunitiesTab data={data} />
        </TabsContent>

        <TabsContent value="diagnostics" className="mt-6">
          <DiagnosticsTab data={data} />
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <SummaryTab data={data} />
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

          {/* 右侧：设备切换 */}
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
          </div>
        </div>
      </div>
    </Card>
  );
}

// 评分卡片
function ScoreCards({
  scores,
}: {
  scores: CoreWebVitalsData["scores"];
}) {
  const cards = [
    {
      key: "performance",
      title: "性能",
      score: scores.performance,
      icon: <Zap className="h-5 w-5" />,
      description: "加载速度和交互响应",
      color: "from-orange-500 to-red-500",
    },
    {
      key: "accessibility",
      title: "可访问性",
      score: scores.accessibility,
      icon: <LayoutGrid className="h-5 w-5" />,
      description: "残障用户友好度",
      color: "from-blue-500 to-cyan-500",
    },
    {
      key: "bestPractices",
      title: "最佳实践",
      score: scores.bestPractices,
      icon: <Shield className="h-5 w-5" />,
      description: "代码质量和安全性",
      color: "from-green-500 to-emerald-500",
    },
    {
      key: "seo",
      title: "SEO",
      score: scores.seo,
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
function CoreWebVitalsTab({ data }: { data: CoreWebVitalsData }) {
  const { coreWebVitals } = data;
  const { labData, fieldData } = coreWebVitals;

  const metrics = [
    { 
      name: "LCP", 
      fullName: "Largest Contentful Paint", 
      desc: "最大内容绘制",
      labValue: labData.lcp,
      fieldValue: fieldData?.lcp,
      thresholds: { good: 2500, poor: 4000 },
      unit: "ms"
    },
    { 
      name: "FCP", 
      fullName: "First Contentful Paint", 
      desc: "首次内容绘制",
      labValue: labData.fcp,
      fieldValue: undefined, // FCP 不在 fieldData 中
      thresholds: { good: 1800, poor: 3000 },
      unit: "ms"
    },
    { 
      name: "CLS", 
      fullName: "Cumulative Layout Shift", 
      desc: "累积布局偏移",
      labValue: labData.cls,
      fieldValue: fieldData?.cls,
      thresholds: { good: 0.1, poor: 0.25 },
      unit: ""
    },
    { 
      name: "TBT", 
      fullName: "Total Blocking Time", 
      desc: "总阻塞时间",
      labValue: labData.tbt,
      thresholds: { good: 200, poor: 600 },
      unit: "ms"
    },
    { 
      name: "SI", 
      fullName: "Speed Index", 
      desc: "速度指数",
      labValue: labData.speedIndex,
      thresholds: { good: 3400, poor: 5800 },
      unit: "ms"
    },
    { 
      name: "TTI", 
      fullName: "Time to Interactive", 
      desc: "可交互时间",
      labValue: labData.tti,
      thresholds: { good: 3800, poor: 7300 },
      unit: "ms"
    },
  ];

  return (
    <div className="space-y-6">
      {/* 实验室数据 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Core Web Vitals (实验室数据)
          </CardTitle>
          <CardDescription>
            Lighthouse 模拟测试的性能指标
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <CWVCard
                key={metric.name}
                name={metric.name}
                fullName={metric.fullName}
                description={metric.desc}
                labValue={metric.labValue}
                fieldValue={metric.fieldValue}
                thresholds={metric.thresholds}
                unit={metric.unit}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 真实用户数据 */}
      {fieldData && (
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
                    <p>基于 Chrome 真实用户的体验数据</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              过去 28 天真实用户的访问体验
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {metrics.filter(m => m.fieldValue).map((metric) => (
                <div key={metric.name} className={`p-4 rounded-lg border ${
                  metric.fieldValue?.rating === "good" ? "border-green-200 bg-green-50" :
                  metric.fieldValue?.rating === "poor" ? "border-red-200 bg-red-50" :
                  "border-yellow-200 bg-yellow-50"
                }`}>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                  <div className={`text-2xl font-bold ${
                    metric.fieldValue?.rating === "good" ? "text-green-600" :
                    metric.fieldValue?.rating === "poor" ? "text-red-600" :
                    "text-yellow-600"
                  }`}>
                    {metric.unit === "" 
                      ? (metric.fieldValue?.value || 0).toFixed(3)
                      : `${Math.round(metric.fieldValue?.value || 0)}${metric.unit}`
                    }
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {metric.fieldValue?.rating === "good" ? "良好" :
                     metric.fieldValue?.rating === "poor" ? "较差" : "需改进"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Core Web Vital 卡片
function CWVCard({
  name,
  fullName,
  description,
  labValue,
  fieldValue,
  thresholds,
  unit,
}: {
  name: string;
  fullName: string;
  description: string;
  labValue: { value: number; score: number; rating?: string };
  fieldValue?: { value: number; rating: string };
  thresholds: { good: number; poor: number };
  unit: string;
}) {
  const rating = labValue.rating || "needs-improvement";
  
  const getCategoryColor = (r: string) => {
    switch (r) {
      case "good": return "border-green-200 bg-green-50 text-green-700";
      case "needs-improvement": return "border-yellow-200 bg-yellow-50 text-yellow-700";
      case "poor": return "border-red-200 bg-red-50 text-red-700";
      default: return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const displayValue = unit === "" ? labValue.value.toFixed(3) : `${Math.round(labValue.value)}${unit}`;

  return (
    <div className={`p-4 rounded-lg border ${getCategoryColor(rating)}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{displayValue}</span>
            {rating === "good" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> :
             rating === "poor" ? <XCircle className="h-5 w-5 text-red-500" /> :
             <AlertTriangle className="h-5 w-5 text-yellow-500" />}
          </div>
          <div className="mt-1">
            <span className="font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground ml-1">({fullName})</span>
          </div>
          <p className="text-xs opacity-80 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-current border-opacity-20">
        <div className="flex items-center justify-between text-xs">
          <span>≤ {thresholds.good}{unit} 良好</span>
          <Badge variant="outline" className="text-xs">
            {rating === "good" ? "良好" : rating === "poor" ? "较差" : "需改进"}
          </Badge>
        </div>
        <div className="mt-2">
          <Progress value={labValue.score * 100} className="h-1" />
        </div>
      </div>
    </div>
  );
}

// 性能指标标签页
function MetricsTab({ data }: { data: CoreWebVitalsData }) {
  const { labData } = data.coreWebVitals;
  
  const metrics = [
    { label: "LCP", value: labData.lcp.value, unit: "ms", desc: "最大内容绘制" },
    { label: "FCP", value: labData.fcp.value, unit: "ms", desc: "首次内容绘制" },
    { label: "CLS", value: labData.cls.value, unit: "", desc: "累积布局偏移" },
    { label: "TBT", value: labData.tbt.value, unit: "ms", desc: "总阻塞时间" },
    { label: "Speed Index", value: labData.speedIndex.value, unit: "ms", desc: "速度指数" },
    { label: "TTI", value: labData.tti.value, unit: "ms", desc: "可交互时间" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">{metric.desc}</div>
            <div className="text-2xl font-bold mt-1">
              {metric.unit === "" ? metric.value.toFixed(3) : `${Math.round(metric.value)}${metric.unit}`}
            </div>
            <div className="text-xs text-muted-foreground">{metric.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 优化机会标签页
function OpportunitiesTab({ data }: { data: CoreWebVitalsData }) {
  const { issues, recommendations, overallRating } = data.summary;

  return (
    <div className="space-y-6">
      {/* 总体评估 */}
      <Card className={`${
        overallRating === "excellent" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" :
        overallRating === "good" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" :
        overallRating === "needs-improvement" ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white" :
        "bg-gradient-to-r from-red-500 to-pink-500 text-white"
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">总体评估</p>
              <div className="text-2xl font-bold mt-1">
                {overallRating === "excellent" ? "性能优秀" :
                 overallRating === "good" ? "性能良好" :
                 overallRating === "needs-improvement" ? "需要改进" : "性能较差"}
              </div>
            </div>
            {overallRating === "excellent" || overallRating === "good" ? 
              <TrendingUp className="h-12 w-12 text-white/50" /> :
              <TrendingDown className="h-12 w-12 text-white/50" />
            }
          </div>
        </CardContent>
      </Card>

      {/* 发现问题 */}
      {issues.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              发现的问题 ({issues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 优化建议 */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              优化建议 ({recommendations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 诊断标签页
function DiagnosticsTab({ data }: { data: CoreWebVitalsData }) {
  const { labData } = data.coreWebVitals;
  
  const diagnostics = [
    { name: "LCP", value: labData.lcp.value, threshold: 2500, unit: "ms", desc: "最大内容绘制" },
    { name: "FCP", value: labData.fcp.value, threshold: 1800, unit: "ms", desc: "首次内容绘制" },
    { name: "CLS", value: labData.cls.value, threshold: 0.1, unit: "", desc: "累积布局偏移" },
    { name: "TBT", value: labData.tbt.value, threshold: 200, unit: "ms", desc: "总阻塞时间" },
  ];

  const passed = diagnostics.filter(d => d.value <= d.threshold).length;
  const failed = diagnostics.filter(d => d.value > d.threshold).length;

  return (
    <div className="space-y-6">
      {/* 诊断统计 */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{passed}</div>
            <div className="text-sm text-green-700">通过</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{failed}</div>
            <div className="text-sm text-red-700">未通过</div>
          </CardContent>
        </Card>
      </div>

      {/* 诊断详情 */}
      <div className="space-y-3">
        {diagnostics.map((diag) => {
          const isPass = diag.value <= diag.threshold;
          return (
            <Card key={diag.name} className={isPass ? "border-green-200" : "border-red-200"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPass ? 
                      <CheckCircle2 className="h-5 w-5 text-green-500" /> : 
                      <XCircle className="h-5 w-5 text-red-500" />
                    }
                    <div>
                      <h4 className="font-medium">{diag.name} - {diag.desc}</h4>
                      <p className="text-sm text-muted-foreground">
                        阈值: ≤ {diag.threshold}{diag.unit}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${isPass ? "text-green-600" : "text-red-600"}`}>
                    {diag.unit === "" ? diag.value.toFixed(3) : `${Math.round(diag.value)}${diag.unit}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// 分析摘要标签页
function SummaryTab({ data }: { data: CoreWebVitalsData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>分析摘要</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">URL</div>
            <div className="text-sm font-medium truncate">{data.url}</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">策略</div>
            <div className="text-sm font-medium">{data.strategy === "mobile" ? "移动端" : "桌面端"}</div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-medium mb-2">四大类别评分</h4>
          <div className="space-y-2">
            {[
              { label: "性能", score: data.scores.performance, icon: <Zap className="h-4 w-4" /> },
              { label: "可访问性", score: data.scores.accessibility, icon: <LayoutGrid className="h-4 w-4" /> },
              { label: "最佳实践", score: data.scores.bestPractices, icon: <Shield className="h-4 w-4" /> },
              { label: "SEO", score: data.scores.seo, icon: <Search className="h-4 w-4" /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={item.score} className="w-24 h-2" />
                  <span className={`font-bold ${
                    item.score >= 90 ? "text-green-500" :
                    item.score >= 70 ? "text-yellow-500" : "text-red-500"
                  }`}>
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="text-sm text-muted-foreground">
          分析时间: {new Date(data.timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

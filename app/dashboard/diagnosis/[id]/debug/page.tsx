"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Download, Smartphone, Monitor, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PerformancePanelV2 } from "@/components/analysis/performance-panel-v2";

export default function DebugPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [url, setUrl] = useState("");
  const [mobileData, setMobileData] = useState<any>(null);
  const [desktopData, setDesktopData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // 从 localStorage 或查询参数获取 URL
    const stored = localStorage.getItem(`diagnosis-${id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUrl(parsed.url);
      
      setIsLoading(true);
      setError(null);

      try {
        // 获取移动端数据
        const mobileRes = await fetch(`/api/debug/pagespeed?url=${encodeURIComponent(parsed.url)}&strategy=mobile`);
        if (!mobileRes.ok) throw new Error("Failed to fetch mobile data");
        const mobile = await mobileRes.json();
        setMobileData(mobile);

        // 获取桌面端数据
        const desktopRes = await fetch(`/api/debug/pagespeed?url=${encodeURIComponent(parsed.url)}&strategy=desktop`);
        if (!desktopRes.ok) throw new Error("Failed to fetch desktop data");
        const desktop = await desktopRes.json();
        setDesktopData(desktop);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const downloadJson = () => {
    const data = {
      url,
      mobile: mobileData,
      desktop: desktopData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url2;
    a.download = `pagespeed-debug-${id}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/diagnosis/${id}/analysis`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回分析
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">API 调试工具</h1>
              <p className="text-sm text-muted-foreground">{url}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              刷新
            </Button>
            <Button variant="outline" size="sm" onClick={downloadJson} disabled={!mobileData}>
              <Download className="mr-2 h-4 w-4" />
              导出 JSON
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">可视化展示</TabsTrigger>
            <TabsTrigger value="raw">原始 JSON</TabsTrigger>
            <TabsTrigger value="audits">所有 Audits</TabsTrigger>
          </TabsList>

          {/* 可视化展示 */}
          <TabsContent value="visual">
            <PerformancePanelV2
              url={url}
              mobileData={mobileData}
              desktopData={desktopData}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* 原始 JSON */}
          <TabsContent value="raw">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  移动端数据
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                  {JSON.stringify(mobileData, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {desktopData && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    桌面端数据
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                    {JSON.stringify(desktopData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 所有 Audits */}
          <TabsContent value="audits">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">所有 Audits ({mobileData?.lighthouseResult?.audits ? Object.keys(mobileData.lighthouseResult.audits).length : 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : mobileData?.lighthouseResult?.audits ? (
                  <div className="grid gap-2 max-h-96 overflow-auto">
                    {Object.entries(mobileData.lighthouseResult.audits).map(([key, audit]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{audit.title || key}</div>
                          <div className="text-xs text-muted-foreground font-mono">{key}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {audit.score !== null && (
                            <Badge variant={audit.score === 1 ? "default" : audit.score === 0 ? "destructive" : "secondary"}>
                              {audit.score === 1 ? "通过" : audit.score === 0 ? "失败" : Math.round(audit.score * 100)}
                            </Badge>
                          )}
                          {audit.displayValue && (
                            <span className="text-xs text-muted-foreground">{audit.displayValue}</span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {audit.scoreDisplayMode}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">暂无数据</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

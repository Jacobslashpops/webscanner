"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageSpeedDashboard } from "@/components/analysis/pagespeed-dashboard";

export default function DebugPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [url, setUrl] = useState("");
  const [mobileData, setMobileData] = useState<any>(null);
  const [desktopData, setDesktopData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    // 从 localStorage 获取 URL
    const stored = localStorage.getItem(`diagnosis-${id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setUrl(parsed.url);
      
      setIsLoading(true);
      setError(null);

      try {
        // 获取移动端数据
        const mobileRes = await fetch(`/api/debug/pagespeed?url=${encodeURIComponent(parsed.url)}&strategy=mobile`);
        if (!mobileRes.ok) {
          const err = await mobileRes.json();
          throw new Error(err.message || "移动端分析失败");
        }
        const mobile = await mobileRes.json();
        setMobileData(mobile);

        // 等待避免 QPS 限制
        await new Promise(resolve => setTimeout(resolve, 1100));
        
        // 获取桌面端数据
        const desktopRes = await fetch(`/api/debug/pagespeed?url=${encodeURIComponent(parsed.url)}&strategy=desktop`);
        if (desktopRes.ok) {
          const desktop = await desktopRes.json();
          setDesktopData(desktop);
        }
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
    a.download = `pagespeed-${id}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 固定顶部导航 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto py-4 px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/diagnosis/${id}/analysis`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回分析
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">PageSpeed Insights 详细报告</h1>
                {url && <p className="text-sm text-muted-foreground truncate max-w-md">{url}</p>}
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
        </div>
      </div>

      {/* 主内容 */}
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {isLoading ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">正在获取 PageSpeed Insights 数据...</p>
                <p className="text-sm text-muted-foreground mt-2">请稍候，这可能需要几秒钟</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <Button variant="outline" className="mt-4" onClick={fetchData}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重试
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : mobileData ? (
          <PageSpeedDashboard
            mobileData={mobileData}
            desktopData={desktopData}
            url={url}
          />
        ) : null}
      </div>
    </div>
  );
}

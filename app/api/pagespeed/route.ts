import { NextRequest, NextResponse } from "next/server";

// Google PageSpeed Insights API 响应类型
interface PagespeedResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
      accessibility?: { score: number };
      "best-practices"?: { score: number };
      seo?: { score: number };
    };
    audits?: {
      "first-contentful-paint"?: { score: number; displayValue: string };
      "largest-contentful-paint"?: { score: number; displayValue: string };
      "first-input-delay"?: { score: number; displayValue: string };
      "cumulative-layout-shift"?: { score: number; displayValue: string };
      "speed-index"?: { score: number; displayValue: string };
      "total-blocking-time"?: { score: number; displayValue: string };
      "interactive"?: { score: number; displayValue: string };
      [key: string]: { score: number; displayValue: string } | undefined;
    };
  };
  loadingExperience?: {
    metrics?: {
      LARGEST_CONTENTFUL_PAINT_MS?: { percentile: number };
      FIRST_INPUT_DELAY_MS?: { percentile: number };
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: { percentile: number };
    };
    overall_category?: string;
  };
  analysisUTCTimestamp?: string;
  error?: {
    code: string;
    message: string;
  };
}

// Core Web Vitals 阈值定义
const CWV_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 },   // First Input Delay (ms)
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const strategy = searchParams.get("strategy") || "mobile";

  if (!url) {
    return NextResponse.json(
      { error: "URL is required" },
      { status: 400 }
    );
  }

  // 验证 URL 格式
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL format" },
      { status: 400 }
    );
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { 
        error: "PageSpeed API key not configured",
        message: "Please set PAGESPEED_API_KEY in environment variables"
      },
      { status: 500 }
    );
  }

  try {
    // 调用 Google PageSpeed Insights API
    const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    apiUrl.searchParams.append("url", url);
    apiUrl.searchParams.append("key", apiKey);
    apiUrl.searchParams.append("strategy", strategy);
    // 请求所有 Lighthouse 类别
    apiUrl.searchParams.append("category", "PERFORMANCE");
    apiUrl.searchParams.append("category", "ACCESSIBILITY");
    apiUrl.searchParams.append("category", "BEST_PRACTICES");
    apiUrl.searchParams.append("category", "SEO");

    const response = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed: ${response.status}`
      );
    }

    const data: PagespeedResponse = await response.json();

    // 解析 Core Web Vitals
    const lighthouse = data.lighthouseResult;
    const fieldData = data.loadingExperience;

    // 提取关键指标
    const coreWebVitals = {
      // Lab Data (Lighthouse)
      labData: {
        lcp: {
          value: parseMetricValue(lighthouse?.audits?.["largest-contentful-paint"]?.displayValue),
          score: lighthouse?.audits?.["largest-contentful-paint"]?.score || 0,
          rating: getRating(
            parseMetricValue(lighthouse?.audits?.["largest-contentful-paint"]?.displayValue),
            CWV_THRESHOLDS.LCP
          ),
        },
        fid: {
          value: parseMetricValue(fieldData?.metrics?.FIRST_INPUT_DELAY_MS?.percentile?.toString()),
          score: 0, // FID 只在 field data 中
          rating: getRating(
            fieldData?.metrics?.FIRST_INPUT_DELAY_MS?.percentile || 0,
            CWV_THRESHOLDS.FID
          ),
        },
        cls: {
          value: parseFloat(lighthouse?.audits?.["cumulative-layout-shift"]?.displayValue || "0"),
          score: lighthouse?.audits?.["cumulative-layout-shift"]?.score || 0,
          rating: getRating(
            parseFloat(lighthouse?.audits?.["cumulative-layout-shift"]?.displayValue || "0"),
            CWV_THRESHOLDS.CLS
          ),
        },
        fcp: {
          value: parseMetricValue(lighthouse?.audits?.["first-contentful-paint"]?.displayValue),
          score: lighthouse?.audits?.["first-contentful-paint"]?.score || 0,
          rating: getRating(
            parseMetricValue(lighthouse?.audits?.["first-contentful-paint"]?.displayValue),
            CWV_THRESHOLDS.FCP
          ),
        },
        tbt: {
          value: parseMetricValue(lighthouse?.audits?.["total-blocking-time"]?.displayValue),
          score: lighthouse?.audits?.["total-blocking-time"]?.score || 0,
        },
        speedIndex: {
          value: parseMetricValue(lighthouse?.audits?.["speed-index"]?.displayValue),
          score: lighthouse?.audits?.["speed-index"]?.score || 0,
        },
        tti: {
          value: parseMetricValue(lighthouse?.audits?.["interactive"]?.displayValue),
          score: lighthouse?.audits?.["interactive"]?.score || 0,
        },
      },
      // Field Data (CrUX - 真实用户数据)
      fieldData: fieldData?.metrics
        ? {
            lcp: {
              value: fieldData.metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile || 0,
              rating: getRating(
                fieldData.metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile || 0,
                CWV_THRESHOLDS.LCP
              ),
            },
            fid: {
              value: fieldData.metrics.FIRST_INPUT_DELAY_MS?.percentile || 0,
              rating: getRating(
                fieldData.metrics.FIRST_INPUT_DELAY_MS?.percentile || 0,
                CWV_THRESHOLDS.FID
              ),
            },
            cls: {
              value: (fieldData.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || 0) / 100,
              rating: getRating(
                (fieldData.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || 0) / 100,
                CWV_THRESHOLDS.CLS
              ),
            },
            origin: data.loadingExperience?.overall_category || "UNKNOWN",
          }
        : null,
    };

    // 构建响应
    const result = {
      url,
      strategy,
      timestamp: data.analysisUTCTimestamp,
      scores: {
        performance: Math.round((lighthouse?.categories?.performance?.score || 0) * 100),
        accessibility: Math.round((lighthouse?.categories?.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lighthouse?.categories?.["best-practices"]?.score || 0) * 100),
        seo: Math.round((lighthouse?.categories?.seo?.score || 0) * 100),
      },
      coreWebVitals,
      summary: generateSummary(coreWebVitals, lighthouse?.categories?.performance?.score || 0),
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error("PageSpeed API Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to analyze website",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// 解析指标值（移除单位并转换为数字）
function parseMetricValue(value: string | undefined): number {
  if (!value) return 0;
  // 移除单位如 "s", "ms" 等
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  // 如果是秒，转换为毫秒
  if (value.includes("s") && !value.includes("ms")) {
    return numeric * 1000;
  }
  return numeric;
}

// 获取评级（good, needs-improvement, poor）
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

// 生成分析摘要
function generateSummary(
  cwv: any,
  performanceScore: number
): {
  overallRating: "excellent" | "good" | "needs-improvement" | "poor";
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // 检查 Core Web Vitals
  const labData = cwv.labData;
  
  if (labData.lcp.rating !== "good") {
    issues.push(`LCP (${formatTime(labData.lcp.value)}) 需要优化`);
    recommendations.push("优化 Largest Contentful Paint：压缩图片、使用 WebP 格式、启用 CDN");
  }
  
  if (labData.cls.rating !== "good") {
    issues.push(`CLS (${labData.cls.value.toFixed(3)}) 需要优化`);
    recommendations.push("优化 Cumulative Layout Shift：为图片预留尺寸、避免插入内容到已有内容上方");
  }

  if (labData.fcp.rating !== "good") {
    issues.push(`FCP (${formatTime(labData.fcp.value)}) 较慢`);
    recommendations.push("优化 First Contentful Paint：移除阻塞渲染的资源、内联关键 CSS");
  }

  // 性能评分评级
  let overallRating: "excellent" | "good" | "needs-improvement" | "poor";
  const score = performanceScore * 100;
  if (score >= 90) overallRating = "excellent";
  else if (score >= 70) overallRating = "good";
  else if (score >= 50) overallRating = "needs-improvement";
  else overallRating = "poor";

  if (issues.length === 0) {
    recommendations.push("您的网站性能表现优秀！继续保持良好的优化实践。");
  }

  return { overallRating, issues, recommendations };
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

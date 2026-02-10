// 诊断类型定义

export type DiagnosisType = "b2b" | "b2c";

export type DiagnosisStatus = 
  | "pending"     // 等待开始
  | "analyzing"   // 分析中
  | "completed"   // 完成
  | "failed";     // 失败

export type AnalysisStep = 
  | "init"
  | "performance"        // 性能 & Core Web Vitals (第一步)
  | "analyzing-structure" // 分析网站结构
  | "analyzing-content"   // 分析内容
  | "analyzing-seo"       // 分析 SEO
  | "analyzing-design"    // 分析设计
  | "analyzing-security"  // 分析安全
  | "generating-report";  // 生成报告

export interface AnalysisStepInfo {
  id: AnalysisStep;
  label: string;
  description: string;
  order: number;
}

export const ANALYSIS_STEPS: AnalysisStepInfo[] = [
  { id: "init", label: "准备开始", description: "初始化分析环境", order: 0 },
  { id: "performance", label: "性能 & Core Web Vitals", description: "使用 Google PageSpeed Insights 分析网站性能", order: 1 },
  { id: "analyzing-structure", label: "结构分析", description: "分析网站架构和导航", order: 2 },
  { id: "analyzing-content", label: "内容分析", description: "分析页面内容和文案", order: 3 },
  { id: "analyzing-seo", label: "SEO 分析", description: "检查 SEO 优化情况", order: 4 },
  { id: "analyzing-design", label: "设计分析", description: "分析视觉设计和用户体验", order: 5 },
  { id: "analyzing-security", label: "安全分析", description: "检查安全漏洞", order: 6 },
  { id: "generating-report", label: "生成报告", description: "汇总分析结果", order: 7 },
];

// Core Web Vitals 数据
export interface CoreWebVitalsData {
  url: string;
  strategy: string;
  timestamp: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: {
    labData: {
      lcp: { value: number; score: number; rating: "good" | "needs-improvement" | "poor" };
      fid: { value: number; score: number; rating: "good" | "needs-improvement" | "poor" };
      cls: { value: number; score: number; rating: "good" | "needs-improvement" | "poor" };
      fcp: { value: number; score: number; rating: "good" | "needs-improvement" | "poor" };
      tbt: { value: number; score: number };
      speedIndex: { value: number; score: number };
      tti: { value: number; score: number };
    };
    fieldData: {
      lcp: { value: number; rating: "good" | "needs-improvement" | "poor" };
      fid: { value: number; rating: "good" | "needs-improvement" | "poor" };
      cls: { value: number; rating: "good" | "needs-improvement" | "poor" };
      origin: string;
    } | null;
  };
  summary: {
    overallRating: "excellent" | "good" | "needs-improvement" | "poor";
    issues: string[];
    recommendations: string[];
  };
}

// 性能分析结果（包含移动端和桌面端）
export interface PerformanceResultData {
  mobile: CoreWebVitalsData;
  desktop?: CoreWebVitalsData;
  analyzedAt: string;
}

export interface Diagnosis {
  id: string;
  url: string;
  type: DiagnosisType;
  status: DiagnosisStatus;
  currentStep: AnalysisStep;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  score?: number; // 0-100
  // 各步骤的详细结果
  results?: {
    performance?: PerformanceResultData;
    structure?: any;
    content?: any;
    seo?: any;
    design?: any;
    security?: any;
  };
  findings?: DiagnosisFinding[];
}

export interface DiagnosisFinding {
  id: string;
  category: "performance" | "structure" | "content" | "seo" | "design" | "security";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  recommendation?: string;
}

// 新建诊断表单数据
export interface NewDiagnosisForm {
  url: string;
  type: DiagnosisType;
}

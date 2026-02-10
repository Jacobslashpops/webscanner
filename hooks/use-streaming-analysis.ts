"use client";

import { useState, useCallback, useRef } from "react";
import { CoreWebVitalsData } from "@/lib/types/diagnosis";

// 分析阶段定义
export type AnalysisPhase = 
  | "connecting"      // 连接API
  | "fetching"        // 获取原始数据
  | "parsing-scores"  // 解析四大评分
  | "parsing-cwv"     // 解析Core Web Vitals
  | "analyzing-issues" // 分析问题
  | "generating-insights" // 生成洞察
  | "complete";       // 完成

export interface PhaseInfo {
  id: AnalysisPhase;
  label: string;
  description: string;
  thinkingMessages: string[];
}

export const ANALYSIS_PHASES: PhaseInfo[] = [
  {
    id: "connecting",
    label: "连接服务",
    description: "正在建立与Google PageSpeed Insights的连接",
    thinkingMessages: [
      "正在初始化分析环境...",
      "正在连接到Google PageSpeed Insights API...",
      "连接已建立，准备发送请求...",
    ],
  },
  {
    id: "fetching",
    label: "获取数据",
    description: "正在获取网站性能数据",
    thinkingMessages: [
      "正在发送分析请求...",
      "正在等待服务器响应...",
      "正在下载性能数据包...",
      "数据接收中，已接收 {progress}%...",
    ],
  },
  {
    id: "parsing-scores",
    label: "解析评分",
    description: "正在解析四大类别评分",
    thinkingMessages: [
      "正在解析Performance评分...",
      "正在解析Accessibility评分...",
      "正在解析Best Practices评分...",
      "正在解析SEO评分...",
      "四大类别评分解析完成",
    ],
  },
  {
    id: "parsing-cwv",
    label: "分析Web Vitals",
    description: "正在分析Core Web Vitals指标",
    thinkingMessages: [
      "正在分析Largest Contentful Paint (LCP)...",
      "正在分析First Contentful Paint (FCP)...",
      "正在分析Cumulative Layout Shift (CLS)...",
      "正在分析Total Blocking Time (TBT)...",
      "正在分析Speed Index和TTI...",
      "Core Web Vitals分析完成",
    ],
  },
  {
    id: "analyzing-issues",
    label: "检测问题",
    description: "正在检测性能问题和优化机会",
    thinkingMessages: [
      "正在扫描渲染阻塞资源...",
      "正在分析JavaScript执行效率...",
      "正在检查图片优化机会...",
      "正在分析缓存策略...",
      "正在检测未使用的CSS/JavaScript...",
      "问题检测完成，发现{issuesCount}个问题",
    ],
  },
  {
    id: "generating-insights",
    label: "生成洞察",
    description: "正在生成优化建议和洞察",
    thinkingMessages: [
      "正在分析性能瓶颈...",
      "正在评估优化优先级...",
      "正在生成具体优化建议...",
      "正在计算潜在收益...",
      "正在整理分析报告...",
      "分析完成！",
    ],
  },
];

export interface StreamingState {
  currentPhase: AnalysisPhase;
  phaseProgress: number; // 0-100
  currentThinkingMessage: string;
  completedPhases: AnalysisPhase[];
  data?: CoreWebVitalsData;
  error?: string;
}

export function useStreamingAnalysis() {
  const [state, setState] = useState<StreamingState>({
    currentPhase: "connecting",
    phaseProgress: 0,
    currentThinkingMessage: ANALYSIS_PHASES[0].thinkingMessages[0],
    completedPhases: [],
  });

  const abortRef = useRef(false);

  // 模拟思考消息流
  const streamThinkingMessages = useCallback(async (
    phase: AnalysisPhase,
    onMessage: (message: string) => void,
    duration: number = 2000
  ) => {
    const phaseInfo = ANALYSIS_PHASES.find(p => p.id === phase);
    if (!phaseInfo) return;

    const messages = phaseInfo.thinkingMessages;
    const interval = duration / messages.length;

    for (let i = 0; i < messages.length; i++) {
      if (abortRef.current) break;
      
      let message = messages[i];
      // 替换变量
      message = message.replace("{progress}", Math.round(((i + 1) / messages.length) * 100).toString());
      
      onMessage(message);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }, []);

  // 开始流式分析
  const startAnalysis = useCallback(async (
    url: string,
    strategy: "mobile" | "desktop" = "mobile",
    onProgress?: (state: StreamingState) => void
  ): Promise<CoreWebVitalsData | null> => {
    abortRef.current = false;
    
    const updateState = (updates: Partial<StreamingState>) => {
      setState(prev => {
        const newState = { ...prev, ...updates };
        onProgress?.(newState);
        return newState;
      });
    };

    try {
      // Phase 1: 连接
      updateState({ currentPhase: "connecting", phaseProgress: 0 });
      await streamThinkingMessages("connecting", (msg) => {
        updateState({ currentThinkingMessage: msg });
      }, 1500);

      if (abortRef.current) return null;

      // Phase 2: 获取数据
      updateState({ 
        currentPhase: "fetching", 
        phaseProgress: 20,
        completedPhases: ["connecting"],
      });

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setState((prev: StreamingState) => {
          const newState = {
            ...prev,
            phaseProgress: Math.min(prev.phaseProgress + 5, 45),
          };
          onProgress?.(newState);
          return newState;
        });
      }, 300);

      await streamThinkingMessages("fetching", (msg) => {
        updateState({ currentThinkingMessage: msg });
      }, 2000);

      // 实际API调用
      const response = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "分析失败");
      }

      const data: CoreWebVitalsData = await response.json();

      if (abortRef.current) return null;

      // Phase 3: 解析评分
      updateState({ 
        currentPhase: "parsing-scores", 
        phaseProgress: 50,
        completedPhases: ["connecting", "fetching"],
      });
      await streamThinkingMessages("parsing-scores", (msg) => {
        updateState({ currentThinkingMessage: msg });
      }, 1500);

      if (abortRef.current) return null;

      // Phase 4: 解析CWV
      updateState({ 
        currentPhase: "parsing-cwv", 
        phaseProgress: 65,
        completedPhases: ["connecting", "fetching", "parsing-scores"],
      });
      await streamThinkingMessages("parsing-cwv", (msg) => {
        updateState({ currentThinkingMessage: msg });
      }, 1800);

      if (abortRef.current) return null;

      // Phase 5: 分析问题
      updateState({ 
        currentPhase: "analyzing-issues", 
        phaseProgress: 80,
        completedPhases: ["connecting", "fetching", "parsing-scores", "parsing-cwv"],
      });
      
      // 替换变量
      const issueCount = data.summary.issues.length;
      await streamThinkingMessages("analyzing-issues", (msg) => {
        updateState({ 
          currentThinkingMessage: msg.replace("{issuesCount}", issueCount.toString()) 
        });
      }, 1500);

      if (abortRef.current) return null;

      // Phase 6: 生成洞察
      updateState({ 
        currentPhase: "generating-insights", 
        phaseProgress: 90,
        completedPhases: ["connecting", "fetching", "parsing-scores", "parsing-cwv", "analyzing-issues"],
      });
      await streamThinkingMessages("generating-insights", (msg) => {
        updateState({ currentThinkingMessage: msg });
      }, 1500);

      if (abortRef.current) return null;

      // 完成
      updateState({ 
        currentPhase: "complete", 
        phaseProgress: 100,
        completedPhases: ["connecting", "fetching", "parsing-scores", "parsing-cwv", "analyzing-issues", "generating-insights"],
        data,
        currentThinkingMessage: "分析完成！",
      });

      return data;

    } catch (error) {
      updateState({
        error: error instanceof Error ? error.message : "未知错误",
        currentThinkingMessage: "分析过程中出现错误",
      });
      return null;
    }
  }, [streamThinkingMessages]);

  // 停止分析
  const stopAnalysis = useCallback(() => {
    abortRef.current = true;
  }, []);

  // 重置状态
  const reset = useCallback(() => {
    abortRef.current = false;
    setState({
      currentPhase: "connecting",
      phaseProgress: 0,
      currentThinkingMessage: ANALYSIS_PHASES[0].thinkingMessages[0],
      completedPhases: [],
    });
  }, []);

  return {
    state,
    startAnalysis,
    stopAnalysis,
    reset,
    ANALYSIS_PHASES,
  };
}

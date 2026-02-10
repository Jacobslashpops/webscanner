"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Zap, 
  Activity, 
  Brain,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Terminal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  StreamingState, 
  AnalysisPhase, 
  ANALYSIS_PHASES,
  PhaseInfo,
} from "@/hooks/use-streaming-analysis";
import { cn } from "@/lib/utils";

interface AIThinkingPanelProps {
  state: StreamingState;
  url: string;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

export function AIThinkingPanel({ 
  state, 
  url, 
  onToggleExpand,
  isExpanded = true,
}: AIThinkingPanelProps) {
  const { currentPhase, phaseProgress, currentThinkingMessage, completedPhases, error } = state;
  
  const isComplete = currentPhase === "complete";
  const hasError = !!error;

  // 获取当前阶段信息
  const currentPhaseInfo = ANALYSIS_PHASES.find(p => p.id === currentPhase);

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500",
      isComplete && "border-green-200",
      hasError && "border-red-200"
    )}>
      {/* 头部 */}
      <div className={cn(
        "p-4 border-b",
        isComplete ? "bg-green-50" : 
        hasError ? "bg-red-50" : 
        "bg-gradient-to-r from-purple-50 to-blue-50"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              isComplete ? "bg-green-500 text-white" :
              hasError ? "bg-red-500 text-white" :
              "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
            )}>
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : hasError ? (
                <Activity className="h-5 w-5" />
              ) : (
                <Brain className="h-5 w-5 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {hasError ? "分析出错" :
                   isComplete ? "分析完成" : 
                   "AI 正在分析网站性能"}
                </h3>
                {!isComplete && !hasError && (
                  <Badge variant="secondary" className="text-xs animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Thinking
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-md">
                {url}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isComplete && !hasError && (
              <span className="text-sm font-medium text-purple-600">
                {phaseProgress}%
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleExpand}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* 进度条 */}
        {!isComplete && !hasError && (
          <div className="mt-3">
            <Progress value={phaseProgress} className="h-1.5" />
          </div>
        )}
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <CardContent className="p-0">
          {hasError ? (
            <div className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="divide-y">
              {/* 当前思考内容 */}
              <div className="p-4 bg-muted/30">
                <div className="flex items-start gap-3">
                  <Terminal className="h-4 w-4 text-purple-500 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">当前正在执行</p>
                    <p className="text-sm font-medium text-purple-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {currentThinkingMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* 阶段时间线 */}
              <div className="p-4 space-y-2">
                {ANALYSIS_PHASES.map((phase, index) => {
                  const isCompleted = completedPhases.includes(phase.id);
                  const isCurrent = currentPhase === phase.id;
                  const isPending = !isCompleted && !isCurrent;

                  return (
                    <PhaseTimelineItem
                      key={phase.id}
                      phase={phase}
                      index={index}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      isPending={isPending}
                      currentMessage={isCurrent ? currentThinkingMessage : undefined}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// 阶段时间线项
interface PhaseTimelineItemProps {
  phase: PhaseInfo;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isPending: boolean;
  currentMessage?: string;
}

function PhaseTimelineItem({
  phase,
  index,
  isCompleted,
  isCurrent,
  isPending,
  currentMessage,
}: PhaseTimelineItemProps) {
  const [displayMessage, setDisplayMessage] = useState(phase.thinkingMessages[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  // 当前阶段时循环显示思考消息
  useEffect(() => {
    if (!isCurrent) {
      setDisplayMessage(phase.thinkingMessages[0]);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex(prev => {
        const next = (prev + 1) % phase.thinkingMessages.length;
        setDisplayMessage(phase.thinkingMessages[next]);
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isCurrent, phase.thinkingMessages]);

  // 如果有外部传入的当前消息，优先显示
  const displayText = isCurrent && currentMessage ? currentMessage : displayMessage;

  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
      isCurrent && "bg-purple-50 border border-purple-100",
      isCompleted && "opacity-60",
      isPending && "opacity-40"
    )}>
      {/* 状态图标 */}
      <div className="mt-0.5 shrink-0">
        {isCompleted ? (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="h-3 w-3 text-white" />
          </div>
        ) : isCurrent ? (
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
            <Loader2 className="h-3 w-3 text-white animate-spin" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">{index + 1}</span>
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium text-sm",
            isCurrent && "text-purple-700",
            isCompleted && "text-green-700"
          )}>
            {phase.label}
          </span>
          {isCurrent && (
            <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
              进行中
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-0.5">
          {phase.description}
        </p>

        {/* 当前阶段的动态消息 */}
        {isCurrent && (
          <div className="mt-2 p-2 bg-white rounded border border-purple-100">
            <p className="text-xs text-purple-600 font-mono truncate">
              <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse" />
              {displayText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 简化的思考动画组件（用于内联展示）
interface ThinkingDotsProps {
  text?: string;
}

export function ThinkingDots({ text = "思考中" }: ThinkingDotsProps) {
  return (
    <span className="inline-flex items-center">
      {text}
      <span className="ml-1 flex">
        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
      </span>
    </span>
  );
}

// 代码风格日志组件
interface CodeLogProps {
  logs: string[];
}

export function CodeLog({ logs }: CodeLogProps) {
  return (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-48">
      {logs.map((log, index) => (
        <div key={index} className="mb-1">
          <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
          {" "}
          <span className="text-blue-400">$</span>
          {" "}
          {log}
        </div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
}

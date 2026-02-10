"use client";

import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Globe,
  Building2,
  Store,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Diagnosis, DiagnosisStatus } from "@/lib/types/diagnosis";

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<
  DiagnosisStatus,
  { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: {
    label: "等待中",
    icon: <Clock className="h-4 w-4" />,
    variant: "secondary",
  },
  analyzing: {
    label: "分析中",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    variant: "default",
  },
  completed: {
    label: "已完成",
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: "outline",
  },
  failed: {
    label: "失败",
    icon: <AlertCircle className="h-4 w-4" />,
    variant: "destructive",
  },
};

export function DiagnosisCard({ diagnosis, onView }: DiagnosisCardProps) {
  const status = statusConfig[diagnosis.status];
  const isAnalyzing = diagnosis.status === "analyzing";
  const isCompleted = diagnosis.status === "completed";

  return (
    <Card data-element-id={`diagnosis-card-${diagnosis.id}`} className="group hover:shadow-md transition-shadow">
      <CardContent data-element-id={`diagnosis-card-content-${diagnosis.id}`} className="p-5">
        <div data-element-id={`diagnosis-card-header-${diagnosis.id}`} className="flex items-start justify-between gap-4">
          {/* 左侧：网站信息 */}
          <div data-element-id={`diagnosis-card-info-${diagnosis.id}`} className="flex-1 min-w-0">
            <div data-element-id={`diagnosis-card-url-row-${diagnosis.id}`} className="flex items-center gap-2 mb-1">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <span
                data-element-id={`diagnosis-card-url-${diagnosis.id}`}
                className="font-medium truncate"
              >
                {diagnosis.url}
              </span>
            </div>
            <div data-element-id={`diagnosis-card-meta-${diagnosis.id}`} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span
                data-element-id={`diagnosis-card-type-${diagnosis.id}`}
                className="flex items-center gap-1"
              >
                {diagnosis.type === "b2b" ? (
                  <Building2 className="h-3.5 w-3.5" />
                ) : (
                  <Store className="h-3.5 w-3.5" />
                )}
                {diagnosis.type === "b2b" ? "B2B" : "B2C"}
              </span>
              <span>·</span>
              <span data-element-id={`diagnosis-card-time-${diagnosis.id}`}>
                {formatDistanceToNow(diagnosis.createdAt, {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </div>

          {/* 右侧：状态和分数 */}
          <div data-element-id={`diagnosis-card-status-${diagnosis.id}`} className="flex flex-col items-end gap-2">
            <Badge
              data-element-id={`diagnosis-card-status-badge-${diagnosis.id}`}
              variant={status.variant}
              className="flex items-center gap-1"
            >
              {status.icon}
              {status.label}
            </Badge>
            {isCompleted && diagnosis.score !== undefined && (
              <div
                data-element-id={`diagnosis-card-score-${diagnosis.id}`}
                className={`text-lg font-bold ${
                  diagnosis.score >= 80
                    ? "text-green-500"
                    : diagnosis.score >= 60
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {diagnosis.score}
                <span className="text-sm text-muted-foreground font-normal">/100</span>
              </div>
            )}
          </div>
        </div>

        {/* 进度条（分析中时显示） */}
        {isAnalyzing && (
          <div data-element-id={`diagnosis-card-progress-${diagnosis.id}`} className="mt-4 space-y-2">
            <div data-element-id={`diagnosis-card-progress-header-${diagnosis.id}`} className="flex justify-between text-xs text-muted-foreground">
              <span>分析进度</span>
              <span>{diagnosis.progress}%</span>
            </div>
            <Progress value={diagnosis.progress} className="h-1.5" />
          </div>
        )}

        {/* 操作按钮 */}
        <div data-element-id={`diagnosis-card-actions-${diagnosis.id}`} className="mt-4 flex justify-end">
          <Button
            data-element-id={`diagnosis-card-btn-view-${diagnosis.id}`}
            variant="ghost"
            size="sm"
            onClick={() => onView?.(diagnosis.id)}
            className="group/btn"
          >
            {isAnalyzing ? "查看进度" : isCompleted ? "查看报告" : "查看详情"}
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

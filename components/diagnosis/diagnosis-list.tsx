"use client";

import { useRouter } from "next/navigation";
import { Search, Globe, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DiagnosisCard } from "./diagnosis-card";
import { NewDiagnosisDialog } from "./new-diagnosis-dialog";
import { Diagnosis, NewDiagnosisForm } from "@/lib/types/diagnosis";

interface DiagnosisListProps {
  diagnoses: Diagnosis[];
  isLoading: boolean;
  onCreate: (form: NewDiagnosisForm) => Promise<string>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DiagnosisListView({
  diagnoses,
  isLoading,
  onCreate,
  searchQuery,
  onSearchChange,
}: DiagnosisListProps) {
  const router = useRouter();

  const handleViewDiagnosis = (id: string) => {
    const diagnosis = diagnoses.find((d) => d.id === id);
    if (diagnosis?.status === "analyzing") {
      router.push(`/dashboard/diagnosis/${id}/analysis`);
    } else {
      router.push(`/dashboard/diagnosis/${id}`);
    }
  };

  const filteredDiagnoses = diagnoses.filter((d) =>
    d.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-element-id="diagnosis-list-view" className="space-y-6">
      {/* 页面头部 */}
      <div data-element-id="diagnosis-list-header" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div data-element-id="diagnosis-list-title-section">
          <h1 data-element-id="diagnosis-list-title" className="text-2xl font-bold tracking-tight">
            网站诊断
          </h1>
          <p data-element-id="diagnosis-list-subtitle" className="text-muted-foreground">
            管理和查看您的网站诊断分析
          </p>
        </div>
        <NewDiagnosisDialog onCreate={onCreate}>
          <Button data-element-id="btn-new-diagnosis-main">
            <Globe className="mr-2 h-4 w-4" />
            新建诊断
          </Button>
        </NewDiagnosisDialog>
      </div>

      {/* 搜索栏 */}
      <div data-element-id="diagnosis-list-search" className="flex items-center gap-4">
        <div data-element-id="search-input-wrapper" className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-element-id="diagnosis-search-input"
            placeholder="搜索网站 URL..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* 诊断列表 */}
      {isLoading ? (
        <div data-element-id="diagnosis-list-loading" className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDiagnoses.length === 0 ? (
        <div data-element-id="diagnosis-list-empty" className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
          <Globe className="h-12 w-12 text-muted-foreground/50" />
          <h3 data-element-id="empty-title" className="mt-4 text-lg font-semibold">
            暂无诊断任务
          </h3>
          <p data-element-id="empty-desc" className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
            {searchQuery
              ? "没有找到匹配的诊断任务，请尝试其他搜索词"
              : "开始您的第一个网站诊断分析，全面检查网站的健康状况"}
          </p>
          {!searchQuery && (
            <NewDiagnosisDialog onCreate={onCreate}>
              <Button data-element-id="btn-empty-new" variant="outline" className="mt-4">
                <Globe className="mr-2 h-4 w-4" />
                新建诊断
              </Button>
            </NewDiagnosisDialog>
          )}
        </div>
      ) : (
        <div data-element-id="diagnosis-list-grid" className="grid gap-4">
          {filteredDiagnoses.map((diagnosis) => (
            <DiagnosisCard
              key={diagnosis.id}
              diagnosis={diagnosis}
              onView={handleViewDiagnosis}
            />
          ))}
        </div>
      )}
    </div>
  );
}

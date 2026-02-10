"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Diagnosis,
  DiagnosisStatus,
  AnalysisStep,
  NewDiagnosisForm,
  ANALYSIS_STEPS,
  CoreWebVitalsData,
} from "@/lib/types/diagnosis";

// 模拟生成唯一 ID
const generateId = () => `diag-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;

// 模拟诊断数据存储
const diagnosisStore = new Map<string, Diagnosis>();

export function useDiagnosisList() {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初始加载
  useEffect(() => {
    const stored = Array.from(diagnosisStore.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    setDiagnoses(stored);
    setIsLoading(false);
  }, []);

  const refresh = useCallback(() => {
    const stored = Array.from(diagnosisStore.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
    setDiagnoses(stored);
  }, []);

  const createDiagnosis = useCallback((form: NewDiagnosisForm) => {
    const newDiagnosis: Diagnosis = {
      id: generateId(),
      url: form.url,
      type: form.type,
      status: "pending",
      currentStep: "init",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      results: {},
    };
    
    diagnosisStore.set(newDiagnosis.id, newDiagnosis);
    setDiagnoses((prev) => [newDiagnosis, ...prev]);
    
    return newDiagnosis.id;
  }, []);

  const deleteDiagnosis = useCallback((id: string) => {
    diagnosisStore.delete(id);
    setDiagnoses((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return {
    diagnoses,
    isLoading,
    refresh,
    createDiagnosis,
    deleteDiagnosis,
  };
}

export function useDiagnosis(id: string | null) {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const stored = diagnosisStore.get(id);
    if (stored) {
      setDiagnosis(stored);
    }
    setIsLoading(false);
  }, [id]);

  // 开始分析
  const startAnalysis = useCallback(() => {
    if (!id) return;

    const stored = diagnosisStore.get(id);
    if (!stored) return;

    const updated = {
      ...stored,
      status: "analyzing" as DiagnosisStatus,
      currentStep: "performance" as AnalysisStep,
      progress: 5,
      updatedAt: new Date(),
    };
    
    diagnosisStore.set(id, updated);
    setDiagnosis(updated);
  }, [id]);

  // 更新当前步骤
  const updateStep = useCallback((step: AnalysisStep) => {
    if (!id) return;

    const stored = diagnosisStore.get(id);
    if (!stored) return;

    const stepInfo = ANALYSIS_STEPS.find((s) => s.id === step);
    const progress = stepInfo ? (stepInfo.order / (ANALYSIS_STEPS.length - 1)) * 100 : 0;

    const updated = {
      ...stored,
      currentStep: step,
      progress: Math.round(progress),
      updatedAt: new Date(),
    };
    
    diagnosisStore.set(id, updated);
    setDiagnosis(updated);
  }, [id]);

  // 保存步骤结果
  const saveStepResult = useCallback((step: AnalysisStep, result: any) => {
    if (!id) return;

    const stored = diagnosisStore.get(id);
    if (!stored) return;

    const updated = {
      ...stored,
      results: {
        ...stored.results,
        [step]: result,
      },
      updatedAt: new Date(),
    };
    
    diagnosisStore.set(id, updated);
    setDiagnosis(updated);
  }, [id]);

  // 完成分析
  const completeAnalysis = useCallback((score: number) => {
    if (!id) return;

    const stored = diagnosisStore.get(id);
    if (!stored) return;

    const updated = {
      ...stored,
      status: "completed" as DiagnosisStatus,
      currentStep: "generating-report" as AnalysisStep,
      progress: 100,
      score,
      completedAt: new Date(),
      updatedAt: new Date(),
    };
    
    diagnosisStore.set(id, updated);
    setDiagnosis(updated);
  }, [id]);

  // 模拟分析流程（用于演示）
  const simulateAnalysis = useCallback(() => {
    if (!id) return;

    startAnalysis();

    const steps: AnalysisStep[] = [
      "performance",
      "analyzing-structure",
      "analyzing-content",
      "analyzing-seo",
      "analyzing-design",
      "analyzing-security",
      "generating-report",
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        updateStep(steps[stepIndex]);
        stepIndex++;
      } else {
        clearInterval(interval);
        completeAnalysis(Math.floor(Math.random() * 30) + 70); // 随机分数 70-100
      }
    }, 3000); // 每 3 秒走一步（给用户时间查看结果）

    return () => clearInterval(interval);
  }, [id, startAnalysis, updateStep, completeAnalysis]);

  return {
    diagnosis,
    isLoading,
    startAnalysis,
    updateStep,
    saveStepResult,
    completeAnalysis,
    simulateAnalysis,
    refresh: () => {
      if (id) {
        const stored = diagnosisStore.get(id);
        if (stored) setDiagnosis(stored);
      }
    },
  };
}

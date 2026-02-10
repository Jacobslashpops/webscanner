"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DiagnosisListView } from "@/components/diagnosis/diagnosis-list";
import { useDiagnosisList } from "@/hooks/use-diagnosis";
import { NewDiagnosisForm } from "@/lib/types/diagnosis";

export default function DiagnosisPage() {
  const { diagnoses, isLoading, createDiagnosis } = useDiagnosisList();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = async (form: NewDiagnosisForm): Promise<string> => {
    return new Promise((resolve) => {
      const id = createDiagnosis(form);
      resolve(id);
    });
  };

  return (
    <div data-element-id="diagnosis-page">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset data-element-id="diagnosis-inset">
          <header data-element-id="diagnosis-header" className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div data-element-id="diagnosis-header-content" className="flex items-center gap-2 px-3">
              <SidebarTrigger data-element-id="btn-sidebar-toggle" />
              <Separator data-element-id="header-separator" orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb data-element-id="diagnosis-breadcrumb">
                <BreadcrumbList data-element-id="breadcrumb-list">
                  <BreadcrumbItem data-element-id="breadcrumb-item-dashboard" className="hidden md:block">
                    <BreadcrumbLink data-element-id="breadcrumb-link-dashboard" href="/dashboard">
                      控制台
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator data-element-id="breadcrumb-separator-1" className="hidden md:block" />
                  <BreadcrumbItem data-element-id="breadcrumb-item-diagnosis">
                    <BreadcrumbPage data-element-id="breadcrumb-page-diagnosis">网站诊断</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main data-element-id="diagnosis-main" className="flex-1 p-6">
            <DiagnosisListView
              diagnoses={diagnoses}
              isLoading={isLoading}
              onCreate={handleCreate}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

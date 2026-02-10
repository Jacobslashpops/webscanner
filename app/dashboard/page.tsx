"use client";

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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Scan,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div data-element-id="dashboard-root">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset data-element-id="dashboard-inset">
          <header data-element-id="dashboard-header" className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div data-element-id="dashboard-header-content" className="flex items-center gap-2 px-3">
              <SidebarTrigger data-element-id="btn-sidebar-toggle" />
              <Separator data-element-id="header-separator" orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb data-element-id="dashboard-breadcrumb">
                <BreadcrumbList data-element-id="breadcrumb-list">
                  <BreadcrumbItem data-element-id="breadcrumb-item-home" className="hidden md:block">
                    <BreadcrumbLink data-element-id="breadcrumb-link-dashboard" href="#">控制台</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator data-element-id="breadcrumb-separator-1" className="hidden md:block" />
                  <BreadcrumbItem data-element-id="breadcrumb-item-current">
                    <BreadcrumbPage data-element-id="breadcrumb-page-overview">总览</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div data-element-id="dashboard-content" className="flex flex-1 flex-col gap-6 p-6">
            {/* Page Header */}
            <div data-element-id="page-header" className="flex items-center justify-between">
              <div data-element-id="page-title-wrapper">
                <h1 data-element-id="page-title" className="text-2xl font-bold tracking-tight">安全总览</h1>
                <p data-element-id="page-subtitle" className="text-muted-foreground">
                  查看您的网站安全状态和扫描结果
                </p>
              </div>
              <Button data-element-id="btn-new-scan">
                <Plus data-element-id="btn-new-scan-icon" className="mr-2 h-4 w-4" />
                新建扫描
              </Button>
            </div>

            {/* Stats Cards */}
            <div data-element-id="stats-cards-grid" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                elId="stat-websites"
                title="监控网站"
                value="12"
                description="+2 本月新增"
                icon={<Globe data-element-id="stat-icon-websites" className="h-4 w-4" />}
                trend="up"
              />
              <StatCard
                elId="stat-security-score"
                title="安全评分"
                value="94"
                description="优秀 (+3 较上月)"
                icon={<Shield data-element-id="stat-icon-score" className="h-4 w-4" />}
                trend="up"
              />
              <StatCard
                elId="stat-vulnerabilities"
                title="漏洞数量"
                value="3"
                description="-5 已修复"
                icon={<AlertTriangle data-element-id="stat-icon-vuln" className="h-4 w-4" />}
                trend="down"
              />
              <StatCard
                elId="stat-scan-count"
                title="扫描次数"
                value="156"
                description="本月已完成"
                icon={<Scan data-element-id="stat-icon-scan" className="h-4 w-4" />}
                trend="neutral"
              />
            </div>

            {/* Main Content */}
            <div data-element-id="main-content-grid" className="grid gap-6 lg:grid-cols-7">
              {/* Recent Scans */}
              <Card data-element-id="card-recent-scans" className="lg:col-span-4">
                <CardHeader data-element-id="card-recent-scans-header">
                  <CardTitle data-element-id="card-recent-scans-title">最近扫描</CardTitle>
                  <CardDescription data-element-id="card-recent-scans-desc">
                    您最近的网站扫描任务结果
                  </CardDescription>
                </CardHeader>
                <CardContent data-element-id="card-recent-scans-content">
                  <div data-element-id="recent-scans-list" className="space-y-4">
                    <ScanItem
                      elId="scan-example"
                      domain="example.com"
                      status="completed"
                      score={95}
                      time="2小时前"
                    />
                    <ScanItem
                      elId="scan-mysite"
                      domain="mysite.org"
                      status="completed"
                      score={87}
                      time="5小时前"
                    />
                    <ScanItem
                      elId="scan-testapp"
                      domain="test-app.io"
                      status="warning"
                      score={72}
                      time="1天前"
                    />
                    <ScanItem
                      elId="scan-demo"
                      domain="demo.net"
                      status="completed"
                      score={98}
                      time="2天前"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Issues */}
              <Card data-element-id="card-security-issues" className="lg:col-span-3">
                <CardHeader data-element-id="card-issues-header">
                  <CardTitle data-element-id="card-issues-title">安全问题</CardTitle>
                  <CardDescription data-element-id="card-issues-desc">
                    需要关注的安全风险和漏洞
                  </CardDescription>
                </CardHeader>
                <CardContent data-element-id="card-issues-content">
                  <div data-element-id="issues-list" className="space-y-4">
                    <IssueItem
                      elId="issue-ssl"
                      title="SSL证书即将过期"
                      severity="high"
                      domain="test-app.io"
                    />
                    <IssueItem
                      elId="issue-xss"
                      title="发现XSS漏洞"
                      severity="critical"
                      domain="example.com"
                    />
                    <IssueItem
                      elId="issue-headers"
                      title="HTTP响应头缺失"
                      severity="medium"
                      domain="mysite.org"
                    />
                    <IssueItem
                      elId="issue-cookie"
                      title="Cookie未设置Secure标志"
                      severity="low"
                      domain="demo.net"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card data-element-id="card-quick-actions">
              <CardHeader data-element-id="card-actions-header">
                <CardTitle data-element-id="card-actions-title">快速操作</CardTitle>
                <CardDescription data-element-id="card-actions-desc">常用的扫描和管理功能</CardDescription>
              </CardHeader>
              <CardContent data-element-id="card-actions-content">
                <div data-element-id="quick-actions-grid" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <QuickActionButton
                    elId="action-start-scan"
                    icon={<Scan data-element-id="action-icon-scan" className="h-5 w-5" />}
                    label="开始扫描"
                    description="对网站进行全面安全扫描"
                  />
                  <QuickActionButton
                    elId="action-add-site"
                    icon={<Globe data-element-id="action-icon-site" className="h-5 w-5" />}
                    label="添加网站"
                    description="添加新的监控网站"
                  />
                  <QuickActionButton
                    elId="action-report"
                    icon={<Shield data-element-id="action-icon-report" className="h-5 w-5" />}
                    label="安全报告"
                    description="查看详细的安全分析报告"
                  />
                  <QuickActionButton
                    elId="action-history"
                    icon={<Clock data-element-id="action-icon-history" className="h-5 w-5" />}
                    label="扫描历史"
                    description="查看所有历史扫描记录"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function StatCard({
  elId,
  title,
  value,
  description,
  icon,
  trend,
}: {
  elId: string;
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-muted-foreground",
  };

  return (
    <Card data-element-id={elId}>
      <CardContent data-element-id={`${elId}-content`} className="p-6">
        <div data-element-id={`${elId}-inner`} className="flex items-center justify-between">
          <div data-element-id={`${elId}-text`}>
            <p data-element-id={`${elId}-title`} className="text-sm font-medium text-muted-foreground">{title}</p>
            <p data-element-id={`${elId}-value`} className="mt-2 text-3xl font-bold">{value}</p>
          </div>
          <div data-element-id={`${elId}-icon-wrapper`} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
        <p data-element-id={`${elId}-desc`} className={`mt-2 text-xs ${trendColors[trend]}`}>{description}</p>
      </CardContent>
    </Card>
  );
}

function ScanItem({
  elId,
  domain,
  status,
  score,
  time,
}: {
  elId: string;
  domain: string;
  status: "completed" | "warning" | "error";
  score: number;
  time: string;
}) {
  const statusColors = {
    completed: score >= 90 ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-red-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };

  const StatusIcon = score >= 90 ? CheckCircle : score >= 70 ? AlertTriangle : AlertTriangle;

  return (
    <div data-element-id={elId} className="flex items-center justify-between rounded-lg border p-4">
      <div data-element-id={`${elId}-left`} className="flex items-center gap-4">
        <div data-element-id={`${elId}-status-icon`} className={`${statusColors[status]}`}>
          <StatusIcon className="h-5 w-5" />
        </div>
        <div data-element-id={`${elId}-info`}>
          <p data-element-id={`${elId}-domain`} className="font-medium">{domain}</p>
          <p data-element-id={`${elId}-time`} className="text-sm text-muted-foreground">{time}</p>
        </div>
      </div>
      <div data-element-id={`${elId}-score`} className="text-right">
        <span
          data-element-id={`${elId}-score-value`}
          className={`text-lg font-bold ${
            score >= 90
              ? "text-green-500"
              : score >= 70
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {score}
        </span>
        <span data-element-id={`${elId}-score-total`} className="text-sm text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

function IssueItem({
  elId,
  title,
  severity,
  domain,
}: {
  elId: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  domain: string;
}) {
  const severityColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
  };

  const severityLabels = {
    critical: "严重",
    high: "高危",
    medium: "中危",
    low: "低危",
  };

  return (
    <div data-element-id={elId} className="flex items-start gap-3 rounded-lg border p-4">
      <div
        data-element-id={`${elId}-dot`}
        className={`mt-1 h-2 w-2 rounded-full ${severityColors[severity]}`}
      />
      <div data-element-id={`${elId}-content`} className="flex-1">
        <p data-element-id={`${elId}-title`} className="font-medium">{title}</p>
        <div data-element-id={`${elId}-meta`} className="mt-1 flex items-center gap-2">
          <span data-element-id={`${elId}-domain`} className="text-xs text-muted-foreground">{domain}</span>
          <span
            data-element-id={`${elId}-severity`}
            className={`rounded px-1.5 py-0.5 text-xs text-white ${severityColors[severity]}`}
          >
            {severityLabels[severity]}
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({
  elId,
  icon,
  label,
  description,
}: {
  elId: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button data-element-id={elId} className="flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-muted">
      <div data-element-id={`${elId}-icon`} className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div data-element-id={`${elId}-text`}>
        <p data-element-id={`${elId}-label`} className="font-medium">{label}</p>
        <p data-element-id={`${elId}-description`} className="text-sm text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

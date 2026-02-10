"use client";

import { Button } from "@/components/ui/button";
import { Shield, ScanLine, Zap, Lock, Globe, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <div data-element-id="home-page" className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header data-element-id="home-header" className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div data-element-id="header-container" className="container mx-auto flex h-16 items-center justify-between px-4">
          <div data-element-id="header-logo-wrapper" className="flex items-center gap-2">
            <div data-element-id="header-logo-icon" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield data-element-id="header-shield-icon" className="h-5 w-5 text-primary-foreground" />
            </div>
            <span data-element-id="header-logo-text" className="text-xl font-bold">WebScanner</span>
          </div>
          <nav data-element-id="header-nav" className="hidden items-center gap-6 md:flex">
            <a data-element-id="nav-features" href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              功能特性
            </a>
            <a data-element-id="nav-security" href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              安全保障
            </a>
            <a data-element-id="nav-pricing" href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              价格方案
            </a>
          </nav>
          <div data-element-id="header-actions" className="flex items-center gap-4">
            <Button data-element-id="btn-login" variant="ghost" onClick={handleLogin}>
              登录
            </Button>
            <Button data-element-id="btn-get-started" onClick={handleLogin}>开始使用</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section data-element-id="hero-section" className="container mx-auto px-4 py-24 md:py-32">
        <div data-element-id="hero-container" className="mx-auto max-w-4xl text-center">
          <div data-element-id="hero-badge" className="mb-8 inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-sm font-medium">
            <span data-element-id="hero-badge-dot" className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            新一代网站安全扫描平台
          </div>
          <h1 data-element-id="hero-title" className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            全方位保护您的
            <span data-element-id="hero-title-gradient" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              网站安全
            </span>
          </h1>
          <p data-element-id="hero-description" className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            使用先进的扫描技术，快速发现网站漏洞、恶意代码和安全隐患。
            让您的网站始终保持最佳安全状态。
          </p>
          <div data-element-id="hero-buttons" className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button data-element-id="btn-scan-now" size="lg" onClick={handleLogin} className="h-12 px-8 text-lg">
              立即扫描
              <ChevronRight data-element-id="hero-btn-icon" className="ml-2 h-5 w-5" />
            </Button>
            <Button data-element-id="btn-learn-more" size="lg" variant="outline" className="h-12 px-8 text-lg">
              了解更多
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section data-element-id="features-section" id="features" className="container mx-auto px-4 py-24">
        <div data-element-id="features-header" className="mb-16 text-center">
          <h2 data-element-id="features-title" className="mb-4 text-3xl font-bold md:text-4xl">强大的扫描功能</h2>
          <p data-element-id="features-subtitle" className="mx-auto max-w-2xl text-muted-foreground">
            我们提供全面的网站安全扫描解决方案，帮助您及时发现并修复安全问题
          </p>
        </div>
        <div data-element-id="features-grid" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            elId="feature-vulnerability"
            icon={<ScanLine data-element-id="feature-icon-vulnerability" className="h-6 w-6" />}
            title="漏洞扫描"
            description="自动检测SQL注入、XSS、CSRF等常见Web漏洞，提供详细的修复建议"
          />
          <FeatureCard
            elId="feature-performance"
            icon={<Zap data-element-id="feature-icon-performance" className="h-6 w-6" />}
            title="性能分析"
            description="检测网站性能瓶颈，分析加载速度，优化用户体验"
          />
          <FeatureCard
            elId="feature-ssl"
            icon={<Lock data-element-id="feature-icon-ssl" className="h-6 w-6" />}
            title="SSL检测"
            description="检查SSL证书配置，确保数据传输安全，防止中间人攻击"
          />
          <FeatureCard
            elId="feature-domain"
            icon={<Globe data-element-id="feature-icon-domain" className="h-6 w-6" />}
            title="域名监控"
            description="实时监控域名状态，检测DNS配置问题，防止域名劫持"
          />
          <FeatureCard
            elId="feature-malware"
            icon={<Shield data-element-id="feature-icon-malware" className="h-6 w-6" />}
            title="恶意代码检测"
            description="扫描网站文件，检测木马、后门、恶意脚本等安全威胁"
          />
          <FeatureCard
            elId="feature-compliance"
            icon={<ScanLine data-element-id="feature-icon-compliance" className="h-6 w-6" />}
            title="合规检查"
            description="对照安全标准进行合规检查，帮助您满足行业安全要求"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section data-element-id="stats-section" className="border-y bg-background/50">
        <div data-element-id="stats-container" className="container mx-auto px-4 py-16">
          <div data-element-id="stats-grid" className="grid gap-8 text-center md:grid-cols-4">
            <StatItem elId="stat-scans" number="10M+" label="扫描任务" />
            <StatItem elId="stat-accuracy" number="99.9%" label="检测准确率" />
            <StatItem elId="stat-users" number="50K+" label="企业用户" />
            <StatItem elId="stat-support" number="24/7" label="实时监控" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-element-id="cta-section" className="container mx-auto px-4 py-24">
        <div data-element-id="cta-card" className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
          <h2 data-element-id="cta-title" className="mb-4 text-3xl font-bold md:text-4xl">准备好保护您的网站了吗？</h2>
          <p data-element-id="cta-description" className="mb-8 text-lg text-white/80">
            立即开始使用 WebScanner，让您的网站安全无忧
          </p>
          <Button
            data-element-id="btn-cta-start"
            size="lg"
            variant="secondary"
            onClick={handleLogin}
            className="h-12 px-8 text-lg"
          >
            免费开始使用
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer data-element-id="footer" className="border-t bg-background py-12">
        <div data-element-id="footer-container" className="container mx-auto px-4">
          <div data-element-id="footer-content" className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div data-element-id="footer-logo" className="flex items-center gap-2">
              <div data-element-id="footer-logo-icon" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield data-element-id="footer-shield-icon" className="h-5 w-5 text-primary-foreground" />
              </div>
              <span data-element-id="footer-logo-text" className="text-lg font-bold">WebScanner</span>
            </div>
            <p data-element-id="footer-copyright" className="text-sm text-muted-foreground">
              © 2026 WebScanner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  elId,
  icon,
  title,
  description,
}: {
  elId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div data-element-id={elId} className="group rounded-xl border bg-background p-6 transition-all hover:shadow-lg">
      <div data-element-id={`${elId}-icon-wrapper`} className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 data-element-id={`${elId}-title`} className="mb-2 text-xl font-semibold">{title}</h3>
      <p data-element-id={`${elId}-desc`} className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StatItem({ elId, number, label }: { elId: string; number: string; label: string }) {
  return (
    <div data-element-id={elId}>
      <div data-element-id={`${elId}-number`} className="mb-2 text-4xl font-bold text-primary">{number}</div>
      <div data-element-id={`${elId}-label`} className="text-muted-foreground">{label}</div>
    </div>
  );
}

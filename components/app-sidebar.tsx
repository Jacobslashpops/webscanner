"use client";

import * as React from "react";
import {
  Shield,
  Globe,
  Scan,
  Settings,
  FileText,
  Bell,
  Users,
  LogOut,
  LayoutDashboard,
  History,
  AlertTriangle,
  Activity,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  {
    id: "nav-overview",
    title: "总览",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "nav-diagnosis",
    title: "网站诊断",
    url: "/dashboard/diagnosis",
    icon: Activity,
  },
  {
    id: "nav-sites",
    title: "网站管理",
    url: "/dashboard/sites",
    icon: Globe,
  },
  {
    id: "nav-scans",
    title: "扫描任务",
    url: "/dashboard/scans",
    icon: Scan,
  },
  {
    id: "nav-vulns",
    title: "安全漏洞",
    url: "/dashboard/vulnerabilities",
    icon: AlertTriangle,
  },
  {
    id: "nav-history",
    title: "扫描历史",
    url: "/dashboard/history",
    icon: History,
  },
  {
    id: "nav-reports",
    title: "报告中心",
    url: "/dashboard/reports",
    icon: FileText,
  },
];

const settingsItems = [
  {
    id: "nav-notifications",
    title: "通知设置",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    id: "nav-team",
    title: "团队管理",
    url: "/dashboard/team",
    icon: Users,
  },
  {
    id: "nav-settings",
    title: "系统设置",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <Sidebar data-element-id="app-sidebar" {...props}>
      <SidebarHeader data-element-id="sidebar-header">
        <SidebarMenu data-element-id="sidebar-header-menu">
          <SidebarMenuItem data-element-id="sidebar-logo-item">
            <SidebarMenuButton data-element-id="sidebar-logo-btn" size="lg" asChild>
              <Link data-element-id="sidebar-logo-link" href="/">
                <div data-element-id="sidebar-logo-icon-wrapper" className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Shield data-element-id="sidebar-logo-shield" className="size-4" />
                </div>
                <div data-element-id="sidebar-logo-text" className="flex flex-col gap-0.5 leading-none">
                  <span data-element-id="sidebar-logo-title" className="font-semibold">WebScanner</span>
                  <span data-element-id="sidebar-logo-subtitle" className="">网站安全扫描</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent data-element-id="sidebar-content">
        <SidebarGroup data-element-id="sidebar-group-main">
          <SidebarGroupLabel data-element-id="sidebar-group-label-main">功能菜单</SidebarGroupLabel>
          <SidebarGroupContent data-element-id="sidebar-group-content-main">
            <SidebarMenu data-element-id="sidebar-menu-main">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id} data-element-id={`${item.id}-item`}>
                  <SidebarMenuButton data-element-id={`${item.id}-btn`} asChild>
                    <Link data-element-id={`${item.id}-link`} href={item.url}>
                      <item.icon data-element-id={`${item.id}-icon`} className="size-4" />
                      <span data-element-id={`${item.id}-text`}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup data-element-id="sidebar-group-settings">
          <SidebarGroupLabel data-element-id="sidebar-group-label-settings">设置</SidebarGroupLabel>
          <SidebarGroupContent data-element-id="sidebar-group-content-settings">
            <SidebarMenu data-element-id="sidebar-menu-settings">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.id} data-element-id={`${item.id}-item`}>
                  <SidebarMenuButton data-element-id={`${item.id}-btn`} asChild>
                    <Link data-element-id={`${item.id}-link`} href={item.url}>
                      <item.icon data-element-id={`${item.id}-icon`} className="size-4" />
                      <span data-element-id={`${item.id}-text`}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter data-element-id="sidebar-footer">
        <SidebarMenu data-element-id="sidebar-footer-menu">
          <SidebarMenuItem data-element-id="sidebar-user-item">
            <DropdownMenu>
              <DropdownMenuTrigger data-element-id="sidebar-user-trigger" asChild>
                <SidebarMenuButton
                  data-element-id="sidebar-user-btn"
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar data-element-id="sidebar-user-avatar" className="h-8 w-8 rounded-lg">
                    <AvatarFallback data-element-id="sidebar-user-avatar-fallback" className="rounded-lg bg-primary text-primary-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div data-element-id="sidebar-user-info" className="grid flex-1 text-left text-sm leading-tight">
                    <span data-element-id="sidebar-user-name" className="truncate font-semibold">用户</span>
                    <span data-element-id="sidebar-user-email" className="truncate text-xs text-muted-foreground">
                      user@example.com
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                data-element-id="sidebar-user-dropdown"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                side="top"
              >
                <DropdownMenuItem data-element-id="sidebar-menu-settings-item" asChild>
                  <Link data-element-id="sidebar-menu-settings-link" href="/dashboard/settings">
                    <Settings data-element-id="sidebar-menu-settings-icon" className="mr-2 h-4 w-4" />
                    账号设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator data-element-id="sidebar-menu-separator" />
                <DropdownMenuItem data-element-id="sidebar-menu-logout" onClick={handleLogout}>
                  <LogOut data-element-id="sidebar-menu-logout-icon" className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail data-element-id="sidebar-rail" />
    </Sidebar>
  );
}

# PageSpeed Insights API 完整字段参考

## API 响应结构总览

```
pagespeedonline#result
├── captchaResult              # CAPTCHA 状态
├── kind                       # 资源类型
├── id                         # 分析的 URL
├── loadingExperience          # 真实用户数据 (CrUX)
├── originLoadingExperience    # 域名级别的真实用户数据
├── lighthouseResult           # Lighthouse 实验室测试数据
│   ├── requestedUrl           # 请求分析的 URL
│   ├── finalUrl               # 最终跳转到的 URL
│   ├── lighthouseVersion      # Lighthouse 版本
│   ├── fetchTime              # 测试时间
│   ├── environment            # 测试环境信息
│   ├── runWarnings            # 运行时警告
│   ├── configSettings         # 测试配置
│   ├── categories             # 四大类别评分
│   └── audits                 # 149+ 详细检测项
└── analysisUTCTimestamp       # 分析时间戳
```

---

## 1. 真实用户数据 (loadingExperience)

来自 Chrome User Experience Report (CrUX)，反映真实用户的访问体验。

### 1.1 整体评级
```json
{
  "overall_category": "FAST"  // FAST | AVERAGE | SLOW
}
```

### 1.2 核心指标 (metrics)

| 指标 | 描述 | 单位 | 良好 | 需改进 | 差 |
|------|------|------|------|--------|-----|
| **CUMULATIVE_LAYOUT_SHIFT_SCORE** | CLS - 累积布局偏移 | 无 | ≤ 0.1 | 0.1-0.25 | > 0.25 |
| **EXPERIMENTAL_TIME_TO_FIRST_BYTE** | TTFB - 首字节时间 | ms | ≤ 800 | 800-1800 | > 1800 |
| **FIRST_CONTENTFUL_PAINT_MS** | FCP - 首次内容绘制 | ms | ≤ 1800 | 1800-3000 | > 3000 |
| **INTERACTION_TO_NEXT_PAINT** | INP - 交互响应 | ms | ≤ 200 | 200-500 | > 500 |
| **LARGEST_CONTENTFUL_PAINT_MS** | LCP - 最大内容绘制 | ms | ≤ 2500 | 2500-4000 | > 4000 |

### 1.3 distributions 结构
每个指标包含用户分布比例：
```json
{
  "percentile": 1058,
  "distributions": [
    { "min": 0, "max": 2500, "proportion": 0.9428 },   // 94.28% 用户良好
    { "min": 2500, "max": 4000, "proportion": 0.0341 }, // 3.41% 用户需改进
    { "min": 4000, "proportion": 0.0232 }                // 2.32% 用户差
  ],
  "category": "FAST"
}
```

---

## 2. Lighthouse 实验室数据

### 2.1 四大类别评分 (categories)

| 类别 | 权重 | 说明 |
|------|------|------|
| **performance** | 最关注 | 性能评分 |
| **accessibility** | 重要 | 可访问性 |
| **best-practices** | 中等 | 最佳实践 |
| **seo** | 中等 | 搜索引擎优化 |

```json
{
  "performance": {
    "title": "Performance",
    "score": 1.0,
    "auditRefs": [{"id": "first-contentful-paint", "weight": 10}, ...]
  }
}
```

### 2.2 性能 Metrics Audits

#### Core Web Vitals 实验室数据

| Audit ID | 描述 | 单位 | 良好阈值 | 权重 |
|----------|------|------|----------|------|
| **first-contentful-paint** | FCP | ms | ≤ 1800 | 10% |
| **largest-contentful-paint** | LCP | ms | ≤ 2500 | 25% |
| **cumulative-layout-shift** | CLS | 无 | ≤ 0.1 | 25% |
| **total-blocking-time** | TBT | ms | ≤ 200 | 30% |
| **speed-index** | Speed Index | ms | ≤ 3400 | 10% |

#### 资源优化类 Audits (Opportunities)

| Audit ID | 描述 | 输出字段 |
|----------|------|----------|
| render-blocking-resources | 阻塞渲染的资源 | overallSavingsMs, items[url, wastedMs] |
| unminified-css | 未压缩的 CSS | overallSavingsBytes, wastedBytes |
| unminified-javascript | 未压缩的 JS | overallSavingsBytes, wastedBytes |
| unused-css-rules | 未使用的 CSS | overallSavingsBytes, wastedPercent |
| unused-javascript | 未使用的 JS | overallSavingsBytes, wastedPercent |
| modern-image-formats | 使用现代图片格式 | overallSavingsBytes, items[] |
| inefficient-animated-content | 低效的动画 | overallSavingsBytes |
| duplicatd-javascript | 重复的 JS | wastedBytes, items[source, wastedBytes] |
| legacy-javascript | 旧版 JS | wastedBytes, subItems[] |
| uses-responsive-images | 响应式图片 | overallSavingsBytes |
| offscreen-images | 懒加载图片 | overallSavingsBytes |
| uses-optimized-images | 优化图片 | overallSavingsBytes |

#### 网络类 Audits

| Audit ID | 描述 | 输出 |
|----------|------|------|
| server-response-time | 服务器响应时间 | numericValue(ms), displayValue |
| redirects | 重定向 | overallSavingsMs, items[url, wastedMs] |
| uses-http2 | HTTP/2 使用 | score (0/1) |
| uses-long-cache-ttl | 缓存策略 | items[url, cacheLifetimeMs] |
| total-byte-weight | 总字节大小 | numericValue(bytes), items[] |
| network-requests | 网络请求数 | items[url, resourceType, mimeType, transferSize] |
| network-rtt | 往返时间 | items[origin, rtt] |
| network-server-latency | 服务器延迟 | items[origin, serverResponseTime] |

#### DOM/渲染类

| Audit ID | 描述 | 输出 |
|----------|------|------|
| dom-size | DOM 大小 | numericValue(元素数), items[统计] |
| no-document-write | document.write | score (0/1) |
| external-anchors-use-rel-noopener | 外部链接安全 | score |
| errors-in-console | 控制台错误 | items[source, description] |
| valid-source-maps | Source Map | score |

### 2.3 可访问性 Audits (Accessibility)

共约 40+ 项，按严重程度分类：

#### 严重 (Critical)
- button-name - 按钮有名称
- color-contrast - 颜色对比度
- document-title - 文档有标题
- html-has-lang - html 有 lang
- image-alt - 图片有 alt
- label - 表单元素有 label
- link-name - 链接有名称
- list - 列表有效

#### 中等 (Moderate)
- accesskeys - accesskey 唯一性
- duplicate-id-aria - ARIA ID 唯一
- heading-order - 标题层级
- frame-title - 框架有标题
- html-lang-valid - lang 有效
- tabindex - tabindex ≤ 0

### 2.4 最佳实践 Audits (Best Practices)

| Audit ID | 描述 | 类型 |
|----------|------|------|
| errors-in-console | 控制台无错误 | binary |
| geolocation-on-start | 不自动请求定位 | binary |
| notification-on-start | 不自动请求通知 | binary |
| no-document-write | 不使用 document.write | binary |
| is-on-https | 使用 HTTPS | binary |
| uses-http2 | 使用 HTTP/2 | binary |
| no-vulnerable-libraries | 无漏洞库 | informative |
| js-libraries | 检测到的 JS 库 | informative |
| csp-xss | CSP 防 XSS | informative |
| deprecations | 无废弃 API | informative |

### 2.5 SEO Audits

| Audit ID | 描述 | 重要性 |
|----------|------|--------|
| viewport | viewport 元标签 | 高 |
| document-title | 有标题 | 高 |
| meta-description | meta 描述 | 高 |
| http-status-code | HTTP 200 | 高 |
| link-text | 链接文本描述性 | 高 |
| is-crawlable | 可被抓取 | 高 |
| image-alt | 图片 alt | 高 |
| canonical | 规范链接 | 中 |
| hreflang | hreflang 标签 | 中 |
| structured-data | 结构化数据 | 中 |
| tap-targets | 点击目标大小 | 高 |

---

## 3. 资源摘要 (Resource Summary)

```json
{
  "resource-summary": {
    "details": {
      "items": [
        { "resourceType": "script", "requestCount": 10, "transferSize": 150000 },
        { "resourceType": "stylesheet", "requestCount": 3, "transferSize": 50000 },
        { "resourceType": "image", "requestCount": 15, "transferSize": 500000 },
        { "resourceType": "font", "requestCount": 2, "transferSize": 80000 },
        { "resourceType": "document", "requestCount": 1, "transferSize": 10000 },
        { "resourceType": "third-party", "requestCount": 8, "transferSize": 200000 },
        { "resourceType": "total", "requestCount": 36, "transferSize": 810000 }
      ]
    }
  }
}
```

---

## 4. Score Display Mode 说明

| Mode | 说明 | 示例 |
|------|------|------|
| **binary** | 通过/失败 | score: 0 或 1 |
| **numeric** | 数值分数 | score: 0-1 |
| **informative** | 信息性，无分数 | score: null |
| **notApplicable** | 不适用 | score: null |
| **manual** | 需人工检查 | score: null |
| **error** | 出错 | score: null |
| **metricSavings** | 可节省的指标 | overallSavingsMs |

---

## 5. 推荐的数据展示结构

### 概览面板
```
┌─────────────────────────────────────────┐
│  综合评分: 85/100  [良好]               │
│                                         │
│  [性能: 90] [可访问性: 85]              │
│  [最佳实践: 95] [SEO: 75]               │
└─────────────────────────────────────────┘
```

### Core Web Vitals 面板
```
┌─────────────────────────────────────────┐
│  Core Web Vitals (真实用户数据)          │
│                                         │
│  LCP: 1.2s  [良好]  94% 用户           │
│  INP: 150ms [良好]  97% 用户           │
│  CLS: 0.02  [良好]  92% 用户           │
│                                         │
│  对比实验室数据 >>                      │
└─────────────────────────────────────────┘
```

### 性能机会面板
```
┌─────────────────────────────────────────┐
│  优化机会 (可节省 2.5s)                 │
│                                         │
│  1. 移除阻塞渲染的资源    节省 800ms    │
│  2. 压缩 JavaScript       节省 500ms    │
│  3. 使用现代图片格式      节省 400ms    │
│  4. 延迟加载图片          节省 300ms    │
│  5. 减少未使用的 JS       节省 200ms    │
│                                         │
│  [查看全部 12 项]                       │
└─────────────────────────────────────────┘
```

### 资源分析面板
```
┌─────────────────────────────────────────┐
│  资源分布                               │
│                                         │
│  图片: 500KB (62%)   ████████           │
│  JS:   150KB (18%)   ██                 │
│  CSS:   50KB (6%)    █                  │
│  字体:  80KB (10%)   █                  │
│  其他:  30KB (4%)                         │
│                                         │
│  总计: 36 个请求, 810KB                 │
│  第三方资源: 8 个, 200KB                │
└─────────────────────────────────────────┘
```

### 问题列表面板
```
┌─────────────────────────────────────────┐
│  问题列表 (共 15 项)                    │
│                                         │
│  🔴 严重 (2)                            │
│     - 图片缺少 alt 文本                  │
│     - 表单元素缺少 label                 │
│                                         │
│  🟡 警告 (8)                            │
│     - robots.txt 配置问题                │
│     - 链接文本不够描述性                 │
│     - ...                               │
│                                         │
│  🔵 提示 (5)                            │
│     - 可使用结构化数据                   │
│     - ...                               │
└─────────────────────────────────────────┘
```

---

## 6. API 调用示例

### 基础调用
```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&key=YOUR_API_KEY&strategy=mobile"
```

### 指定类别
```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&key=YOUR_API_KEY&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO"
```

### 完整参数
```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&key=YOUR_API_KEY&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&locale=zh-CN&utmsource=webscanner"
```

### 参数说明
| 参数 | 说明 | 可选值 |
|------|------|--------|
| url | 要分析的 URL | 必填 |
| key | API Key | 必填 |
| strategy | 设备策略 | mobile / desktop |
| category | 测试类别 | PERFORMANCE / ACCESSIBILITY / BEST_PRACTICES / SEO / PWA |
| locale | 语言 | zh-CN / en-US 等 |
| utmsource | 来源标识 | 自定义 |
| captchaToken | CAPTCHA 令牌 | 需要时提供 |

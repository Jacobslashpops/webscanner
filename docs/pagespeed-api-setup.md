# Google PageSpeed Insights API 接入指南

## 1. 获取 API Key

### 步骤 1: 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击右上角的项目下拉菜单 → "新建项目"
3. 输入项目名称（如 "WebScanner"）
4. 点击"创建"

### 步骤 2: 启用 PageSpeed Insights API

1. 在 Google Cloud Console 中，进入 [API 和服务库](https://console.cloud.google.com/apis/library)
2. 搜索 "PageSpeed Insights API"
3. 点击进入并点击"启用"

### 步骤 3: 创建 API Key

1. 进入 [凭据页面](https://console.cloud.google.com/apis/credentials)
2. 点击"创建凭据" → "API 密钥"
3. 复制生成的 API Key

### 步骤 4: 配置 API Key 限制（推荐）

为了安全，建议配置 API Key 的使用限制：

1. 在凭据页面点击刚创建的 API Key
2. 在"应用程序限制"中：
   - 选择"HTTP 引荐来源网址（网站）"
   - 添加你的域名（如 `http://localhost:3023/*` 用于开发）
3. 在"API 限制"中：
   - 选择"限制密钥"
   - 勾选 "PageSpeed Insights API"
4. 点击"保存"

## 2. 配置项目

### 设置环境变量

1. 复制示例文件：
   ```bash
   cp .env.local.example .env.local
   ```

2. 编辑 `.env.local`，填入你的 API Key：
   ```
   PAGESPEED_API_KEY=你的_api_key
   ```

3. 重启开发服务器：
   ```bash
   npm run dev
   ```

## 3. API 限制和配额

### 免费配额

Google PageSpeed Insights API 提供以下免费配额：

- **每秒查询次数**: 1 QPS（每秒1次）
- **每日查询次数**: 无明确限制（实际使用中通常是数千次）
- **每月查询次数**: 无明确限制

### 优化建议

由于有 1 QPS 的限制，建议：

1. **添加请求队列**: 避免同时发送多个请求
2. **缓存结果**: 相同 URL 的结果可以缓存 1 小时或更久
3. **批量处理**: 如果有多 URL 需要分析，使用队列依次处理

## 4. API 响应说明

### 评分标准

Lighthouse 评分范围 0-100：

| 评分 | 等级 | 说明 |
|------|------|------|
| 90-100 | 优秀 | 性能良好 |
| 70-89 | 良好 | 性能可接受，仍有优化空间 |
| 50-69 | 需改进 | 存在明显性能问题 |
| 0-49 | 较差 | 严重性能问题 |

### Core Web Vitals 阈值

| 指标 | 良好 | 需改进 | 较差 |
|------|------|--------|------|
| LCP (最大内容绘制) | ≤ 2.5s | 2.5s - 4s | > 4s |
| FID (首次输入延迟) | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS (累积布局偏移) | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| FCP (首次内容绘制) | ≤ 1.8s | 1.8s - 3s | > 3s |

## 5. 故障排除

### 常见错误

#### 403 Forbidden

**原因**: API Key 无效或未启用 PageSpeed Insights API

**解决**: 
- 确认 API Key 正确
- 在 Google Cloud Console 中确认 API 已启用

#### 429 Too Many Requests

**原因**: 超出速率限制（1 QPS）

**解决**:
- 添加请求间隔，确保每秒不超过 1 次请求
- 实现指数退避重试机制

#### 500 Internal Server Error

**原因**: Google 服务端错误或网站无法访问

**解决**:
- 检查目标网站是否可访问
- 重试请求

## 6. 升级方案

如果免费配额不够用，可以考虑：

1. **申请更高配额**: 在 Google Cloud Console 中申请提升配额
2. **多 Key 轮询**: 创建多个项目/API Key 进行轮询（不推荐，可能违反服务条款）
3. **使用其他服务**: 
   - [WebPageTest](https://www.webpagetest.org/) - 免费 API
   - [GTmetrix](https://gtmetrix.com/api/) - 付费 API

## 7. 相关链接

- [PageSpeed Insights API 文档](https://developers.google.com/speed/docs/insights/v5/get-started)
- [Lighthouse 评分指南](https://web.dev/performance-scoring/)
- [Core Web Vitals 文档](https://web.dev/vitals/)

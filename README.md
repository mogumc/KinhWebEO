# KinhWebEO

百度网盘文件管理工具 - EdgeOne Serverless 版本

## 功能特性

- 文件列表浏览
- 文件下载（支持 302 重定向）
- 图片/视频/音频在线预览
- 支持本地解析和远程解析两种模式
- 移动端响应式设计

## 技术栈

- **后端**: Go + Gin（EdgeOne 云函数）
- **前端**: Next.js 15 + React 19 + Tailwind CSS 4
- **部署**: EdgeOne Pages + EdgeOne 云函数

## 项目结构

```
KinhWebEO/
├── cloud-functions/          # Go 云函数后端
│   ├── main.go              # 入口文件
│   ├── handler/             # API 处理器
│   ├── config/              # 配置管理
│   ├── utils/               # 工具函数
│   └── result/              # 响应格式
├── src/                     # Next.js 前端
│   ├── app/                 # 页面路由
│   ├── components/          # React 组件
│   └── lib/                 # API 封装和工具函数
└── .edgeone/                # EdgeOne 配置
```

## 快速开始

### 本地开发

1. 后端开发：

```bash
cd cloud-functions
go run main.go
```

2. 前端开发：

```bash
npm install
npm run dev
```

### 配置说明

创建 `cloud-functions/_config.yaml` 文件：

```yaml
system:
  bind_port: 9000
  bind_host: "0.0.0.0"
  title: "KinhWeb"
  foot: ""

user:
  bduss: "你的百度BDUSS"
  is_vip: 0
  acclink: ""
  api_path: http://110.242.69.43
```

或使用环境变量：

```bash
export BDUSS="你的百度BDUSS"
export TITLE="KinhWeb"
export API_PATH="http://110.242.69.43"
```

### EdgeOne 部署

1. 后端部署为 EdgeOne 云函数
2. 前端部署为 EdgeOne Pages
3. 配置环境变量（BDUSS 等敏感信息）

## API 接口

### 文件列表

```
GET /api/list?dir=/path/
```

### 文件下载

```
GET /api/down?fid=123456&m=.baidu.com
```

## 许可证

GPL-2.0

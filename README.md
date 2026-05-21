
<p align="center">
  <img src="https://github.com/mogumc/KinhWebEO/raw/main/logo.jpg" alt="KinhWeb" width="300"/>
</p>

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
│   ├── index.go              # 入口文件
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
go run index.go
```

2. 前端开发：

```bash
npm install
npm run dev
```

### 配置说明

#### 配置文件

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

> **注意**：如果你通过源码部署到 EdgeOne 等 Serverless 平台，无论是否使用 `_config.yaml`，都应当存在这个文件。

#### 环境变量

环境变量优先级最高，可覆盖 `_config.yaml` 中的对应值。

> **须知**: 对于 EdgeOne Port 9000是默认配置，非必要不建议自行修改。 

**后端环境变量**（云函数运行时）：

| 变量名 | 说明 | 默认值 | 是否必填 |
|:---|:---|:---|:---|
| `BDUSS` | 百度账号的 BDUSS Cookie，用于鉴权访问百度网盘 API | `""` | ✅ 必填 |
| `IS_VIP` | 百度网盘会员类型：`0` = 非会员，`1` = 普通会员，`2` = 超级会员 | `0` | 否 |
| `ACCLINK` | 加速链接，留空则使用官方 API 地址 | `""` | 否 |
| `API_PATH` | 百度网盘 API 地址，使用自建代理时修改 | `http://110.242.69.43` | 否 |
| `TITLE` | 站点标题，显示在页面顶部 | `KinhWeb` | 否 |
| `FOOT` | 页脚文字，显示在页面底部 | `""` | 否 |
| `PORT` | 后端服务监听端口 | `9000` | 否 |
| `HOST` | 后端服务监听地址 | `0.0.0.0` | 否 |

**前端环境变量**（Next.js 构建时）：

| 变量名 | 说明 | 默认值 | 是否必填 |
|:---|:---|:---|:---|
| `NEXT_PUBLIC_API_BASE` | 后端 API 地址，前端通过此地址请求后端接口。留空则自动使用当前域名 | `""`（同源） | 否 |

> **提示**：`NEXT_PUBLIC_` 前缀的变量会在 Next.js 构建时注入到前端代码中，因此需要在 `npm run build` 之前设置。

#### 环境变量配置示例

```bash
# 后端环境变量
export BDUSS="你的百度BDUSS"
export TITLE="KinhWeb"
export API_PATH="http://110.242.69.43"
export IS_VIP=0

# 前端环境变量
# export NEXT_PUBLIC_API_BASE="http://localhost:9000"
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

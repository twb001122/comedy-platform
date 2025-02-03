# 笑了么 - 脱口秀演出及演员匹配平台

一个连接脱口秀演员和演出主办方的平台，帮助双方快速找到合适的机会。

## 主要功能

- 演出发布与浏览
- 演员信息展示
- 用户认证（演员/主办方）
- 个人中心管理

## 技术栈

- Next.js 14
- TypeScript
- MongoDB
- Tailwind CSS
- NextAuth.js

## 本地开发

1. 克隆项目
```bash
git clone [你的仓库地址]
cd comedy-platform
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
复制 `.env.example` 到 `.env.local` 并填写必要的环境变量：
```
MONGODB_URI=你的MongoDB连接地址
NEXTAUTH_SECRET=你的NextAuth密钥
```

4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 部署

项目可以部署到任何支持 Next.js 的平台，推荐使用 Vercel：

1. 在 Vercel 上导入 GitHub 仓库
2. 配置环境变量
3. 部署完成后即可访问

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

MIT License

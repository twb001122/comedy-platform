#!/bin/bash

# 检查端口是否被占用
if lsof -i :3000 > /dev/null 2>&1; then
    echo "端口 3000 被占用，正在关闭占用进程..."
    # 获取占用端口的 PID 并终止进程
    lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
    echo "进程已终止"
fi

# 启动开发服务器
npx next dev 
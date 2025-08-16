// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// --- ① 基本 ---
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// 静的配信（/public 配下）
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, filePath) {
    // VRM/GLB/FBX の Content-Type を明示（ブラウザで誤認識されがち）
    if (filePath.endsWith('.vrm') || filePath.endsWith('.glb')) {
      res.setHeader('Content-Type', 'model/gltf-binary');
    } else if (filePath.endsWith('.fbx')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// ルート（SPA想定なら何でも index.html 返す）
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ② HTTPサーバを起動（Render は PORT を環境変数で指定）---
const port = process.env.PORT || 3000;
const host = '0.0.0.0'; // ← 重要：外部から到達可
const server = app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});

// --- ③ WebSocket（例：Socket.IO。不要なら丸ごと削除でOK）---
/*
import { Server } from 'socket.io';
const io = new Server(server, {
  cors: { origin: '*' }  // 必要に応じてオリジンを絞る
});

// 接続ハンドラ（位置同期など）
io.on('connection', (socket) => {
  console.log('ws connected', socket.id);

  socket.on('pos', (data) => {
    // {id, x,y,z, yaw} などをブロードキャスト
    socket.broadcast.emit('pos', { ...data, id: socket.id });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', { id: socket.id });
  });
});
*/

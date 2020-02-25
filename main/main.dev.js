const { app, BrowserWindow } = require('electron');
const PostController = require('./controllers/post');
const PostCollectionController = require('./controllers/collection');

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.webContents.openDevTools();

  new PostController().register();
  new PostCollectionController().register();

  // 加载index.html文件
  win.loadURL('http://localhost:8089/#/');
}

app.whenReady().then(createWindow);

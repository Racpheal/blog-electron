const { app, BrowserWindow } = require('electron');
const ManageCategoryController = require('./controllers/manage/category');
const BlogEditorController = require('./controllers/blog/editor');

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

  new ManageCategoryController().register();
  new BlogEditorController().register();

  // 加载index.html文件
  win.loadURL('http://localhost:8089/#/');
}

app.whenReady().then(createWindow);

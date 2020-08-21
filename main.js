const { app, ipcMain, BrowserWindow, Notification } = require('electron');

function handleIPC() {
  ipcMain.on('notification', () => {
    let notification = new Notification({
      title: '番茄钟',
      body: '完成工作，休息一下吧',
      silent: false,
      timeoutType: 'default',
    });
    notification.show();
    notification.on('close', () => {
      console.log('close');
    });
    notification.on('click', () => {
      console.log('click');
    });
  });
}

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // 加载index.html文件
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  handleIPC();
  createWindow();
});

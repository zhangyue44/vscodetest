# Electron

## 1.安装 Electron

```js
# npm 安装
npm install electron --save-dev

# 使用
"start": "electron ." // package.json
npm run start
```

## 2.使用 VS Code 调试

```js
根目录新建一个 .vscode 文件夹，然后在其中新建一个 launch.json 配置文件并填写如下内容:

{
  "version": "0.2.0",
  "compounds": [
    {
      "name": "Main + renderer",
      "configurations": ["Main", "Renderer"],
      "stopAll": true
    }
  ],
  "configurations": [
    {
      "name": "Renderer",
      "port": 9222,
      "request": "attach",
      "type": "chrome",
      "webRoot": "${workspaceFolder}"
    },
    {
      "name": "Main",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": [".", "--remote-debugging-port=9222"],
      "outputCapture": "std",
      "console": "integratedTerminal"
    }
  ]
}
```

## 3.打包应用程序

```js
#  Electron Forge 打包和分发应用
npm install --save-dev @electron-forge/cli
npx electron-forge import

npm run make // 打包

# 分发应用程序时对代码进行签名
// 配置forge.config.js
module.exports = {
  // ...
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        certificateFile: './cert.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      }
    }
  ]
  // ...
}
```

## 4.标题栏

```js
function createWindow () {
  const win = new BrowserWindow({
    titleBarStyle: 'hidden' // 去除默认标题栏
    // expose window controls in Windows/Linux
    // 窗口控件
    ...(process.platform !== 'darwin' ? { titleBarOverlay: true } : {})
  })
  win.loadURL('https://example.com')
}

// 设置窗口控件样式
titleBarOverlay: {
    color: '#2f3241',
    symbolColor: '#74b1be',
    height: 60
  }
```

## 5.app-region: drag

```js
# app-region: drag
告诉Electron 哪些区域可以拖拽
```

## 6.禁止打开两个实例

```js
# Make this app a single instance app
// mainWindow = new BrowserWindow(windowOptions)
function makeSingleInstance () {
  if (process.mas) return
  app.requestSingleInstanceLock()
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
```

## 7.开启子进程

```js
#!/usr/bin/env node

const { spawn } = require("child_process"); // 子进程
const electron = require("electron");
const path = require("path");

const appPath = path.join(__dirname, "main.js");
const args = [appPath].concat(process.argv.slice(2));
const proc = spawn(electron, args, { stdio: "inherit" });
// process.exit() 终止当前进程
proc.on("close", (code) => process.exit(code)); // 子进程结束后，手动再关闭一次
```

## 8.shell

```js
# shell.openExternal
// 打开资源，如网页、文件、图片等
const {shell} = require('electron')
const path = require('path')
const protocolHandlerBtn = document.getElementById('protocol-handler')
protocolHandlerBtn.addEventListener('click', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = path.join('file://', pageDirectory, '../../sections/system/protocol-link.html')
  shell.openExternal(pagePath)
})

shell.openExternal('http://electron.atom.io')
shell.showItemInFolder(os.homedir()) // 文件管理器中打开用户主目录并高亮显示
// os.homedir()：返回当前用户的主目录路径
// shell.showItemInFolder()：在文件管理器中打开并高亮指定路径
```

## 9.tray

```js
const iconName =
	process.platform === "win32" ? "windows-icon.png" : "iconTemplate.png";
const iconPath = path.join(__dirname, iconName);
appIcon = new Tray(iconPath);

const contextMenu = Menu.buildFromTemplate([
	{
		label: "Remove",
		click: () => {
			event.sender.send("tray-removed");
		},
	},
]);

appIcon.setToolTip("Electron Demo in the tray.");
appIcon.setContextMenu(contextMenu);

// if (appIcon) appIcon.destroy()
```

## 10.dialog

```js
const options = {
	title: "Save an Image",
	filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
};
dialog.showSaveDialog(options, (filename) => {
	// xxxx
});

dialog.showOpenDialog(
	{
		properties: ["openFile", "openDirectory"],
	},
	(files) => {
		if (files) {
			// xxxx
		}
	}
);

const options = {
	type: "info",
	title: "Information",
	message: "This is an information dialog. Isn't it nice?",
	buttons: ["Yes", "No"],
};
dialog.showMessageBox(options, (index) => {
	// xxxx
});

dialog.showErrorBox("An Error Message", "Demonstrating an error message.");
```

## 11.menu

```js
const menu = new Menu();
menu.append(
	new MenuItem({ label: "Electron", type: "checkbox", checked: true })
);

win.webContents.on("context-menu", (e, params) => {
	menu.popup(win, params.x, params.y);
});

ipcMain.on("show-context-menu", (event) => {
	const win = BrowserWindow.fromWebContents(event.sender);
	menu.popup(win);
});
```

## 12.demo

```js
# render.js
const information = document.getElementById("info");
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;
const func = async () => {
  const response = await window.versions.ping();
  console.log(response); // 打印 'pong'
};
func();

const setButton = document.getElementById("btn");
const titleInput = document.getElementById("title");
setButton.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitle(title);
});

const btn = document.getElementById("btn");
const filePathElement = document.getElementById("filePath");
btn.addEventListener("click", async () => {
  const filePath = await window.electronAPI.openFile();
  filePathElement.innerText = filePath;
});

const counter = document.getElementById("counter");
window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue.toString();
  window.electronAPI.counterValue(newValue);
});

# preload.js
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 除函数之外，我们也可以暴露变量
  ping: () => ipcRenderer.invoke("ping"),
  setTitle: (title) => ipcRenderer.send("set-title", title), // 单向通信:渲染进程到主进程
  openFile: () => ipcRenderer.invoke("dialog:openFile"), // 双向通信:渲染进程到主进程
  // 主进程到渲染进程
  onUpdateCounter: (callback) =>
    ipcRenderer.on("update-counter", (_event, value) => callback(value)),
  counterValue: (value) => ipcRenderer.send("counter-value", value),
});

# index.js
const {
  app,
  BrowserWindow,
  ipconst {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  MessageChannelMain,
  Tray,
  nativeImage,
} = require("electron/main");
// const { app, BrowserWindow } = require('electron/main') // 兼容ts的更好的写法
const path = require("node:path");

function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // 脚本附在渲染进程
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "img/favicon.ico"),
  });

  // 自定义菜单
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => win.webContents.send("update-counter", -1),
          label: "Decrement",
        },
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
        {
          label: "Speech",
          submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
  // Menu.setApplicationMenu(null) // 不需要默认菜单时

  win.loadFile("index.html");
  const contents = win.webContents; // 主进程中获取渲染进程数据,多进程机制
  contents.openDevTools();
};

// app.on('ready', () => {})
app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong"); //  HTML 文件加载之前
  ipcMain.on("set-title", handleSetTitle); // 单向通信:渲染进程到主进程
  ipcMain.handle("dialog:openFile", handleFileOpen); // 双向通信
  ipcMain.on("counter-value", (_event, value) => {
    console.log(value);
  });
  ipcMain.on("show-context-menu", (event) => {
    const template = [
      {
        label: "Menu Item 1",
        click: () => {
          event.sender.send("context-menu-command", "menu-item-1");
        },
      },
      { type: "separator" },
      { label: "Menu Item 2", type: "checkbox", checked: true },
      {
        label: "Speech",
        submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 关闭所有窗口时退出应用 (Windows & Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

# Vscode

## 1.vscode 源码环境配置

```js
# 官方网址
https://github.com/microsoft/vscode/wiki/How-to-Contribute
# 博客地址
https://blog.csdn.net/qq_17129291/article/details/148280765

1. node版本：与vscode源码根目录文件.nvmrc中的node版本基本保持一致 (node -v) v22.17.0
2. python版本：查看node-gyp要求的版本号，最好安装最新版本，去官网下载安装，不要安装在C盘 (python --version)  3.13.5
3. node-gyp版本：npm install -g node-gyp (node-gyp -v)  v11.2.0
4. 安装 Visual Studio Build Tools 2022：自己去官网下载安装，安装中只需选择Desktop Development with C++，默认选择不用动；然后在单组件中选择:
MSVC v143 - VS 2022 C++ x64/x86 缓解库(最新)
带有Spectre缓解措施、适用于最新v143生成工具的C++ATL(x86和x64)
带有Spectre缓解措施、适用于最新v143生成工具的C++MFC(x86和x64)
(主目录安装在C盘，下载缓存可以放其他盘)
5. npm config edit:会打开记事本，添加 msvs_version=2022
```

## 2.vscode 源码编译

```js
1.拉取代码
git clone https://github.com/microsoft/vscode.git // github项目源码地址
git clone https://gitcode.com/gh_mirrors/vscode6/vscode.git // 国内镜像地址
2.npm install
3.npm run watch // 编译工程
4..\scripts\code.bat // 运行vscode
5.npm run gulp vscode-win32-x64 // 打包 npm run gulp vscode-win32-x64-min
```

## 3.sha256查询

```js
// 对应位置下
sha256sum.exe electron-v35.6.0-win32-x64.zip

// 项目的sha256值的具体路径
\build\checksums\electron.txt
```

## 4.activity bar location

```js
# 修改默认位置为top
src/vs/workbench/browser/workbench.contribution.ts

[LayoutSettings.ACTIVITY_BAR_LOCATION]: {
    'default': 'top',
}
```

## 5.Theme

```js
# 修改默认主题为light
src/vs/workbench/services/themes/common/themeConfiguration.ts

const colorThemeSettingSchema = {
    default: ThemeSettingDefaults.COLOR_THEME_LIGHT,
}
```

## 6.产品名称

```js
# product.json
"nameShort": "weiwei",
"nameLong": "weiwei",

1.全局搜索code-oss，进行全局替换为weiwei
2.根目录下的 .build/electron 中的 code-oss.exe 名称更改为 weiwei.exe
```

## 7.产品图标

```js
# 图标更改
1. resources/win32/   *.png *.ico
2. src/vs/workbench/browser/media/code-icon.svg
```

# vscode 插件开发

## 1.环境配置

```js
1. npm install -g yo generator-code // 安装脚手架
2. yo code
```

# 装修

## 1.美缝收边

```js
项目：全屋美缝+收边
美缝材料：皇室工匠极瓷20纯聚脲
收边材料：瓦克
原价：2900+500=3300
优惠价：2075+400=2475  (美缝在团购价基础上打75折，再减去100元，收边减去100元)
订金：500元（已支付）
尾款：1975元，施工完成验收后付尾款
店铺地址：皇氏工匠美缝杭州代理（西园五路店）
合同：后续抽时间去店里签合同

美缝细节：阳台、客厅的地面，2个卫生间、厨房的地面与墙面，主卧飘窗
收边细节：门框和墙纸，踢脚线和墙纸
质保：美缝的断裂/脱落、收边都是质保3年，美缝变色质保20年
```

**市面上的美缝剂**

![111](D:\biancheng\Electron\vscode-main\vscode\imagee\市面美缝剂.jpg)

![](D:\biancheng\Electron\vscode-main\vscode\imagee\美缝剂2.jpg)

**小区团购价格**

![](D:\biancheng\Electron\vscode-main\vscode\imagee\团购价.jpg)

**订金记录**

![](D:\biancheng\Electron\vscode-main\vscode\imagee\定金记录.jpg)

**收边增加项记录**

这个到时候要全屋定制结束后再开展，所以要收边处理2次

![](D:\biancheng\Electron\vscode-main\vscode\imagee\收边.jpg)

## 2.
const { app, clipboard, BrowserWindow, Menu, BrowserView } = require('electron');

let mainWindow;
const webViews = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false, // Desactivar la integración de Node.js en la vista web
      contextIsolation: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  mainWindow.loadFile('index.html');
  createMenu();
  mainWindow.on('resize', adjustBounds);

  mainWindow.webContents.once('dom-ready', setupLoadingScreen);
  mainWindow.webContents.once('did-finish-load', () => {
    createWebView();
  });
}

function createMenu() {
  const template = [
    {
      label: 'Navegación',
      submenu: [
        { label: 'Adelante', click: () => getCurrentWebView().webContents.goForward() },
        { label: 'Atrás', click: () => getCurrentWebView().webContents.goBack() },
        { label: 'Recargar', click: () => getCurrentWebView().webContents.reload() },
        { label: 'Nueva Pestaña', click: createWebView },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        {
          label: 'Copiar',
          accelerator: 'CmdOrCtrl+C',
          click: copyTextToClipboard,
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function getCurrentWebView() {
  return webViews[mainWindow.getBrowserView().id];
}

function copyTextToClipboard() {
  const currentWebView = getCurrentWebView();
  if (currentWebView) {
    currentWebView.webContents.executeJavaScript('window.getSelection().toString()')
      .then(selectedText => {
        clipboard.writeText(selectedText);
      });
  }
}

function adjustBounds() {
  const { width, height } = mainWindow.getBounds();
  const currentWebView = getCurrentWebView();

  if (currentWebView) {
    currentWebView.setBounds({ x: 0, y: 0, width, height: height - 25 });
  }
}

function setupLoadingScreen() {
  setTimeout(() => {
    mainWindow.webContents.executeJavaScript(`
      const loadingScreen = document.getElementById('loading-screen');
      loadingScreen.style.display = 'none';
    `);
  }, 5000);
}

function createWebView() {
  const webView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
    },
  });

  mainWindow.setBrowserView(webView);
  adjustBounds();
  webView.webContents.loadURL('https://www.example.com');
  console.log('Cargando URL en la nueva pestaña:', webView.webContents.getURL());

  // Abre las herramientas de desarrollo solo si no están abiertas.
  if (!webViews[webView.id]) {
    webView.webContents.openDevTools();
  }

  webView.webContents.once('did-finish-load', () => {
    console.log('Página web cargada en la nueva pestaña');
  });

  webViews[webView.id] = webView;
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

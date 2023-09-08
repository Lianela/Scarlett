// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createBannerImage: () => {
    const bannerImage = document.createElement('img');
    bannerImage.src = 'Scarlett Banner.png';
    return bannerImage;
  }
});
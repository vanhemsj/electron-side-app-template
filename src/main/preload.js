/**
 * Exposes electron main process functionalities to the renderer process via a pre-configured API.
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    toggleWindowSize: () => ipcRenderer.send('toggle-window-size'),
    closeApp: () => ipcRenderer.send('close-app'),
    moveWindow: (dx, dy) => ipcRenderer.send('move-window', { dx, dy })
});
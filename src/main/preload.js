
const { contextBridge, ipcRenderer } = require('electron');

// Expose specific APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        invoke: (channel, data) => ipcRenderer.invoke(channel, data),
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    },
});

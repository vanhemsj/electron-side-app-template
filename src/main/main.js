const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let isCollapsed = false;
let lastWindowPosition;

/**
 * Creates and configures the main application window.
 */
function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: Math.floor(width * 0.3),
        height,
        x: 0,
        y: 0,
        frame: false,
        resizable: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            backgroundThrottling: false,
        },
    });

    mainWindow.loadFile('src/renderer/html/index.html');
    mainWindow.setMenuBarVisibility(false);
}

/**
 * Handles the event to move the window based on mouse drag.
 * @param {Event} event - The event object.
 * @param {Object} position - The new position of the window.
 */
ipcMain.on('move-window', (event, { dx, dy }) => {
    const position = mainWindow.getPosition();
    const newX = position[0] + dx;
    const newY = position[1] + dy;
    mainWindow.setPosition(newX, newY, true);
    lastWindowPosition = { x: newX, y: newY };
});

/**
 * Toggles the window size between its expanded and collapsed states.
 */
ipcMain.on('toggle-window-size', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
   mainWindow.setResizable(true);
    if (isCollapsed) {
        mainWindow.setSize(Math.floor(width * 0.3), height);
        mainWindow.setPosition(0, 0);
    } else {
        setTimeout(() => {
            mainWindow.setSize(80, 80);
            mainWindow.setResizable(false);
            if (!lastWindowPosition) {
                mainWindow.setPosition(0, height - 200);
            } else {
                mainWindow.setPosition(lastWindowPosition.x, lastWindowPosition.y);
            }
        }, 300);
    }
    isCollapsed = !isCollapsed;
});

/**
 * Closes the application.
 */
ipcMain.on('close-app', () => app.quit());

/**
 * Initializes the application and creates the main window once Electron is ready.
 */
app.whenReady().then(createWindow);

/**
 * Quits the application when all windows are closed.
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

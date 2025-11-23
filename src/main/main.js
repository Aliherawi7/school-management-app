const { app, BrowserWindow, globalShortcut, Menu } = require('electron');
const path = require('path');
const loki = require('lokijs');
const { ipcMain } = require('electron');
const fs = require('fs');
// Add this for correct URL resolution
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
let mainWindow;
let splash;

const http = require('http');
// const log = require('electron-log');


// production mode =================================
app.disableHardwareAcceleration();

const waitForReactDevServer = (url, callback) => {
    const interval = setInterval(() => {
        http.get(url, () => {
            clearInterval(interval);
            callback();
        }).on('error', () => {
            console.log(`Waiting for React development server at ${url}...`);
        });
    }, 1000); // Check every second
};

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1260,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        show: false,
        autoHideMenuBar: true,
    });

    console.log("env==============>: ", process.env.NODE_ENV);


    const isDev = !app.isPackaged;
    const startUrl = isDev
        ? `http://localhost:${process.env.PORT || 8282}` // React dev server
        : path.join(app.getAppPath(), 'build', 'index.html');;

    if (isDev) {
        waitForReactDevServer(startUrl, () => {
            mainWindow
                .loadURL(startUrl)
                .catch((err) => {
                    console.error("Error loading React Dev URL:", err);
                });
        });
    } else {
        // Correct usage of loadFile with an absolute file path
        mainWindow
            .loadFile(startUrl)
            .catch((err) => {
                console.error("Error loading production build:", err);
            });
    }

    // Show the main window once the content is fully loaded
    mainWindow.once('ready-to-show', () => {
        splash.close();
        mainWindow.show();
    });

    // Register DevTools shortcuts
    globalShortcut.register('Control+Alt+A+C+H', () => {
        mainWindow.webContents.openDevTools();
        console.warn('Developer tools shortcut triggered in production!');
    });

    globalShortcut.register('Control+Shift+I', () => {
        // mainWindow.webContents.openDevTools();
        console.warn('Developer tools shortcut triggered in production!');
    });
};

const disableDevToolsInMenu = () => {
    const template = [
        {
            label: 'File',
            submenu: [{ role: 'quit' }],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' },
            ],
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleFullScreen' },
            ],
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

app.on('ready', () => {
    disableDevToolsInMenu();

    // Create the splash screen
    splash = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        center: true,
    });
    splash.loadFile(path.join(__dirname, 'splash.html')).catch((err) => {
        console.error('Error loading splash screen:', err);
    });

    // Create the main window
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});



// ===================== database ====================================



// Determine paths
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'user_data.json');
const firstRunFile = path.join(userDataPath, 'first_run_flag');

// Log database path
console.log(`Database path: ${dbPath}`);

// Initialize the database
const db = new loki(dbPath, {
    autoload: true,
    autosave: true,
    autosaveInterval: 5000, // Save every 5 seconds
    autoloadCallback: databaseInitialize
});

function databaseInitialize() {
    // Check if this is the first run
    const isFirstRun = !fs.existsSync(firstRunFile);
    // setupDatabase();

    if (isFirstRun) {
        console.log('First run detected. Initializing database...');
        // Initialize collections
        setupDatabase();
        // Create the first run flag file
        fs.writeFileSync(firstRunFile, 'true');
        console.log('First run flag created.');
    } else {
        console.log('Not the first run. Database initialization skipped.');
    }
}

function setupDatabase() {
    // Remove existing collections if necessary
    db.collections.forEach((collection) => db.removeCollection(collection.name));

    // Create new collections
    db.addCollection('systemConfig');
    db.addCollection('teachers');
    db.addCollection('schedules');
    db.addCollection('classNames');
    db.addCollection('subjects');
    db.addCollection('times');
    db.addCollection('consumptionTypes');
    db.addCollection('consumptions');

    // Save the initialized database
    db.saveDatabase();
    console.log('Database initialized.');
}


/* ==================================================================

    Renderer Process (React)
    You can access the LokiJS database from the renderer process. 
    Use Electron's ipcRenderer to send and receive data between processes.
    
 =========================================================================*/

// ----- teacher operations --------------
ipcMain.handle('get-teachers', async () => {
    const teachers = db.getCollection('teachers');
    return teachers ? teachers.find() : [];
});

ipcMain.handle('get-teacher-by-id', async (event, id) => {
    const teachers = db.getCollection('teachers');
    return teachers.get(id)
});

ipcMain.handle('get-teacher-by-name', async (query) => {
    const teachers = db.getCollection('teachers');
    console.log("query :", query);

    // Find users whose combined name and lastname start with the query string
    return teachers.find(teacher => {
        const fullName = `${teacher.name} ${teacher.lastName}`;
        return fullName.toLowerCase().startsWith(query.toLowerCase());
    });
});

ipcMain.handle('add-teacher', async (event, teacher) => {
    const teachers = db.getCollection('teachers');
    return teachers.insert(teacher);
});

ipcMain.handle('update-teacher', async (event, teacher) => {
    const teachers = db.getCollection('teachers');
    teachers.update(teacher)
    return { success: true };
});

ipcMain.handle('delete-teacher', async (event, teacher) => {
    const teachers = db.getCollection('teachers');
    teachers.remove(teacher)
    return { success: true };
});



// ==================== consumptions ========================

ipcMain.handle('add-consumption', async (event, consumption) => {
    const consumptions = db.getCollection('consumptions');
    return consumptions.insert(consumption);
});

ipcMain.handle('update-consumption', async (event, consumption) => {
    const consumptions = db.getCollection('consumptions');
    return consumptions.update(consumption)
});

ipcMain.handle('delete-consumption', async (event, consumption) => {
    const consumptions = db.getCollection('consumptions');
    return consumptions.remove(consumption)
});

ipcMain.handle('get-consumptions', async (event) => {
    const consumptions = db.getCollection('consumptions');
    return consumptions.find() || [];
});

ipcMain.handle('get-today-consumptions', async (event) => {
    const consumptions = db.getCollection('consumptions');
    return consumptions.find() || [];
});
ipcMain.handle('get-consumptions-by-type', async (event, type) => {
    const consumptions = db.getCollection('consumptions');
    return consumptions.find(item => {
        return item.type === type
    });
});

// ==================== consumption types ========================

ipcMain.handle('add-consumption-type', async (event, consumption) => {
    const consumptions = db.getCollection('consumptionTypes');
    return consumptions.insert(consumption);
});

ipcMain.handle('update-consumption-type', async (event, consumption) => {
    const consumptions = db.getCollection('consumptionTypes');
    return consumptions.update(consumption)

});

ipcMain.handle('delete-consumption-type', async (event, consumption) => {
    const consumptions = db.getCollection('consumptionTypes');
    return consumptions.remove(consumption)
});

ipcMain.handle('get-consumption-types', async (event) => {
    const consumptions = db.getCollection('consumptionTypes');
    return consumptions.find() || [];
});





// =================== Logs ==============================
ipcMain.handle('add-log', async (event, log) => {
    const logs = db.getCollection('logs');
    return logs.insert(log);
});

ipcMain.handle('get-logs', async (event) => {
    const logs = db.getCollection('logs');
    return logs.find() || [];
});


// --------back up---------------------
// IPC Handler: Export database
ipcMain.handle("db-export", async () => {
    try {
        const data = db.serialize();
        return { success: true, data };
    } catch (error) {
        console.error("Error exporting database:", error);
        return { success: false, error: error.message };
    }
});

// IPC Handler: Import database
ipcMain.handle("db-import", async (_, data) => {
    try {
        db.loadJSON(data);
        return { success: true };
    } catch (error) {
        console.error("Error importing database:", error);
        return { success: false, error: error.message };
    }
});



//  security ======================================


ipcMain.handle('get-system-config', async () => {
    const systemConfig = db.getCollection('systemConfig');
    const data = systemConfig.find()
    console.log("sysconfg: ", data);
    return data;
});

ipcMain.handle('add-system-config', async (event, systemConfig) => {
    const configCollection = db.getCollection('systemConfig');
    console.log('configuration: ', configCollection);
    return configCollection.insert(systemConfig);

});

ipcMain.handle('update-system-config', async (event, systemConfig) => {
    const sys = db.getCollection('systemConfig');
    sys.update(systemConfig)
});



// ==================================================

const os = require("os");
const si = require('systeminformation');
// Optionally cache results after the first fetch
let cachedSystemInfo = null;

const getSystemInfo = async () => {
    if (cachedSystemInfo) {
        return cachedSystemInfo; // Return cached result if already fetched
    }
    // Fetch essential data in parallel
    const [bios, sys] = await Promise.all([
        si.bios(),
        si.system()
    ]);

    // Combine all results into a single object
    const systemInfo = {
        biosSerial: bios.serial,
        systemUUID: sys.uuid,
    };
    // Cache the result for future use
    cachedSystemInfo = systemInfo;
    return systemInfo;
};

ipcMain.handle('get-system-info', async () => {
    return getSystemInfo();
});


const getSystemInfo2 = async () => {
    // Basic system info using the `os` module
    const basicInfo = {
        username: os.userInfo().username, // Current user's name
        hostname: os.hostname(), // Hostname of the machine
        platform: os.platform(), // Operating system platform (e.g., 'win32', 'linux', 'darwin')
        architecture: os.arch(), // CPU architecture (e.g., 'x64', 'arm')
        totalMemory: os.totalmem(), // Total system memory in bytes
        freeMemory: os.freemem(), // Free system memory in bytes
        cpuCount: os.cpus().length, // Number of CPU cores
        uptime: os.uptime(), // System uptime in seconds
    };

    // Advanced system info using the `systeminformation` library
    const cpuInfo = await si.cpu();
    const osInfo = await si.osInfo();
    const diskInfo = await si.diskLayout();
    const networkInfo = await si.networkInterfaces();
    const graphicsInfo = await si.graphics();

    return {
        ...basicInfo,
        cpu: {
            manufacturer: cpuInfo.manufacturer,
            brand: cpuInfo.brand,
            speed: cpuInfo.speed,
            cores: cpuInfo.cores,
            physicalCores: cpuInfo.physicalCores,
        },
        os: {
            platform: osInfo.platform,
            distro: osInfo.distro,
            release: osInfo.release,
            kernel: osInfo.kernel,
            arch: osInfo.arch,
        },
        disks: diskInfo.map((disk) => ({
            name: disk.name,
            type: disk.type,
            size: disk.size,
            vendor: disk.vendor,
        })),
        network: networkInfo.map((network) => ({
            iface: network.iface,
            ip4: network.ip4,
            mac: network.mac,
        })),
        graphics: graphicsInfo.controllers.map((gpu) => ({
            model: gpu.model,
            vendor: gpu.vendor,
            vram: gpu.vram,
        })),
    };
};


ipcMain.handle('get-system-info-2', async () => {
    return getSystemInfo2();
});




//  ======================== classNames ==========================

ipcMain.handle('get-classNames', async () => {
    const classNames = db.getCollection('classNames');
    return classNames ? classNames.find() : [];
});

ipcMain.handle('get-className-by-id', async (event, id) => {
    const classNames = db.getCollection('classNames');
    return classNames.get(id)
});

ipcMain.handle('get-className-by-name', async (query) => {
    const classNames = db.getCollection('classNames');
    console.log("query :", query);

    // Find users whose combined name and lastname start with the query string
    return classNames.find(className => {
        const fullName = `${className.name} ${className.lastName}`;
        return fullName.toLowerCase().startsWith(query.toLowerCase());
    });
});

ipcMain.handle('add-className', async (event, className) => {
    const classNames = db.getCollection('classNames');
    return classNames.insert(className);

});

ipcMain.handle('update-className', async (event, className) => {
    const classNames = db.getCollection('classNames');
    return classNames.update(className);
});

ipcMain.handle('delete-className', async (event, className) => {
    const classNames = db.getCollection('classNames');
    return classNames.remove(className)
});




// ==================== subjects ========================

ipcMain.handle('add-subject', async (event, subject) => {
    const subjects = db.getCollection('subjects');
    return subjects.insert(subject);
});

ipcMain.handle('update-subject', async (event, subject) => {
    const subjects = db.getCollection('subjects');
    return subjects.update(subject)
});

ipcMain.handle('delete-subject', async (event, subject) => {
    const subjects = db.getCollection('subjects');
    return subjects.remove(subject)
});

ipcMain.handle('get-subjects', async (event) => {
    const subjects = db.getCollection('subjects');
    return subjects.find() || [];
});

ipcMain.handle('get-today-subjects', async (event) => {
    const subjects = db.getCollection('subjects');
    return subjects.find() || [];
});
ipcMain.handle('get-subjects-by-classId', async (event, classId) => {
    const subjects = db.getCollection('subjects');
    const sub = subjects.find();
    return sub.filter(item => {
        return item.className.$loki === classId
    });
});


// ================ times operations =================================


ipcMain.handle('get-times', async () => {
    const times = db.getCollection('times');
    return times ? times.find() : [];
});

ipcMain.handle('get-time-by-id', async (event, id) => {
    const times = db.getCollection('times');
    return times.get(id)
});

ipcMain.handle('get-time-by-name', async (query) => {
    const times = db.getCollection('times');
    console.log("query :", query);

    // Find users whose combined name and lastname start with the query string
    return times.find(time => {
        const fullName = `${time.name} ${time.lastName}`;
        return fullName.toLowerCase().startsWith(query.toLowerCase());
    });
});

ipcMain.handle('add-time', async (event, time) => {
    const times = db.getCollection('times');
    return times.insert(time);
});

ipcMain.handle('update-time', async (event, time) => {
    const times = db.getCollection('times');
    return times.update(time)
});

ipcMain.handle('delete-time', async (event, time) => {
    const times = db.getCollection('times');
    return times.remove(time)
});




// ================ schedules operations =================================


ipcMain.handle('get-schedules', async () => {
    const schedules = db.getCollection('schedules');
    return schedules ? schedules.find() : [];
});

ipcMain.handle('get-schedule-by-id', async (event, id) => {
    const schedules = db.getCollection('schedules');
    return schedules.get(id)
});

ipcMain.handle('get-schedule-by-name', async (query) => {
    const schedules = db.getCollection('schedules');
    console.log("query :", query);

    // Find users whose combined name and lastname start with the query string
    return schedules.find(schedule => {
        const fullName = `${schedule.name} ${schedule.lastName}`;
        return fullName.toLowerCase().startsWith(query.toLowerCase());
    });
});

ipcMain.handle('add-schedule', async (event, schedule) => {
    const schedules = db.getCollection('schedules');
    return schedules.insert(schedule);
});

ipcMain.handle('update-schedule', async (event, schedule) => {
    const schedules = db.getCollection('schedules');
    return schedules.update(schedule)
});

ipcMain.handle('delete-schedule', async (event, schedule) => {
    const schedules = db.getCollection('schedules');
    return schedules.remove(schedule)
});



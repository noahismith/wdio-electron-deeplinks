const { join } = require('path');

exports.config = {
    runner: 'local',
    specs: [
        join(__dirname, 'specs', '*.e2e.js')
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'electron',
        'wdio:electronServiceOptions': {
            appBinaryPath: join(__dirname, '..', 'dist', 'win-unpacked', 'WDIO Deeplink Test.exe'),
            appArgs: []
        }
    }],
    logLevel: 'info',
    waitforTimeout: 10000,
    services: ['electron'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};

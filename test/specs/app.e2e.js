const { spawn } = require('child_process');

describe('Minimal Deeplink Test', () => {
    it('should load the app', async () => {
        const title = await browser.getTitle();
        expect(title).toBe('WDIO Electron Deeplink Test');
    });

    it('should handle deeplink via child process - demonstrates the issue', async () => {
        // Wait a moment for app to be ready
        await browser.pause(1000);
        
        // Get initial log state
        const logElement = await $('#deeplinkLog');
        const initialLogText = await logElement.getText();
        console.log('Initial log:', initialLogText);
        
        // Trigger deeplink via child process (simulates external deeplink activation)
        const deeplinkUrl = 'myapp://test';
        
        // On Windows, use 'start' command to trigger the deeplink
        const child = spawn('cmd', ['/c', 'start', deeplinkUrl], {
            detached: true,
            stdio: 'ignore'
        });
        
        child.unref();
        
        // Wait for the deeplink to be processed
        await browser.pause(2000);
        
        // Check if the deeplink was received by the app under test
        const updatedLogText = await $('#deeplinkLog').getText();
        console.log('Updated log:', updatedLogText);
        
        // This test demonstrates the issue: the deeplink opens a new app instance
        // instead of being handled by the app under test
        if (updatedLogText === initialLogText) {
            console.log('❌ ISSUE DEMONSTRATED: Deeplink opened new app instance instead of current one');
            throw new Error('Deeplink was not received by the app under test - opened new instance instead');
        } else {
            console.log('✅ Deeplink was handled correctly by the app under test');
        }
    });
});

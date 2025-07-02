const { ipcRenderer } = require('electron');

// Listen for deeplinks from the main process
ipcRenderer.on('deeplink-received', (event, url) => {
    console.log('Deeplink received in renderer:', url);
    
    const logElement = document.getElementById('deeplinkLog');
    const timestamp = new Date().toLocaleTimeString();
    logElement.innerHTML = `${timestamp}: ${url}`;
});

// Handle test link clicks
document.getElementById('testLink').addEventListener('click', (e) => {
    e.preventDefault();
    const url = e.target.getAttribute('href');
    console.log('Test link clicked:', url);
    
    // Simulate deeplink for testing
    const logElement = document.getElementById('deeplinkLog');
    const timestamp = new Date().toLocaleTimeString();
    logElement.innerHTML = `${timestamp}: ${url} (simulated)`;
});

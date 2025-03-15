'use strict'

chrome.action.onClicked.addListener(() => {
    // Aktuelle Fensterkoordinaten abrufen
    chrome.windows.getCurrent({}, (currentWindow) => {
      const sidebarWidth = 300; // Breite der Sidebar
      const menuBarOffset = 50; // Abstand von oben
      
      // Berechne die Position und Größe
      const left = currentWindow.left + currentWindow.width - sidebarWidth;
      const top = currentWindow.top + menuBarOffset;
      const height = currentWindow.height - menuBarOffset;
      
      // Neues Popup-Fenster mit dem Vokabelbuch öffnen
      chrome.windows.create({
        url: '../../index.html',
        type: 'popup',
        width: sidebarWidth,
        height: height,
        left: left,
        top: top,
        focused: true
      });
    });
  });
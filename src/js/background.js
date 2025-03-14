'use strict'

chrome.action.onClicked.addListener(() => {
    // Hole die aktuellen Fensterkoordinaten
    chrome.windows.getCurrent({}, (currentWindow) => {
      const sidebarWidth = 300; // Breite der Sidebar
      const menuBarOffset = 50; // Abstand von oben (anpassen, falls nötig)
      
      // Berechne die Position und Größe
      const left = currentWindow.left + currentWindow.width - sidebarWidth;
      const top = currentWindow.top + menuBarOffset;
      const height = currentWindow.height - menuBarOffset;
      
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
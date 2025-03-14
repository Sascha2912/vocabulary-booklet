'use strict';

// === DOM-Elemente abrufen ===
const vocabularyInput = document.getElementById("vocabulary-input");
const btnSaveVocabulary = document.getElementById("btn-save-vocabulary");
const btnDeleteVocabulary = document.getElementById("btn-delete-vocabulary");
const vocabTable = document.getElementById("vocab-table-body");

// === Funktionen implementieren ===

// Fügt eine neue Zeile zur Vokabletabelle hinzu
const addVocabRow = function(translated, original) {
    let tableRow = `
        <tr>
            <td>${original}</td>
            <td>${translated}</td>
        </tr>
    `;
    return tableRow;
};

// Lädt alle gespeicherten Vokabelpaare aus dem localStorage
const loadVocabulary = function() {
    vocabTable.innerHTML = "";
    let tableDOM = "";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        tableDOM += addVocabRow(key, value);
    }
    vocabTable.innerHTML = tableDOM;
};

const getInputWord = function(){
    let inputWord = vocabularyInput.value.trim();
    inputWord = inputWord.split(' ')[0];
    if (!inputWord) {
        alert("Please enter a word!");
        return null;
    }
    return inputWord;
};

const getTargetLang = function(){
// Ziel-Sprache ermitteln (. B. "en" aus "en-US")
    return navigator.language.split('-')[0];
};

const getSourceLang = function(){
    return 'en';
};

const requestAPI = function(inputWord, targetLang) {
    const sourceLang = getSourceLang();
    // MyMemory-API-Endpunkt mit Parametern
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputWord)}&langpair=${sourceLang}|${targetLang}`;


    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.responseStatus === 200) {
        const translatedText = data.responseData.translatedText;
        
        // Sonderfälle bereinigen (MyMemory fügt manchmal "MYMEMORY WARNING:..." hinzu)
        const cleanText = translatedText.replace(/MYMEMORY WARNING:.*/, "").trim();
        
        // Speichern im localStorage
        localStorage.setItem(cleanText, inputWord);
        
        // Tabelle aktualisieren
        vocabTable.innerHTML += addVocabRow(cleanText, inputWord);
        vocabularyInput.value = ""; // Input leeren
      } else {
        console.error("MyMemory Error:", data.responseDetails);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

const saveVocabulary = function() {
    const inputWord = getInputWord();
    const targetLang = getTargetLang();
    requestAPI(inputWord, targetLang);
};

const deleteVocabulary = function(){
    localStorage.clear();
    vocabTable.innerHTML = "";
}

// === Allgemeine Logik implementieren ===
loadVocabulary();

// === Event-Listener binden ===
btnSaveVocabulary.addEventListener('click', saveVocabulary);
btnDeleteVocabulary.addEventListener('dblclick', deleteVocabulary);
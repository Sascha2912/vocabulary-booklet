'use strict';

// === DOM-Elemente abrufen ===
const vocabularyInput = document.getElementById("vocabulary-input");
const btnSaveVocabulary = document.getElementById("btn-save-vocabulary");
const btnDeleteVocabulary = document.getElementById("btn-delete-vocabulary");
const vocabTableBody = document.getElementById("vocab-table-body");

// === Globale Variable für Vokabelpaare ===
// Alle Vokabelpaare werden als Array von Objekten gespeichert, z. B. {original: 'word', translation: 'Wort'}
let vocabList = [];

// === Funktionen ===

/**
 * 
 * @param {string} originalWord - Das eingegebene Wort.
 * @param {string} translatedWord - Die Übersetzung des Wortes.
 * @returns {string}  -HTML-String für die Tabellenzeile.
 */
const createVocabRow = function(originalWord, translatedWord) {
      return `
        <tr>
            <td>${originalWord}</td>
            <td>${translatedWord}</td>
        </tr>
    `;
};

/**
 * Rendert die Vokabeltabelle anhand des vocabList Arrays.
 */
const renderVocabulary = function() {
    let tableContent = "";
    vocabList.forEach(pair => {
        tableContent += createVocabRow(pair.originalWord, pair.translatedWord)
    });
    vocabTableBody.innerHTML = tableContent;
};

/**
 * 
 * Lädt die Vokabelpaare aus dem localStorage.
 * Wenn keine Daten voranden sind, wird ein leeres Array verwendet.
 */
const loadVocabulary = function() {
    const storedVocab = localStorage.getItem("vocabList");
    if(storedVocab) {
        vocabList = JSON.parse(storedVocab);
    }
    renderVocabulary();
};

/**
 * Speichert das aktuelle vocabList Array im localStorage.
 */
const saveVocabularyToStorage = function() {
    localStorage.setItem("vocabList", JSON.stringify(vocabList));
};

/**
 * Liest das eingegebene Wort, validiert es und gibt es zurück.
 * 
 * @returns {string|null} - Das bereinigte Wort oder null, wenn keine Eingabe erfolgte.
 */
const getInputWord = function(){
    const inputWord = vocabularyInput.value.trim().split(' ')[0];
    if (!inputWord) {
        alert("Please enter a word!");
        return null;
    }
    return inputWord;
};


/**
 * Ermittelt die Ziel-Sprache anhand der Browsersprache.
 * 
 * @returns {string} - Der Sprachcode (z. B. "de").
 */
const getTargetLang = function(){
    return navigator.language.split('-')[0];
};


/**
 * Gibt den Quellprachcode zurück.
 * 
 * @returns {string} - Der Quellsprachcode (z. B. "en").
 */
const getSourceLang = function(){
    return 'en';
};


/**
 * Führt die API-Anfrage zur Übersetzung des eingegebenen Wortes durch.
 * @param {string} inputWord  - Das Wort, das übersetzt werden soll.
 * @param {string} targetLang - Die Zielsprache.
 */
const fetchTranslation  = function(inputWord, targetLang) {
    const sourceLang = getSourceLang();
    // MyMemory-API-Endpunkt mit Parametern
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputWord)}&langpair=${sourceLang}|${targetLang}`;


    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.responseStatus === 200) {
        const translatedText = data.responseData.translatedText;
        
        // Entferne mögliche Warnhinweise aus der Übersetzung
        const cleanTranslation = translatedText.replace(/MYMEMORY WARNING:.*/, "").trim();
        
        // Füge das neue Vokabelpaar der Liste hinzu
        vocabList.push({originalWord: inputWord, translatedWord: cleanTranslation});
        saveVocabularyToStorage();
        renderVocabulary();
        
        // Eingabefeld zurücksetzen
        vocabularyInput.value = ""; // Input leeren
      } else {
        console.error("MyMemory Error:", data.responseDetails);
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

/**
 * Event-Handler zum Speichern eines neuen Vokabelpaares.
 */
const saveVocabularyHandler = function() {
    const inputWord = getInputWord();
    if(!inputWord) return;

    const targetLang = getTargetLang();
    fetchTranslation (inputWord, targetLang);
};

/**
 * Event-Handler zum Loschen aller gespeicherten Vokabelpaare.
 */
const deleteVocabularyHandler = function(){
    vocabList = [];
    saveVocabularyToStorage();
    renderVocabulary();
}

// === Initial Logik ===
loadVocabulary();

// === Event-Listener binden ===
btnSaveVocabulary.addEventListener('click', saveVocabularyHandler);
btnDeleteVocabulary.addEventListener('dblclick', deleteVocabularyHandler);
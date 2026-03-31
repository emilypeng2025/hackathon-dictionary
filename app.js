"use strict";

// DOM Elements
const input = document.getElementById("wordInput");
const button = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const modeSelect = document.getElementById("modeSelect");

// Render result
function renderResult(word, phonetic, partOfSpeech, definition, example) {
  resultDiv.innerHTML = `
    <h2>${word}</h2>
    <p><strong>Phonetic:</strong> ${phonetic || "Not available"}</p>
    <p><strong>Part of Speech:</strong> ${partOfSpeech || "Not available"}</p>
    <p><strong>Definition:</strong> ${definition || "Not available"}</p>
    <p><strong>Example:</strong> ${example || "No example available"}</p>
    <button id="addFlashcard">Add to Flashcards</button>
  `;
}

// Render error
function renderError(message) {
  resultDiv.innerHTML = `<p>${message}</p>`;
}

// Fetch word from API
async function searchWord() {
  const word = input.value.trim();
  const mode = modeSelect.value;

  if (!word) {
    renderError("Please enter a word.");
    return;
  }

  if (mode !== "en") {
    renderError("Hebrew mode will be added later. Please use English mode for now.");
    return;
  }

  resultDiv.innerHTML = "<p>Searching...</p>";

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!response.ok) {
      throw new Error("Word not found.");
    }

    const data = await response.json();

    console.log(data);

    const entry = data[0];
    const foundWord = entry.word || word;

    const phonetic =
      entry.phonetic ||
      (entry.phonetics && entry.phonetics.find(p => p.text)?.text) ||
      "Not available";

    const firstMeaning = entry.meanings && entry.meanings[0];
    const partOfSpeech = firstMeaning?.partOfSpeech || "Not available";

    const firstDefinition = firstMeaning?.definitions && firstMeaning.definitions[0];
    const definition = firstDefinition?.definition || "Not available";
    const example = firstDefinition?.example || "No example available";

    renderResult(foundWord, phonetic, partOfSpeech, definition, example);
  } catch (error) {
    console.error(error);
    renderError("Sorry, could not find that word.");
  }
}

// Button click
button.addEventListener("click", searchWord);

// Optional: press Enter to search
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchWord();
  }
});

console.log(data);

//notes: 
//testing result: not so ideal. 
//"python": a type of snake; "English", should given another meaning to choose from: Definition: Spinning or rotary motion given to a ball around the vertical axis, as in billiards or bowling. // Example: You can't hit it directly, but maybe if you give it some english.
//doesn't save the result in search history yet. 
"use strict";

// DOM Elements
const input = document.getElementById("wordInput");
const button = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const modeSelect = document.getElementById("modeSelect");

const historyTab = document.getElementById("historyTab");
const flashcardsTab = document.getElementById("flashcardsTab");

const historySection = document.getElementById("historySection");
const flashcardsSection = document.getElementById("flashcardsSection");

const historyList = document.getElementById("historyList");
const flashcardsDiv = document.getElementById("flashcards");

const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const clearFlashcardsBtn = document.getElementById("clearFlashcardsBtn");

// LocalStorage keys
const HISTORY_KEY = "searchHistory";
const FLASHCARDS_KEY = "flashcards";

// ---------- Error ----------
function renderError(message) {
  resultDiv.innerHTML = `<p>${message}</p>`;
}

// ---------- LocalStorage Helpers ----------
function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing history:", error);
    return [];
  }
}

function saveHistory(word) {
  let history = getHistory();

  // remove duplicate first
  history = history.filter(item => item.toLowerCase() !== word.toLowerCase());

  // newest first
  history.unshift(word);

  // optional: keep only latest 10
  history = history.slice(0, 10);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>No search history yet.</li>";
    return;
  }

  history.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    li.style.cursor = "pointer";

    li.addEventListener("click", function () {
      input.value = word;
      searchWord();
    });

    historyList.appendChild(li);
  });
}

function getFlashcards() {
  try {
    const data = localStorage.getItem(FLASHCARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing flashcards:", error);
    localStorage.removeItem(FLASHCARDS_KEY);
    return [];
  }
}
// 	•	tries to parse JSON safely
	// •	if JSON is broken → catches error
	// •	prevents app from crashing
	// •	returns empty array instead

function saveFlashcard(card) {
  let flashcards = getFlashcards();

  const exists = flashcards.some(item =>
    item.word === card.word &&
    item.definition === card.definition &&
    item.partOfSpeech === card.partOfSpeech
  );

  if (!exists) {
    flashcards.push(card);
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
  }
}

function deleteFlashcard(index) {
  const flashcards = getFlashcards();
  flashcards.splice(index, 1);
  localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
  renderFlashcards();
}

function renderFlashcards() {
  const flashcards = getFlashcards();
  flashcardsDiv.innerHTML = "";

  if (flashcards.length === 0) {
    flashcardsDiv.innerHTML = "<p>No flashcards yet.</p>";
    return;
  }

  flashcards.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "flashcard";

    cardDiv.innerHTML = `
      <h3>${card.word}</h3>
      <p><strong>Phonetic:</strong> ${card.phonetic || "Not available"}</p>
      <p><strong>Part of Speech:</strong> ${card.partOfSpeech || "Not available"}</p>
      <p><strong>Definition:</strong> ${card.definition || "Not available"}</p>
      <p><strong>Example:</strong> ${card.example || "No example available"}</p>
      <button class="deleteFlashcardBtn" data-index="${index}">Delete</button>
    `;

    flashcardsDiv.appendChild(cardDiv);
  });

  const deleteButtons = document.querySelectorAll(".deleteFlashcardBtn");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const index = Number(this.getAttribute("data-index"));
      deleteFlashcard(index);
    });
  });
}

// ---------- Render Options ----------
function renderOptions(formattedData) {
  resultDiv.innerHTML = `
    <h2>${formattedData.word}</h2>
    <p><strong>Phonetic:</strong> ${formattedData.phonetic || "Not available"}</p>
    <h3>Select a meaning:</h3>
    <div id="optionsContainer"></div>
  `;

  const optionsContainer = document.getElementById("optionsContainer");

  formattedData.meanings.forEach((item, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.innerHTML = `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
        <p><strong>Option ${index + 1}</strong></p>
        <p><strong>Part of Speech:</strong> ${item.partOfSpeech || "Not available"}</p>
        <p><strong>Definition:</strong> ${item.definition || "Not available"}</p>
        <p><strong>Example:</strong> ${item.example || "No example available"}</p>
        <button class="selectBtn" data-index="${index}">Select This Meaning</button>
      </div>
    `;
    optionsContainer.appendChild(optionDiv);
  });

  const selectButtons = document.querySelectorAll(".selectBtn");

  selectButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number(this.getAttribute("data-index"));
      const selectedMeaning = formattedData.meanings[index];

      const selectedCard = {
        word: formattedData.word,
        phonetic: formattedData.phonetic,
        partOfSpeech: selectedMeaning.partOfSpeech,
        definition: selectedMeaning.definition,
        example: selectedMeaning.example
      };

      console.log("Selected card:", selectedCard);

      resultDiv.innerHTML = `
        <h2>${selectedCard.word}</h2>
        <p><strong>Phonetic:</strong> ${selectedCard.phonetic || "Not available"}</p>
        <p><strong>Part of Speech:</strong> ${selectedCard.partOfSpeech || "Not available"}</p>
        <p><strong>Definition:</strong> ${selectedCard.definition || "Not available"}</p>
        <p><strong>Example:</strong> ${selectedCard.example || "No example available"}</p>
        <button id="addFlashcard">Add to Flashcards</button>
      `;

      const addFlashcardBtn = document.getElementById("addFlashcard");
      addFlashcardBtn.addEventListener("click", function () {
        saveFlashcard(selectedCard);
        renderFlashcards();
        alert("Flashcard saved!");
      });
    });
  });
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function clearFlashcards() {
  localStorage.removeItem(FLASHCARDS_KEY);
  renderFlashcards();
}

// ---------- Search ----------
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
    console.log("API data:", data);

    const entry = data[0];
    const foundWord = entry.word || word;

    const phonetic =
      entry.phonetic ||
      (entry.phonetics && entry.phonetics.find((p) => p.text)?.text) ||
      "Not available";

    const meanings = [];

    for (let i = 0; i < entry.meanings.length; i++) {
      const meaning = entry.meanings[i];

      if (!meaning.definitions) continue;

      for (let j = 0; j < meaning.definitions.length; j++) {
        if (meanings.length >= 3) break;

        const def = meaning.definitions[j];

        meanings.push({
          partOfSpeech: meaning.partOfSpeech || "Not available",
          definition: def.definition || "Not available",
          example: def.example || "No example available"
        });
      }

      if (meanings.length >= 3) break;
    }

    // •	loops through meanings
    // •	loops through ALL definitions inside each meaning
    // •	collects up to 3 total options
    // •	properly stops when reaching 3

    const formattedData = {
      word: foundWord,
      phonetic: phonetic,
      meanings: meanings
    };

    console.log("Formatted data:", formattedData);

    saveHistory(foundWord);
    renderHistory();

    renderOptions(formattedData);
  } catch (error) {
    console.error(error);
    renderError("Sorry, could not find that word.");
  }
}

// ---------- Events ----------
button.addEventListener("click", searchWord);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchWord();
  }
});

clearHistoryBtn.addEventListener("click", function () {
  const confirmClear = confirm("Clear all search history?");
  if (confirmClear) {
    clearHistory();
  }
});

clearFlashcardsBtn.addEventListener("click", function () {
  const confirmClear = confirm("Clear all flashcards?");
  if (confirmClear) {
    clearFlashcards();
  }
});

// ---------- Tabs ----------
historyTab.addEventListener("click", () => {
  historySection.style.display = "block";
  flashcardsSection.style.display = "none";

  historyTab.classList.add("active");
  flashcardsTab.classList.remove("active");
});

flashcardsTab.addEventListener("click", () => {
  historySection.style.display = "none";
  flashcardsSection.style.display = "block";

  flashcardsTab.classList.add("active");
  historyTab.classList.remove("active");
});

// ---------- Initial Page Load ----------
renderHistory();
renderFlashcards();

/*
Day 3 completed:
- save search history in LocalStorage
- render search history on page load
- click history item to search again
- clear search history
- save flashcards in LocalStorage
- render flashcards on page load
- avoid duplicate flashcards
- delete flashcards
- clear all flashcards
- keep Day 2 multiple-choice flow (user selects meaning before saving)
*/
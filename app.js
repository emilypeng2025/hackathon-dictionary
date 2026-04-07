"use strict";
function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
      throw new Error(`Element with id "${id}" was not found.`);
  }
  return element;
}

const input = getRequiredElement("wordInput");
const button = getRequiredElement("searchBtn");
const resultDiv = getRequiredElement("result");
const modeSelect = getRequiredElement("modeSelect");
const historyTab = getRequiredElement("historyTab");
const flashcardsTab = getRequiredElement("flashcardsTab");
const historySection = getRequiredElement("historySection");
const flashcardsSection = getRequiredElement("flashcardsSection");
const historyList = getRequiredElement("historyList");
const flashcardsList = getRequiredElement("flashcardsList");
const clearHistoryBtn = getRequiredElement("clearHistoryBtn");
const clearFlashcardsBtn = getRequiredElement("clearFlashcardsBtn");

const fakeDictionary = {
  שלום: {
      word: "שלום",
      phonetic: "/sha-lom/",
      partOfSpeech: "noun / greeting",
      definition: "Peace; hello; goodbye.",
      example: "הוא אמר שלום לחבר שלו.",
      tag: "general"
  },
  תודה: {
      word: "תודה",
      phonetic: "/to-da/",
      partOfSpeech: "expression",
      definition: "Thank you.",
      example: "תודה רבה על העזרה.",
      tag: "general"
  },
  אהבה: {
      word: "אהבה",
      phonetic: "/a-ha-va/",
      partOfSpeech: "noun",
      definition: "Love.",
      example: "אהבה היא דבר חשוב.",
      tag: "emotion"
  },
  בית: {
      word: "בית",
      phonetic: "/ba-yit/",
      partOfSpeech: "noun",
      definition: "House; home.",
      example: "אני הולך לבית שלי.",
      tag: "general"
  },
  מים: {
      word: "מים",
      phonetic: "/ma-yim/",
      partOfSpeech: "noun",
      definition: "Water.",
      example: "אני שותה מים.",
      tag: "general"
  }
};

// LocalStorage keys
const HISTORY_KEY = "searchHistory";
const FLASHCARDS_KEY = "flashcards";

// ---------- Error ----------
function renderError(message) {
  resultDiv.innerHTML = `<p class="empty-state">${message}</p>`;
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

function saveHistory(word, language) {
  let history = getHistory();

  history = history.filter(item => {
    const itemWord = typeof item === "string" ? item : item.word;
    return itemWord.toLowerCase() !== word.toLowerCase();
  });

  history.unshift({ word, language });
  history = history.slice(0, 10);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}


function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `<li class="empty-state">No search history yet.</li>`;
    return;
  }

  history.forEach(item => {
    const word = typeof item === "string" ? item : item.word;
    const language = typeof item === "string" ? "en" : item.language;

    const li = document.createElement("li");
    li.className = "history-item";

    li.innerHTML = `
      <span>${word}</span>
      <span class="history-language">
        ${language === "en" ? "English" : "Hebrew"}
      </span>
    `;

    li.addEventListener("click", function () {
      input.value = word;
      modeSelect.value = language;
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
    item.word.toLowerCase() === card.word.toLowerCase() &&
    item.definition.toLowerCase() === card.definition.toLowerCase() &&
    item.partOfSpeech.toLowerCase() === card.partOfSpeech.toLowerCase() &&
    item.language === card.language
  );

  if (exists) {
    alert("This flashcard already exists.");
    return false;
  }

  flashcards.push(card);
  localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
  return true;
}

function deleteFlashcard(index) {
  const flashcards = getFlashcards();
  flashcards.splice(index, 1);
  localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
  renderFlashcards();
}
// 它做了三件事：
	// •	先拿现有 flashcards
	// •	删除指定 index
	// •	存回 localStorage
	// •	再刷新画面

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function clearFlashcards() {
  localStorage.removeItem(FLASHCARDS_KEY);
  renderFlashcards();
}

// 以上属于“存储层”
// 以下从 renderFlashcards() 开始，进入“渲染层”


function renderFlashcards() {
  const flashcards = getFlashcards();
  flashcardsList.innerHTML = "";

  if (flashcards.length === 0) {
    flashcardsList.innerHTML = `<li class="empty-state">No flashcards yet.</li>`;
    return;
  }

  flashcards.forEach((card, index) => {
    const li = document.createElement("li");
    li.className = "flashcard-item";

    li.innerHTML = `
      <div class="flashcard-top">
        <h3>${card.word}</h3>
        <button class="delete-btn" data-index="${index}">✕</button>
      </div>

      ${card.phonetic ? `<p class="phonetic">Phonetic: ${card.phonetic}</p>` : ""}
      <p><strong>Part of Speech:</strong> ${card.partOfSpeech || "Not available"}</p>
      <p><strong>Definition:</strong> ${card.definition || "Not available"}</p>
      <p><strong>Example:</strong> ${card.example || "No example available"}</p>

      ${card.tag ? `<p><strong>Tag:</strong> <span class="tag-badge">${card.tag}</span></p>` : ""}
      ${card.language ? `<span class="flashcard-language">${card.language === "en" ? "English" : "Hebrew"}</span>` : ""}
    `;

    flashcardsList.appendChild(li);
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      const index = Number(this.getAttribute("data-index"));
      deleteFlashcard(index);
    });
  });
}
// 	•	用你的 getFlashcards() 读取 localStorage
	// •	用新的 flashcardsList
	// •	用他的新 UI class
	// •	兼容 tag 和 language
	// •	delete button 也和新 CSS 一致

// ---------- Render Options ----------

function renderOptions(options, language) {
  if (options.length === 0) {
    resultDiv.innerHTML = `<p class="empty-state">No results found.</p>`;
    return;
  }

  resultDiv.innerHTML = options
    .map((option, index) => {
      return `
        <div class="option-card">
          <p class="option-label">Option ${index + 1}</p>
          <h2>${option.word}</h2>
          ${option.phonetic ? `<p class="phonetic">Phonetic: ${option.phonetic}</p>` : ""}
          <p><strong>Part of Speech:</strong> ${option.partOfSpeech || "Not available"}</p>
          <p><strong>Definition:</strong> ${option.definition || "Not available"}</p>
          <p><strong>Example:</strong> ${option.example || "No example available"}</p>
          ${option.tag ? `<p><strong>Tag:</strong> <span class="tag-badge">${option.tag}</span></p>` : ""}
          <p class="result-language">
            Language: ${language === "en" ? "English" : "Hebrew"}
          </p>
          <button class="select-option-btn" data-index="${index}">
            Select This Option
          </button>
        </div>
      `;
    })
    .join("");

  const selectButtons = document.querySelectorAll(".select-option-btn");

  selectButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number(this.getAttribute("data-index"));
      const selectedOption = options[index];
      renderSelectedResult(selectedOption, language, options);
    });
  });
}

function renderSelectedResult(data, language, allOptions) {
  resultDiv.innerHTML = `
    <div class="result-card">
      <h2>${data.word}</h2>
      ${data.phonetic ? `<p class="phonetic">Phonetic: ${data.phonetic}</p>` : ""}
      <p><strong>Part of Speech:</strong> ${data.partOfSpeech || "Not available"}</p>
      <p><strong>Definition:</strong> ${data.definition || "Not available"}</p>
      <p><strong>Example:</strong> ${data.example || "No example available"}</p>
      ${data.tag ? `<p><strong>Tag:</strong> <span class="tag-badge">${data.tag}</span></p>` : ""}
      <p class="result-language">
        Language: ${language === "en" ? "English" : "Hebrew"}
      </p>

      <div class="result-actions">
        <button id="addFlashcard" class="action-btn">Add to Flashcards</button>
        <button id="backToOptions" class="secondary-btn">Back to Options</button>
      </div>
    </div>
  `;

  const addFlashcardBtn = document.getElementById("addFlashcard");
  const backToOptionsBtn = document.getElementById("backToOptions");

  if (addFlashcardBtn) {
    addFlashcardBtn.addEventListener("click", function () {
      const flashcardToSave = {
        ...data,
        language
      };

      const wasSaved = saveFlashcard(flashcardToSave);

      if (wasSaved) {
        renderFlashcards();
        alert("Flashcard saved!");
      }
    });
  }

  if (backToOptionsBtn) {
    backToOptionsBtn.addEventListener("click", function () {
      renderOptions(allOptions, language);
    });
  }
}
// 新增的函数renderSelectedResult作用是：
// •	点击某个 option 后
// •	显示最终选中的那张 card
// •	可以 Add to Flashcards
// •	可以 Back to Options



// ---------- Search ----------
function getTagFromPartOfSpeech(partOfSpeech) {
  const pos = partOfSpeech.toLowerCase();

  if (pos.includes("noun")) return "general";
  if (pos.includes("verb")) return "action";
  if (pos.includes("adjective")) return "description";
  if (pos.includes("adverb")) return "grammar";
  if (pos.includes("interjection")) return "expression";

  return "general";
}

function renderNotFound(word) {
  resultDiv.innerHTML = `
    <p class="empty-state">
      No result found for "${word}".
    </p>
  `;
}

async function searchWord() {
const word = input.value.trim();
const language = modeSelect.value;

if (!word) {
  renderError("Please enter a word.");
  return;
}

resultDiv.innerHTML = `<p class="empty-state">Loading...</p>`;

try {
  let options = [];

  if (language === "en") {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    if (!response.ok) {
      renderNotFound(word);
      saveHistory(word, language);
      renderHistory();
      return;
    }

    const data = await response.json();
    const entry = data[0];

    if (!entry || !entry.meanings) {
      renderNotFound(word);
      saveHistory(word, language);
      renderHistory();
      return;
    }

    const foundWord = entry.word || word;

    const phonetic =
      entry.phonetic ||
      (entry.phonetics && entry.phonetics.find((p) => p.text)?.text) ||
      "";

    for (let i = 0; i < entry.meanings.length; i++) {
      const meaning = entry.meanings[i];

      if (!meaning.definitions) continue;

      for (let j = 0; j < meaning.definitions.length; j++) {
        if (options.length >= 3) break;

        const def = meaning.definitions[j];

        options.push({
          word: foundWord,
          phonetic: phonetic,
          partOfSpeech: meaning.partOfSpeech || "Not available",
          definition: def.definition || "Not available",
          example: def.example || "No example available",
          tag: getTagFromPartOfSpeech(meaning.partOfSpeech || "")
        });
      }

      if (options.length >= 3) break;
    }
  } else {
    const normalizedWord = word.toLowerCase();
    const foundWord = fakeDictionary[word] || fakeDictionary[normalizedWord];

    if (foundWord) {
      options = [
        foundWord,
        {
          ...foundWord,
          definition: `${foundWord.definition} (common use)`,
          tag: "general"
        },
        {
          ...foundWord,
          definition: `${foundWord.definition} (formal use)`,
          tag: "formal"
        }
      ];
    }
  }

  if (options.length === 0) {
    renderNotFound(word);
    saveHistory(word, language);
    renderHistory();
    return;
  }

  saveHistory(word, language);
  renderHistory();
  renderOptions(options, language);

} catch (error) {
  console.error("Search error:", error);
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

historyTab.addEventListener("click", function () {
  historySection.style.display = "block";
  flashcardsSection.style.display = "none";

  historyTab.classList.add("active");
  flashcardsTab.classList.remove("active");
});

flashcardsTab.addEventListener("click", function () {
  historySection.style.display = "none";
  flashcardsSection.style.display = "block";

  flashcardsTab.classList.add("active");
  historyTab.classList.remove("active");
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

// ---------- Initial Page Load ----------
renderHistory();
renderFlashcards();



// 现在这份已经包含：
	// •	更安全的 DOM 获取
	// •	English + Hebrew mode
	// •	localStorage for history
	// •	localStorage for flashcards
	// •	新 UI render
	// •	option selection
	// •	add to flashcards
	// •	delete flashcards
	// •	clear history / flashcards
	// •	tab switching
	// •	page load restore


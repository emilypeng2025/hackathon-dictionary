"use strict";
//先不用 API，只做结构 + 假数据
// DOM Elements
const input = document.getElementById("wordInput");
const button = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
// Fake data (Day 1)
const fakeData = {
    word: "hello",
    definition: "A greeting",
    partOfSpeech: "interjection",
};
// Render function
function renderResult(word, definition, pos) {
    resultDiv.innerHTML = `
    <h2>${word}</h2>
    <p><strong>${pos}</strong></p>
    <p>${definition}</p>
    <button id="addFlashcard">Add to Flashcards</button>
  `;
}
// Button click
button.addEventListener("click", () => {
    const value = input.value.trim();
    if (!value) {
        resultDiv.innerHTML = "Please enter a word.";
        return;
    }
    // For now, use fake data
    renderResult(fakeData.word, fakeData.definition, fakeData.partOfSpeech);
});

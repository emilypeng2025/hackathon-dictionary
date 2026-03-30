//先不用 API，只做结构 + 假数据

// Get DOM elements from the page
const input = document.getElementById("wordInput") as HTMLInputElement;
const button = document.getElementById("searchBtn") as HTMLButtonElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;

// Fake data (Day 1) 这是为了 Day 1 先不接 API，也能测试显示功能
// Mock data for Day 1 testing
const fakeData = {
  word: "hello",
  definition: "A greeting",
  partOfSpeech: "interjection",
};

// Render result into the result area
function renderResult(word: string, definition: string, pos: string): void {
  resultDiv.innerHTML = `
    <h2>${word}</h2>
    <p><strong>${pos}</strong></p>
    <p>${definition}</p>
    <button id="addFlashcard">Add to Flashcards</button>
  `;
}

// Add click event to the search button
button.addEventListener("click", () => {
  //Get the trimmed input value
  const value = input.value.trim();

  // If input is empty, show warning message
  if (!value) {
    resultDiv.innerHTML = "Please enter a word.";
    return;
  }

  // Just for now, use fake data
  renderResult(fakeData.word, fakeData.definition, fakeData.partOfSpeech);
});
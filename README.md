# Dictionary App — English & Hebrew

## Overview
This project is a bilingual dictionary web app built with **HTML**, **CSS**, and **TypeScript**. It allows users to search for words in **English** and **Hebrew**, view structured definitions and translations, save selected results as flashcards, and review recent search history.

The app integrates a real API for English results and uses mock data for Hebrew, while maintaining a consistent internal data structure across both languages.

## Features

- Search for words using a simple and intuitive search bar
- Switch between **English** and **Hebrew** modes
- Fetch real-time data from the Free Dictionary API (English mode)
- Use a local mock dictionary for Hebrew translations
- Display up to **three result options** per search
- Select a preferred definition or translation
- Save selected results as **Flashcards**
- Automatically store and display **Search History**
- Toggle between **Search History** and **Flashcards** tabs
- Delete individual flashcards or clear all saved data
- Responsive and polished UI with hover effects, rounded cards, and dark mode support

## How it works

1. The user enters a word in the search bar and selects a language mode (**English** or **Hebrew**).
2. In **English mode**, the app sends a request to the Free Dictionary API and retrieves structured data.
3. In **Hebrew mode**, the app looks up the word in a local mock dictionary.
4. The app normalizes both data sources into a consistent internal format.
5. Up to three result options are displayed to the user.
6. The user selects a preferred definition or translation.
7. The selected result can be saved as a flashcard using local storage.
8. Search history is automatically stored and displayed.
9. The user can switch between **History** and **Flashcards** tabs, delete items, or clear all data.

## Project Structure

```text
hackathon-dictionary/
│
├── index.html       # Main UI structure
├── style.css        # Styling and layout
├── app.ts / app.js  # Core logic
├── README.md        # Project documentation
├── tsconfig.json    # TypeScript configuration


This project follows a clear separation of concerns:
- Data layer (LocalStorage management)
- Rendering layer (UI updates and DOM manipulation)
- Control layer (event handling and search logic)
```

### index.html
The HTML file defines the structure of the application, including:
- page title and subtitle
- search input and language selector
- search button
- result display container
- tab navigation (History / Flashcards)
- search history section
- flashcards section

### style.css
The CSS file handles the visual design of the app, including:
- layout and spacing
- button styles
- tab active and hover states
- rounded containers and cards
- flashcard and result card styling
- modern UI effects (hover glow, transitions)
- dark mode support

### app.ts
The TypeScript file contains the core application logic, including:
- fetching data from the API
- transforming API data into a unified format
- rendering translation/definition options
- handling user selection
- managing flashcards (add/delete)
- managing search history
- handling tab switching
- handling user input and interactions

### tsconfig.json
This file configures TypeScript compilation settings and ensures compatibility with browser-based DOM APIs.


## Data Model

To ensure consistency across different data sources (API and mock data), all dictionary results are normalized into a unified object structure:

```ts
type DictionaryEntry = {
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  tag: string;
  language?: "en" | "he";
};
```

## Technologies Used

- **HTML5** – structure of the application
- **CSS3** – styling, layout, and responsive design
- **TypeScript** – application logic and type safety
- **Free Dictionary API** – external data source for English definitions
- **DOM Manipulation** – dynamic rendering and user interaction


## Status

- **Day 1:** Built the UI structure and basic layout using HTML and CSS.  
  Created the search input, language selector, result container, and tab sections (History / Flashcards).

- **Day 2:** Implemented API integration for English mode.  
  Fetched data from the Free Dictionary API and extracted structured results (word, phonetic, meanings, examples).

- **Day 3:** Added LocalStorage functionality.  
  Implemented search history and flashcards storage, including:
  - saving and retrieving data from LocalStorage
  - preventing duplicate entries
  - limiting history length
  - restoring data on page load

- **Day 4:** Implemented interactive features and data flow.  
  - Enabled selecting one definition from multiple options  
  - Added “Add to Flashcards” functionality  
  - Enabled deleting flashcards  
  - Implemented clear history / clear flashcards actions  
  - Added click-to-search from history  

- **Day 5:** Improved UI/UX and component structure.  
  - Redesigned result display using card-based layout  
  - Added option selection UI (multiple result cards)  
  - Implemented tab switching (History / Flashcards)  
  - Added responsive layout and dark mode support  
  - Introduced tag system and language labels  

- **Day 6:** Refactored and unified data structure.  
  - Normalized API and mock data into a consistent object format  
  - Separated logic into layers: storage, rendering, and control  
  - Improved error handling and empty states  
  - Added Hebrew mode with local mock dictionary  
  - Cleaned up code structure for maintainability and scalability


## Future Improvements

- Add better error handling and user feedback
- Improve input validation (empty input, invalid characters)
- Support multiple data sources (e.g., technical glossary)
- Display source information for each definition
- Enhance data structure for scalability and feature expansion
- Implement advanced flashcard features (e.g., sorting, frequency tracking)




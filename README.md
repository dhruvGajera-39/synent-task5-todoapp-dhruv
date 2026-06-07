# TaskFlow // A Modern To-Do Experience

TaskFlow is a premium, responsive, and modern task management web application. It features a stunning dark-mode glassmorphic user interface, smooth micro-animations, a real-time progress tracker, and persistent storage.

---

## 🌟 Key Features

*   **Add Tasks**: Quick task entry via input field.
*   **Mark as Completed**: Easily toggle tasks between active and completed statuses.
*   **Delete Tasks**: Remove items with elegant slide-out animations.
*   **Task Stats & Progress Tracker**: An active percentage progress bar that adapts as you manage tasks.
*   **State Filtering**: Seamlessly filter views between **All**, **Active**, and **Completed** tasks.
*   **Persistence**: Tasks are automatically saved to `localStorage` and persist across page refreshes.
*   **Glassmorphic Aesthetic**: Premium dark theme with vibrant background ambient glows, subtle gradients, and modern typography.

---

## 🛠️ Technology Stack

*   **HTML5**: Semantic markup structuring the app interface.
*   **CSS3 (Vanilla)**: Standard CSS styling utilizing custom properties/variables, flexbox layouts, media queries for responsiveness, and keyframe transitions.
*   **JavaScript (Vanilla)**: Core logic managing state, event handling, DOM manipulation, and persistence.

---

## 📂 File Structure

```text
task 5/
├── index.html     # Semantic HTML layout and background blur anchors
├── style.css      # Custom design tokens, glassmorphism CSS, and animations
├── script.js     # State management, LocalStorage integration, and DOM rendering
└── README.md      # Documentation of the project (this file)
```

---

## 🚀 How to Run Locally

Since TaskFlow is a static web application, you can run it directly on any web browser:

### Option 1: Direct File Access
1. Clone or download this directory.
2. Locate the `index.html` file.
3. Double-click `index.html` to open it in your default web browser.

### Option 2: Local Development Server (Recommended)
Running the application using a local server ensures consistent resource loading and resolves potential browser-specific pathing queries.

1. Open your terminal/command prompt in the project directory.
2. Run one of the following commands to spin up a quick local web server:
   * **Using Node (npx):**
     ```bash
     npx http-server -p 8080
     ```
   * **Using Python:**
     ```bash
     python -m http.server 8080
     ```
3. Open your browser and navigate to `http://localhost:8080`.

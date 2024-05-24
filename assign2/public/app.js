import Card from "./card.js";
import Mover from "./mover.js";

export default class App {
  constructor() {
    this._mover = new Mover();  // STEP 3

    const addCardForm = document.getElementById("addCard");
    const cardTitle = document.getElementById("cardTitle");
    const cardColor = document.getElementById("cardColor");

    const submitCardInfo = (event) => {
      this._mover.stopMoving();  // STEP 3: Handles case (2) of canceling a move
      event.preventDefault();  // prevent default reloading window
      this.addCard("todo", cardTitle.value, cardColor.value);
      cardTitle.value = "";
      cardColor.value = "#9caf88";
    }

    addCardForm.addEventListener("submit", submitCardInfo);
    cardTitle.addEventListener("submit", submitCardInfo);
    // cardColor.addEventListener("keypress", enterPressed);

    // Project 3 Step 3 (Light/Dark Mode Button)
    // Determine current color mode (stored user preferences > window settings).
    function getColorMode() {
      let mode = localStorage.getItem("color-mode");
      if (mode !== null){
        return mode;
      }
      
      let systemSettingLight = window.matchMedia("(prefers-color-scheme: light)");
      if (systemSettingLight.matches){
        return "light";
      }
      return "dark";
    }

    function updateCMButton(button, isLight) {
      const button_icon = button.querySelector("img");
      if (isLight){
        button_icon.setAttribute("src", "icons/moon-regular.svg");
        button_icon.setAttribute("alt", "Change to dark mode.");
      }
      else{
        button_icon.setAttribute("src", "icons/sun-regular.svg");
        button_icon.setAttribute("alt", "Change to light mode.");
      }
    }

    function updateHTMLmode(html, mode) {
      html.setAttribute("data-color-mode", mode);
    }

    const html = document.querySelector("html");
    const colorModeButton = document.getElementById("colorModeButton");

    // Initialize: Set webpage to the color mode based on stored user preferences or system settings.
    let colorMode = getColorMode();
    updateHTMLmode(html, colorMode);
    updateCMButton(colorModeButton, colorMode === "light");
    localStorage.setItem("color-mode", colorMode);
    
    // Update html element's color mode and button, and store user preferences locally.
    const toggleColorMode = () => {
      let currentColorMode = getColorMode();
      // console.log("current mode: " + currentColorMode);
      // console.log("current alt: " + colorModeButton.querySelector("img").getAttribute("alt"));
      if (currentColorMode === "light"){
        updateHTMLmode(html, "dark");
        updateCMButton(colorModeButton, false);
        localStorage.setItem("color-mode", "dark");
      }
      else{
        updateHTMLmode(html, "light");
        updateCMButton(colorModeButton, true);
        localStorage.setItem("color-mode", "light");
      }
      currentColorMode = html.getAttribute("data-color-mode");
      // console.log("switched to: " + currentColorMode);
      // console.log("new alt: " + colorModeButton.querySelector("img").getAttribute("alt"));
      // console.log("");
    }
    
    colorModeButton.addEventListener("click", toggleColorMode);
  }

  addCard(col, title, color) {
    let colElem = document.getElementById(col);  // col = string id of column card is added to (i.e. 'todo', 'doing', 'done')
    let newCard = new Card(title, color);
    newCard.addToCol(colElem, this._mover);  // STEP 3
    return newCard;
  }

}

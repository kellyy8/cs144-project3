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
  
      // Project 3: Step 5 (Add card information to Local Storage).
      // Get data from local storage.
      let columns = JSON.parse(window.localStorage.getItem("columns"));
      let todoList = columns.todo;

      // Add card to DOM and set its index.
      let card = this.addCard("todo", cardTitle.value, cardColor.value);
      card.setIndex(todoList.length);

      // Add card data to local storage.
      todoList.push({title: cardTitle.value, description: "", color: cardColor.value});  // TODO: set description to constant or ""?
      window.localStorage.setItem("columns", JSON.stringify(columns));

      // Reset input form values.
      cardTitle.value = "";
      cardColor.value = "#9caf88";
    }

    addCardForm.addEventListener("submit", submitCardInfo);
    cardTitle.addEventListener("submit", submitCardInfo);
    // cardColor.addEventListener("keypress", enterPressed);

    // Project 3: Step 3 (Implement button to handle light and dark modes.)
    // Determine current color mode (stored user preferences > window settings).
    function getColorMode() {
      const mode = window.localStorage.getItem("colorMode");
      if (mode !== null){
        return mode;
      }
      
      const systemSettingLight = window.matchMedia("(prefers-color-scheme: light)");
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
        button_icon.setAttribute("src", "icons/sun.svg");
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
    window.localStorage.colorMode = colorMode;  // Initialize colorMode key to colorMode value.
    
    // Update html element's color mode and button, and store user preferences locally.
    const toggleColorMode = () => {
      let currentColorMode = getColorMode();
      // console.log("current mode: " + currentColorMode);
      // console.log("current alt: " + colorModeButton.querySelector("img").getAttribute("alt"));
      if (currentColorMode === "light"){
        updateHTMLmode(html, "dark");
        updateCMButton(colorModeButton, false);
        window.localStorage.setItem("colorMode", "dark");
      }
      else{
        updateHTMLmode(html, "light");
        updateCMButton(colorModeButton, true);
        window.localStorage.setItem("colorMode", "light");
      }
      // currentColorMode = html.getAttribute("data-color-mode");
      // console.log("switched to: " + currentColorMode);
      // console.log("new alt: " + colorModeButton.querySelector("img").getAttribute("alt"));
      // console.log("");
    }
    colorModeButton.addEventListener("click", toggleColorMode);

    const initLocalStorage = ()=> {
      const columns = { todo: [], doing: [], done: [] };
      window.localStorage.columns = JSON.stringify(columns);
    }

    const getFromLocalStorage = (columns) => {
      columns = JSON.parse(columns);
      const todoList = columns.todo;
      const doingList = columns.doing;
      const doneList = columns.done;
      
      todoList.forEach((cardInfo, index) => {
        let card = this.addCard("todo", cardInfo.title, cardInfo.color);
        card.setDescription(cardInfo.description);
        card.setIndex(index);
      })

      doingList.forEach((cardInfo, index) => {
        let card = this.addCard("doing", cardInfo.title, cardInfo.color);
        card.setDescription(cardInfo.description);
        card.setIndex(index);
      })

      doneList.forEach((cardInfo, index) => {
        let card = this.addCard("done", cardInfo.title, cardInfo.color);
        card.setDescription(cardInfo.description);
        card.setIndex(index);
      })
    }

    function loadCards(){
      const columns = window.localStorage.getItem("columns");
      if (columns === null){
        initLocalStorage();
      }
      else{
        getFromLocalStorage(columns);
      }
    }

    loadCards();
  }

  addCard(col, title, color) {
    let colElem = document.getElementById(col);  // col = string id of column card is added to (i.e. 'todo', 'doing', 'done')
    let newCard = new Card(title, color);
    newCard.addToCol(colElem, this._mover);  // STEP 3
    return newCard;
  }

}

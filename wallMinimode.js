import Wall from "./wall.js";

class WallMinimode {
  constructor() {
    this.wall = null;
    this.display = null;
  }

  createWall() {
    // Create a new instance of the Wall class
    this.wall = new Wall();
  }

  createDisplay() {
    // Create a display for filling in the properties of the wall
    this.display = document.createElement("div");
    this.display.innerHTML = `
      <label for="startPoint">Start Point:</label>
      <input type="text" id="startPoint" /><br>
      <label for="endPoint">End Point:</label>
      <input type="text" id="endPoint" /><br>
      <label for="height">Height:</label>
      <input type="text" id="height" /><br>
      <label for="color">Color:</label>
      <input type="text" id="color" /><br>
      <label for="texture">Texture:</label>
      <input type="text" id="texture" /><br>
      <label for="damage">Damage:</label>
      <input type="text" id="damage" /><br>
      <label for="permeation">Permeation:</label>
      <input type="text" id="permeation" /><br>
      <button id="saveButton">Save</button>
    `;

    // Add event listener to the save button
    const saveButton = this.display.querySelector("#saveButton");
    saveButton.addEventListener("click", this.saveWall);
  }

  saveWall = () => {
    // Get the values from the display inputs
    const startPoint = this.display.querySelector("#startPoint").value;
    const endPoint = this.display.querySelector("#endPoint").value;
    const height = this.display.querySelector("#height").value;
    const color = this.display.querySelector("#color").value;
    const texture = this.display.querySelector("#texture").value;
    const damage = this.display.querySelector("#damage").value;
    const permeation = this.display.querySelector("#permeation").value;

    // Set the values to the wall object
    this.wall.startPoint = startPoint;
    this.wall.endPoint = endPoint;
    this.wall.height = height;
    this.wall.color = color;
    this.wall.texture = texture;
    this.wall.damage = damage;
    this.wall.permeation = permeation;

    // Perform any additional logic or actions with the wall object
    // ...

    // Clear the display
    this.clearDisplay();
  };

  clearDisplay() {
    // Clear the display inputs
    this.display.querySelector("#startPoint").value = "";
    this.display.querySelector("#endPoint").value = "";
    this.display.querySelector("#height").value = "";
    this.display.querySelector("#color").value = "";
    this.display.querySelector("#texture").value = "";
    this.display.querySelector("#damage").value = "";
    this.display.querySelector("#permeation").value = "";
  }
}

export default WallMinimode;
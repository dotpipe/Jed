class Segment {
  constructor(name) {
    this.name = name;
    this.walls = [];
    this.ceiling = null;
    this.floor = null;
    this.segmentRenderer = new SegmentRenderer();
  }

  addWall(wall) {
    this.walls.push(wall);
  }

  setCeiling(ceiling) {
    this.ceiling = ceiling;
  }

  setFloor(floor) {
    this.floor = floor;
  }

  setEntrance(entrance) {
    this.entrance = entrance;
  }
  draw(scene) {
    if (!this.loaded) {
      return; // Check if the segment is loaded before drawing the walls
    }

    this.walls.forEach(wall => {
      wall.draw(scene); // Draw the walls of the segment using the draw() method of the Wall class
    });
  }

  saveToFile() {
    const data = JSON.stringify(this.toJSON());
    // Send the data to a PHP file for saving
    // You can use AJAX or any other method to send the data to the PHP file
    // Example using AJAX:
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_segment.php');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
  }
}

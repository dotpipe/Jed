class Segment {
  constructor(name) {
    this.name = name;
    this.walls = [];
    this.ceiling = null;
    this.floor = null;
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

  toJSON() {
    return {
      name: this.name,
      walls: this.walls.map(wall => wall.toJSON()),
      ceiling: this.ceiling ? this.ceiling.toJSON() : null,
      floor: this.floor ? this.floor.toJSON() : null,
    };
  }

  async loadSegmentDataFromFile(filename) {
    try {
      const response = await fetch(filename);
      if (!response.ok) {
        throw new Error(`Failed to load segment data from ${filename}`);
      }
      const data = await response.text();
      return data;
    } catch (error) {
      console.error(error);
      // Handle the error appropriately
    }
  }
  
  static fromJSON(filename) {
    // Load the segment data from the file
    const data = loadSegmentDataFromFile(filename);

    // Parse the JSON data
    const json = JSON.parse(data);

    // Create a new segment instance
    const segment = new Segment(json.name);

    // Create walls from the JSON data and add them to the segment
    segment.walls = json.walls.map(wallJson => Wall.fromJSON(wallJson));

    // Create ceiling and floor objects from the JSON data and set them in the segment
    segment.ceiling = json.ceiling ? Ceiling.fromJSON(json.ceiling) : null;
    segment.floor = json.floor ? Floor.fromJSON(json.floor) : null;

    return segment;
  }

  draw(scene) {
    // Create a group to hold all the walls
    const wallsGroup = new THREE.Group();

    // Draw the walls
    this.walls.forEach(wall => {
      wallsGroup.add(wall.mesh);
    });

    // Draw the ceiling
    if (this.ceiling) {
      wallsGroup.add(this.ceiling.mesh);
    }

    // Draw the floor
    if (this.floor) {
      wallsGroup.add(this.floor.mesh);
    }

    // Add the walls group to the scene
    scene.add(wallsGroup);
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
class SegmentEditor {
    constructor() {
      this.segments = [];
      this.doors = [];
      this.activeWallIndex = -1;
      this.activeGroupIndices = [];
    }
  
    createSegment(name) {
      const segment = new Segment(name);
      this.segments.push(segment);
      return segment;
    }
  
    createWall(segment, texture, width, height) {
    const wall = new Wall(texture, width, height);
    segment.addWall(wall);
    return wall;
  }

  activateWall(index) {
    this.activeWallIndex = index;
  }

  deactivateWall() {
    this.activeWallIndex = -1;
  }

  groupWalls(indices) {
    this.activeGroupIndices = indices;
  }

  deselect() {
    this.activeWallIndex = -1;
  }

  copyWall(index) {
    const wall = this.segments[0].walls[index];
    const copiedWall = Wall.fromJSON(wall.toJSON());
    this.segments[0].addWall(copiedWall);
  }

  handleMovement(key) {
    const activeWall = this.segments[0].walls[this.activeWallIndex];
    const movementSpeed = 1; // Adjust the movement speed as needed
  
    switch (key) {
      case "ArrowUp":
        activeWall.move(0, -movementSpeed);
        break;
      case "ArrowDown":
        activeWall.move(0, movementSpeed);
        break;
      case "ArrowLeft":
        activeWall.move(-movementSpeed, 0);
        break;
      case "ArrowRight":
        activeWall.move(movementSpeed, 0);
        break;
      default:
        break;
    }
  }
  
  handleRotation(key) {
    const activeWall = this.segments[0].walls[this.activeWallIndex];
    const rotationSpeed = 1; // Adjust the rotation speed as needed
  
    switch (key) {
      case "W":
        activeWall.rotate(rotationSpeed);
        break;
      case "S":
        activeWall.rotate(-rotationSpeed);
        break;
      default:
        break;
    }
  }

  handleCopy(key) {
    // Implement logic to handle copying based on user input
  }

  handleDeselect(key) {
    if (key === "Escape") {
      this.deselect();
    }
  }
  
  attachWall(segment, angle) {
    // Implement logic to attach a wall at the specified angle
    // based on the segment's north direction
  }

  attachStairs(segment, angle) {
    // Implement logic to attach stairs at the specified angle
    // based on the segment's north direction
  }

  attachSlide(segment, angle) {
    // Implement logic to attach a slide at the specified angle
    // based on the segment's north direction
  }

  attachFloatingPlatform(segment, angle) {
    // Implement logic to attach a floating platform at the specified angle
    // based on the segment's north direction
  }
}

// Usage
const segmentEditor = new SegmentEditor();

const segment1 = segmentEditor.createSegment("Room 1");
const wall1 = segmentEditor.createWall(segment1, "texture1", 255, 255);
const wall2 = segmentEditor.createWall(segment1, "texture2", 255, 255);

segmentEditor.activateWall(0); // Activate wall1
segmentEditor.groupWalls([0, 1]); // Group wall1 and wall2

segmentEditor.handleMovement("ArrowUp"); // Handle movement based on user class movements
segmentEditor.handleRotation("W"); // Handle rotation based on user class movements
segmentEditor.handleCopy("C"); // Handle copying based on user input
segmentEditor.handleDeselect("Escape"); // Handle deselecting based on user input

console.log(segment1);
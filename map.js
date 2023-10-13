class Map extends MapEditor {
    constructor(canvasId, userViewPosition) {
        super();
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.userViewPosition = userViewPosition;
        this.disappearingPoint = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
        };
    }

    addFloorObject(height, width, depth, begin, end, yIndex, walls) {
      const floorObject = {
        height: Math.max(0, Math.min(height, 255)),
        width: Math.max(0, Math.min(width, 255)),
        depth: Math.max(0, Math.min(depth, 255)),
        begin: Math.max(0, Math.min(begin, 255)),
        end: Math.max(0, Math.min(end, 255)),
        yIndex: Math.max(-64, Math.min(yIndex, 64)),
        walls: walls.map((wall) => new Wall(wall.startPoint, wall.endPoint, wall.height, wall.color)),
      };
  
      this.mapData.push(floorObject);
    }
  
    drawMap() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      this.mapData.forEach((floorObject) => {
        const { height, width, depth, begin, end, yIndex, walls } = floorObject;
  
        const y = this.calculateYPosition(yIndex);
  
        if (this.isFloorObjectInView(y)) {
          this.drawWalls(walls);
          this.drawFloorAndCeiling(y, height, width, depth, begin, end);
        }
      });
    }
  
    calculateYPosition(yIndex) {
      return this.canvas.height / 2 + (yIndex * this.canvas.height) / 2;
    }
  
    isFloorObjectInView(y) {
      // Check if the floor object is within the user view
      // ...
  
      return true; // Replace with your logic
    }
  
    drawWalls(walls) {
      walls.forEach((wall) => {
        wall.draw(this.ctx, this.disappearingPoint, this.userViewPosition);
      });
    }
  
    drawFloorAndCeiling(y, height, width, depth, begin, end) {
// Draw the floor and ceiling based on the provided dimensions
    // ...

    // Example code to draw the floor and ceiling
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(0, y, this.canvas.width, height);

    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, y - depth, this.canvas.width, depth);

    // Example code to draw the disappearing effect
    const gradient = this.ctx.createLinearGradient(0, y - depth, 0, y);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${begin / 255})`);
    gradient.addColorStop(1, `rgba(0, 0, 0, ${end / 255})`);

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, y - depth, this.canvas.width, depth);
  }
}
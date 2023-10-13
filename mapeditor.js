class MapEditor {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.mapData = {
      rectangles: [],
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
  }

  addFloorObject(shape, opacity, texture, position, size, yIndex, walls) {
    const floorObject = {
      shape,
      opacity,
      texture,
      position,
      size,
      yIndex,
      walls,
    };

    this.mapData.push(floorObject);
  }

  handleCanvasClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Prompt the user for rectangle properties
    const width = parseInt(prompt('Enter the width of the rectangle:'));
    const height = parseInt(prompt('Enter the height of the rectangle:'));
    const texture = prompt('Enter the texture of the rectangle:');

    // Add the rectangle to the map data
    this.mapData.rectangles.push({ x, y, width, height, texture });

    // Redraw the map
    this.drawMap();
  }
}

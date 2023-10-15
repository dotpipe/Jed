class Wall {
    constructor(startPoint, endPoint, height, color) {
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.height = height;
      this.color = color;
    }
  
    draw(ctx) {
      const gradient = ctx.createLinearGradient(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, this.color);
  
      ctx.beginPath();
      ctx.moveTo(this.startPoint.x, this.startPoint.y);
      ctx.lineTo(this.endPoint.x, this.endPoint.y);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  class Map {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.layers = [];
    }
  
    addLayer(floorColor, borderColor) {
      this.layers.push({ floorColor, borderColor, walls: [] });
    }
  
    addWall(layerIndex, startPoint, endPoint, height, color) {
      const wall = new Wall(startPoint, endPoint, height, color);
      this.layers[layerIndex].walls.push(wall);
    }
  
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      for (const layer of this.layers) {
        this.ctx.fillStyle = layer.floorColor;
        this.ctx.strokeStyle = layer.borderColor;
        this.ctx.lineWidth = 2;
  
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  
        for (const wall of layer.walls) {
          wall.draw(this.ctx);
        }
      }
    }
  }
  
  // Create a new map instance
  const map = new Map('canvas');
  
  // Add layers to the map
  map.addLayer('green', 'black');
  
  // Add walls to the layers
  map.addWall(0, { x: 100, y: 100 }, { x: 300, y: 100 }, 50, 'blue');
  map.addWall(0, { x: 100, y: 200 }, { x: 300, y: 200 }, 50, 'red');
  map.addWall(0, { x: 200, y: 100 }, { x: 200, y: 200 }, 50, 'yellow');
  
  // Draw the map
  map.draw();
class Map {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.layers = [];
  }

  addLayer(color) {
    this.layers.push({
      color,
      walls: [],
    });
  }

  addWall(layerIndex, startPoint, endPoint, height, color) {
    const wall = new Wall(startPoint, endPoint, height, color);
    this.layers[layerIndex].walls.push(wall);
  }

  draw(user) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const layer of this.layers) {
      this.ctx.fillStyle = layer.color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      for (const wall of layer.walls) {
        wall.draw(this.ctx, { x: this.canvas.width / 2, y: this.canvas.height / 2, z: 0 }, user);
      }
    }

    user.draw(this.ctx);
  }
}
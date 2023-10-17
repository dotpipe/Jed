// Canvas class
class Canvas {
  constructor(mapData) {
    this.mapData = mapData;
  }

  render(objects) {
    this.clearCanvas();
    this.drawMap();
    this.drawObjects(objects);
  }

  clearCanvas() {
    // Code to clear the canvas
  }

  drawMap() {
    const map = new Map(this.mapData);
    map.drawRectangle();
  }

  drawObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      const { x, y, z, width, height, texture } = obj;

      // Code to draw object on canvas
    }
  }
}

export {
  Canvas
};

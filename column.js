import Wall from "./wall.js";

class Column {
    constructor(height, radius, material = 0x00ff00) {
      // this.position = { x: positionX, y: positionY };
      // this.width = width;
      this.height = height;
      this.columns = [];
      this.radius = radius;
    }

    addColumn() {
      this.geometry = new THREE.CylinderGeometry(this.radius, this.radius, 0.45, 32);
      const column = new THREE.Mesh(geometry, material);
      this.walls.push(column);
      return this.columns;
    }
}
  
export default Column;
class Entrance {
    constructor(positionX, positionY, width, height) {
      this.position = { x: positionX, y: positionY };
      this.width = width;
      this.height = height;
    }
  
    toJSON() {
      return {
        position: this.position,
        width: this.width,
        height: this.height,
      };
    }
  
    static fromJSON(json) {
      return new Entrance(json.position.x, json.position.y, json.width, json.height);
    }
  }
  
export default Entrance;
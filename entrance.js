class Entrance {
  constructor(height = 1, width = 1, agentFits = true, options = []) {
    this.height = height;
    this.width = width;
    this.agentFits = agentFits;
    this.options = options;
    this.position = { x: 0, y: 0, z: 0 }; // Updated position property
  }

  toJSON() {
    return {
      position: this.position,
      width: this.width,
      height: this.height,
    };
  }

  static fromJSON(json) {
    return new Entrance(json.position.x, json.position.y, json.position.z, json.width, json.height); // Updated fromJSON method
  }

  setPosition(x, y, z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

export default Entrance;
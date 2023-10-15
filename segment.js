class Segment {
    constructor(name) {
      this.name = name;
      this.walls = [];
      this.doors = [];
      this.north = null;
    }
  
    addWall(wall) {
      this.walls.push(wall);
    }
  
    addDoor(door) {
      this.doors.push(door);
    }
  
    setNorth(north) {
      this.north = north;
    }
  
    toJSON() {
      return {
        name: this.name,
        walls: this.walls.map(wall => wall.toJSON()),
        doors: this.doors,
        north: this.north,
      };
    }
  
    static fromJSON(json) {
      const segment = new Segment(json.name);
      segment.walls = json.walls.map(wallJson => Wall.fromJSON(wallJson));
      segment.doors = json.doors;
      segment.north = json.north;
      return segment;
    }
  }
class Wall {
  constructor(startPoint, endPoint, height, color) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.height = height;
    this.color = color;
  }

  draw(ctx, disappearingPoint, userViewPosition) {
    const { x: userX, y: userY } = userViewPosition;
    const { x: startX, y: startY } = this.startPoint;
    const { x: endX, y: endY } = this.endPoint;

    const distanceStart = Math.sqrt((startX - userX) ** 2 + (startY - userY) ** 2);
    const distanceEnd = Math.sqrt((endX - userX) ** 2 + (endY - userY) ** 2);

    const viewHeight = this.height * (1 - Math.min(distanceStart, distanceEnd) / 20);

    const segmentStart = {
      x: startX + (userX - startX) * (viewHeight / this.height),
      y: startY + (userY - startY) * (viewHeight / this.height),
    };

    const segmentEnd = {
      x: endX + (userX - endX) * (viewHeight / this.height),
      y: endY + (userY - endY) * (viewHeight / this.height),
    };

    ctx.beginPath();
    ctx.moveTo(segmentStart.x, segmentStart.y);
    ctx.lineTo(segmentEnd.x, segmentEnd.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class MapEditor {
    constructor() {
        this.mapData = [];
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

    // Other methods for removing and updating floor objects
}

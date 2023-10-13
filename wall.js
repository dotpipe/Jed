class Wall {
    constructor(startPoint, endPoint, height, color) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.height = height;
        this.color = color;
    }

    draw(ctx, disappearingPoint, userViewPosition) {
        const { startPoint, endPoint, height, color } = this;
      
        const relativeStart = {
          x: startPoint.x - userViewPosition.x,
          y: startPoint.y - userViewPosition.y,
          z: startPoint.z - userViewPosition.z,
        };
      
        const relativeEnd = {
          x: endPoint.x - userViewPosition.x,
          y: endPoint.y - userViewPosition.y,
          z: endPoint.z - userViewPosition.z,
        };
      
        const distanceStart = Math.sqrt(
          relativeStart.x ** 2 + relativeStart.y ** 2 + relativeStart.z ** 2
        );
        const distanceEnd = Math.sqrt(
          relativeEnd.x ** 2 + relativeEnd.y ** 2 + relativeEnd.z ** 2
        );
      
        const viewHeight = height * (1 - Math.min(distanceStart, distanceEnd) / 20);
      
        const startView = {
          x: disappearingPoint.x + (relativeStart.x / distanceStart) * viewHeight,
          y: disappearingPoint.y + (relativeStart.y / distanceStart) * viewHeight,
        };
      
        const endView = {
          x: disappearingPoint.x + (relativeEnd.x / distanceEnd) * viewHeight,
          y: disappearingPoint.y + (relativeEnd.y / distanceEnd) * viewHeight,
        };
      
        const distance = Math.sqrt(
          (startView.x - endView.x) ** 2 + (startView.y - endView.y) ** 2
        );
      
        const numSegments = Math.ceil(distance / 20);
        const segmentHeight = height / numSegments;
      
        ctx.beginPath();
        ctx.moveTo(startView.x, startView.y);
      
        for (let i = 1; i <= numSegments; i++) {
          const t = i / numSegments;
          const segmentWidth = width * (1 - t);
      
          const segmentStart = {
            x: startView.x + (endView.x - startView.x) * t,
            y: startView.y + (endView.y - startView.y) * t,
          };
      
          const segmentEnd = {
            x: startView.x + (endView.x - startView.x) * (t - 1 / numSegments),
            y: startView.y + (endView.y - startView.y) * (t - 1 / numSegments),
        };
    
        ctx.lineTo(segmentStart.x, segmentStart.y);
        ctx.lineTo(segmentEnd.x, segmentEnd.y);
      }
    
      ctx.strokeStyle = color;
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

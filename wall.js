class Wall {
  constructor(startPoint, endPoint, height, color) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.height = height;
    this.color = color;
  }

  draw(ctx, disappearingPoint, userViewPosition) {
    const { x: userX, y: userY, z: userZ } = userViewPosition;
    const { x: startX, y: startY, z: startZ } = this.startPoint;
    const { x: endX, y: endY, z: endZ } = this.endPoint;

    const distanceStart = Math.sqrt((startX - userX) ** 2 + (startY - userY) ** 2 + (startZ - userZ) ** 2);
    const distanceEnd = Math.sqrt((endX - userX) ** 2 + (endY - userY) ** 2 + (endZ - userZ) ** 2);

    const viewHeight = this.height * (1 - Math.min(distanceStart, distanceEnd) / 20);

    const segmentStart = {
      x: startX + (userX - startX) * (viewHeight / this.height),
      y: startY + (userY - startY) * (viewHeight / this.height),
      z: startZ + (userZ - startZ) * (viewHeight / this.height),
    };

    const segmentEnd = {
      x: endX + (userX - endX) * (viewHeight / this.height),
      y: endY + (userY - endY) * (viewHeight / this.height),
      z: endZ + (userZ - endZ) * (viewHeight / this.height),
    };

    ctx.fillStyle = this.color;
    ctx.fillRect(segmentStart.x, segmentStart.y, segmentEnd.x - segmentStart.x, segmentEnd.y - segmentStart.y);
  }
}

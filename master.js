class Master {
    constructor() {
      this.segments = [];
      this.currentSegment = null;
    }
  
    addSegment(segment) {
      this.segments.push(segment);
    }
  
    setSegment(segmentName) {
      const segment = this.segments.find((seg) => seg.name === segmentName);
      if (segment) {
        this.currentSegment = segment;
        console.log(`Entering segment: ${segmentName}`);
      } else {
        console.log(`Segment not found: ${segmentName}`);
      }
    }
  
    throwObject(segmentName, buttonPressPosition, disappearingPoint, spritePosition) {
      const segment = this.segments.find((seg) => seg.name === segmentName);
      if (segment) {
        const direction = {
          x: disappearingPoint.x - buttonPressPosition.x,
          y: disappearingPoint.y - buttonPressPosition.y,
        };
  
        let weaponPosition = { ...buttonPressPosition };
        let collided = false;
  
        while (!collided) {
          // Move the weapon
          weaponPosition.x += direction.x;
          weaponPosition.y += direction.y;
  
          // Check for collision with the far wall (disappearing point)
          if (
            (direction.x > 0 && weaponPosition.x >= disappearingPoint.x) ||
            (direction.x < 0 && weaponPosition.x <= disappearingPoint.x) ||
            (direction.y > 0 && weaponPosition.y >= disappearingPoint.y) ||
            (direction.y < 0 && weaponPosition.y <= disappearingPoint.y)
          ) {
            collided = true;
            break;
          }
  
          // Check for collision with the sprite
          if (
            weaponPosition.x === spritePosition.x &&
            weaponPosition.y === spritePosition.y
          ) {
            segment.takeDamage(10); // Replace with actual damage value
            break;
          }
  
          // Check for collision with walls in the segment
          for (const wall of segment) {
            // Implement collision detection logic with walls here
          }
  
          // Simulate bouncing off walls
          // Implement bouncing logic here
        }
      } else {
        console.log(`Segment not found: ${segmentName}`);
      }
    }
  }
 
export {
    Master
  };
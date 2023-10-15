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
  
  // Usage
  const master = new Master();
  
  const segment1 = new Segment("Room 1");
  const segment2 = new Segment("Room 2");
  const segment3 = new Segment("Room 3");
  
  segment1.push(wall1, wall2, wall3); // Add walls to segment1
  segment2.push(wall4, wall5); // Add walls to segment2
  segment3.push(wall6); // Add walls to segment3
  
  master.addSegment(segment1);
  master.addSegment(segment2);
  master.addSegment(segment3);
  
  master.setSegment("Room 1");
  segment1.buffer();
  
  master.setSegment("Room 2");
  segment2.buffer();
  
  master.setSegment("Room 3");
  segment3.buffer();
  
  const buttonPressPosition = { x: 10, y: 10 };
  const disappearingPoint = `Specify the coordinates of the disappearing point here`;
  
  const spritePosition = { x: 50, y: 50 };
  
  master.throwObject("Room 2", buttonPressPosition, disappearingPoint, spritePosition);
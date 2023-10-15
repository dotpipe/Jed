class Protonic {
    constructor(strands, radius, kerning, color, spinAxis, movementType, speed) {
      this.strands = strands;
      this.radius = radius;
      this.kerning = kerning;
      this.color = color;
      this.spinAxis = spinAxis;
      this.movementType = movementType;
      this.speed = speed;
      this.position = 0;
    }
  
    draw(ctx) {
      const highlightColor = 'white';
  
      // Calculate the total width required to draw all strands
      const totalWidth = (this.strands - 1) * this.kerning + this.strands * this.radius * 2;
  
      // Calculate the starting x-coordinate to center the strands horizontally
      const startX = ctx.canvas.width / 2 - totalWidth / 2;
  
      // Update the position based on the movement type and speed
      if (this.movementType === 'coiling') {
        this.position += this.speed;
      } else if (this.movementType === 'zigzagging') {
        this.position += this.speed;
      } else if (this.movementType === 'bouncing') {
        this.position += this.speed;
      } else if (this.movementType === 'arching') {
        this.position += this.speed;
      } else {
        this.position += this.speed;
      }
  
      // Draw each strand with electrical charges
      for (let i = 0; i < this.strands; i++) {
        const x = startX + i * (this.radius * 2 + this.kerning);
        const y = ctx.canvas.height / 2;
  
        // Apply rotation based on the spinAxis
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.spinAxis);
  
        // Apply movement based on the movement type
        if (this.movementType === 'coiling') {
          const coilOffset = Math.sin(this.position / 10) * 20;
          ctx.translate(0, coilOffset);
        } else if (this.movementType === 'zigzagging') {
          const zigzagOffset = Math.sin(this.position / 10) * 10;
          ctx.translate(0, zigzagOffset);
        } else if (this.movementType === 'bouncing') {
          const bounceOffset = Math.abs(Math.sin(this.position / 10) * 50);
          ctx.translate(0, bounceOffset);
        } else if (this.movementType === 'arching') {
            const archOffset = Math.sin(this.position / 10) * 50;
            ctx.translate(0, archOffset);
          } else {
            // No additional movement
          }
    
          // Draw the wire
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
          ctx.fillStyle = this.color;
          ctx.fill();
    
          // Draw the white highlight
          ctx.beginPath();
          ctx.arc(0, -this.radius / 2, this.radius / 2, 0, 2 * Math.PI);
          ctx.fillStyle = highlightColor;
          ctx.fill();
    
          ctx.restore(); // Restore the canvas state
        }
      }
    }
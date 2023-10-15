class User {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.width = 20;
      this.height = 40;
      this.velocityX = 0;
      this.velocityY = 0;
      this.velocityZ = 0;
      this.isJumping = false;
      this.isFalling = false;
    }
  
    moveLeft() {
      this.velocityX = -5;
    }
  
    moveRight() {
      this.velocityX = 5;
    }
  
    jump() {
      if (!this.isJumping && !this.isFalling) {
        this.velocityY = -15;
        this.isJumping = true;
      }
    }
  
    updatePosition() {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.z += this.velocityZ;
  
      // Apply gravity
      if (this.y < canvas.height - this.height) {
        this.velocityY += 1; // Adjust the gravity value as needed
      } else {
        this.velocityY = 0;
        this.y = canvas.height - this.height;
        this.isJumping = false;
        this.isFalling = false;
      }
    }
  
    checkCollision(walls) {
      for (const wall of walls) {
        if (
          this.x < wall.endPoint.x &&
          this.x + this.width > wall.startPoint.x &&
          this.y < wall.endPoint.y &&
          this.y + this.height > wall.startPoint.y &&
          this.z < wall.height
        ) {
          if (this.y + this.height <= wall.startPoint.y) {
            this.isFalling = false;
            this.y = wall.startPoint.y - this.height;
          } else {
            this.isFalling = true;
          }
        }
      }
    }
  
    draw(ctx) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  
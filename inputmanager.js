class InputManager {
    constructor(user) {
      this.keys = {};
      this.movementInterval = null;
      this.user = user;
      this.setupListeners();
    }
  
    setupListeners() {
      document.addEventListener('keydown', (event) => {
        this.keys[event.key] = true;
        this.handleInput();
      });
  
      document.addEventListener('keyup', (event) => {
        this.keys[event.key] = false;
        this.handleInput();
      });
    }
  
    handleInput() {
      clearInterval(this.movementInterval);
  
      // Handle movement
      if (this.keys['ArrowUp'] || this.keys['w']) {
        this.moveForward();
      }
      if (this.keys['ArrowDown'] || this.keys['s']) {
        this.moveBackward();
      }
      if (this.keys['ArrowLeft'] || this.keys['a']) {
        this.moveLeft();
      }
      if (this.keys['ArrowRight'] || this.keys['d']) {
        this.moveRight();
      }
      if (this.keys['Shift']) {
        this.strafe();
      }
      if (this.keys['Control']) {
        this.crawl();
      }
    }
  
    moveForward() {
      // Move player forward continuously
      this.movementInterval = setInterval(() => {
        const newPosition = { ...this.user.position };
        newPosition.z -= 1; // Adjust the forward movement distance as needed
        this.user.setPosition(newPosition);
      }, 500);
    }
  
    moveBackward() {
      // Move player backward continuously
      this.movementInterval = setInterval(() => {
        const newPosition = { ...this.user.position };
        newPosition.z += 1; // Adjust the backward movement distance as needed
        this.user.setPosition(newPosition);
      }, 500);
    }
  
    moveLeft() {
      // Move player left continuously
      this.movementInterval = setInterval(() => {
        const newPosition = { ...this.user.position };
        newPosition.x -= 1; // Adjust the left movement distance as needed
        this.user.setPosition(newPosition);
      }, 500);
    }
  
    moveRight() {
      // Move player right continuously
      this.movementInterval = setInterval(() => {
        const newPosition = { ...this.user.position };
        newPosition.x += 1; // Adjust the right movement distance as needed
        this.user.setPosition(newPosition);
      }, 500);
    }
  
    strafe() {
      // Enable strafing continuously
      this.movementInterval = setInterval(() => {
        const newPosition = { ...this.user.position };
        if (this.keys['ArrowLeft'] || this.keys['a']) {
          newPosition.x -= 1; // Adjust the strafe left distance as needed
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
          newPosition.x += 1; // Adjust the strafe right distance as needed
        }
        this.user.setPosition(newPosition);
      }, 500);
    }
  
    crawl() {
      // Enable crawling continuously
      this.movementInterval = setInterval(() => {
        const newPosition = { ...this.user.position };
        newPosition.y -= 1; // Adjust the crawl distance as needed
        this.user.setPosition(newPosition);
      }, 500);
    }
  }
  
export {
    InputManager
  };
class GL {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.gl = this.canvas.getContext('webgl');
      this.programs = {};
    }
  
    createShader(type, source) {
      const shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
      if (success) {
        return shader;
      }
      console.log(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
    }
  
    createProgram(vertexShaderSource, fragmentShaderSource, programName) {
      const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
      const program = this.gl.createProgram();
      this.gl.attachShader(program, vertexShader);
      this.gl.attachShader(program, fragmentShader);
      this.gl.linkProgram(program);
      const success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
      if (success) {
        this.programs[programName] = program;
      }
      console.log(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
    }
  
    drawCharacter(character, programName) {
      const program = this.programs[programName];
      // Draw the character using the specified program
      // ...
    }
  
    drawWall(wall, programName) {
      const program = this.programs[programName];
      // Draw the wall using the specified program
      // ...
    }
  
    drawProtonic(protonic, programName) {
      const program = this.programs[programName];
      // Draw the protonic using the specified program
      // ...
    }
  
    drawDoor(door, programName) {
      const program = this.programs[programName];
      // Draw the door using the specified program
      // ...
    }
  
    drawColumn(column, programName) {
      const program = this.programs[programName];
      // Draw the column using the specified program
      // ...
    }
  
    drawSegment(segment, programName) {
      const program = this.programs[programName];
      // Draw the segment using the specified program
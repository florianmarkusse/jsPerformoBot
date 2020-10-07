export class TimeOutError extends Error {
    constructor(message) {
      super(message); 
      this.name = "TimeOutError";
    }
  }
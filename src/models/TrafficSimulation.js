export class TrafficSimulation {
  constructor() {
    this.trafficFlow = Array(4).fill(0);
    this.waitingVehicles = Array(4).fill(0);
    this.currentSignal = 0;
    this.timeStep = 0;
  }

  generateTrafficFlow() {
    // Simulate varying traffic patterns
    const baseFlow = [10, 8, 12, 6]; // Vehicles per minute for each direction
    const timeOfDay = (this.timeStep % 60) / 60; // Normalized time of day
    
    this.trafficFlow = baseFlow.map(flow => {
      // Add some randomness and time-based variation
      const variation = Math.sin(2 * Math.PI * timeOfDay) * 5;
      return Math.max(0, flow + variation + (Math.random() * 4 - 2));
    });
  }

  step(action) {
    this.timeStep++;
    this.generateTrafficFlow();
    
    // Update waiting vehicles based on traffic flow
    for (let i = 0; i < 4; i++) {
      if (i === action) {
        // Green light: reduce waiting vehicles
        this.waitingVehicles[i] = Math.max(0, this.waitingVehicles[i] - 15);
      } else {
        // Red light: accumulate waiting vehicles
        this.waitingVehicles[i] += this.trafficFlow[i] / 60;
      }
    }

    const totalWaitingTime = this.waitingVehicles.reduce((a, b) => a + b, 0);
    const reward = -totalWaitingTime; // Negative reward for waiting vehicles

    return {
      state: [...this.trafficFlow, ...this.waitingVehicles],
      reward,
      waitingVehicles: [...this.waitingVehicles],
      currentFlow: [...this.trafficFlow]
    };
  }

  reset() {
    this.trafficFlow = Array(4).fill(0);
    this.waitingVehicles = Array(4).fill(0);
    this.currentSignal = 0;
    this.timeStep = 0;
    this.generateTrafficFlow();
    
    return {
      state: [...this.trafficFlow, ...this.waitingVehicles],
      waitingVehicles: [...this.waitingVehicles],
      currentFlow: [...this.trafficFlow]
    };
  }
}
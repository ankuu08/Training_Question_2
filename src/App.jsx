import React, { useState, useEffect } from 'react';
import { CameraDetection } from './components/CameraDetection';
import { TrafficVisualization } from './components/TrafficVisualization';
import { useObjectDetection } from './hooks/useObjectDetection';
import { TrafficSimulation } from './models/TrafficSimulation';
import { TrafficAgent } from './models/TrafficAgent';

function App() {
  const [predictions, setPredictions] = useState(null);
  const [currentSignal, setCurrentSignal] = useState(0);
  const [waitingTimes, setWaitingTimes] = useState([0, 0, 0, 0]);
  const [trafficFlow, setTrafficFlow] = useState([0, 0, 0, 0]);
  const { detectObjects, loading } = useObjectDetection();

  const simulation = React.useRef(new TrafficSimulation());
  const agent = React.useRef(new TrafficAgent());

  useEffect(() => {
    const updateTraffic = async () => {
      const state = simulation.current.reset();
      setWaitingTimes(state.waitingVehicles);
      setTrafficFlow(state.currentFlow);

      const interval = setInterval(async () => {
        const action = await agent.current.selectAction(state.state);
        const result = simulation.current.step(action);
        
        setCurrentSignal(action);
        setWaitingTimes(result.waitingVehicles);
        setTrafficFlow(result.currentFlow);

        await agent.current.train(
          state.state,
          action,
          result.reward,
          result.state
        );
      }, 1000);

      return () => clearInterval(interval);
    };

    updateTraffic();
  }, []);

  const handleFrame = async (frame) => {
    const results = await detectObjects(frame);
    if (results && results.length > 0) {
      setPredictions(results);
      
      // Update traffic flow based on detected vehicles
      const vehicleCount = results.filter(pred => 
        ['car', 'truck', 'bus', 'motorcycle'].includes(pred.class)
      ).length;
      
      // Update the traffic simulation with real detection data
      const newFlow = [...trafficFlow];
      newFlow[currentSignal] = vehicleCount;
      setTrafficFlow(newFlow);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Smart Traffic Management System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="text-center py-8 col-span-2">
              <p className="text-lg">Loading detection model...</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Vehicle Detection</h2>
                  <CameraDetection onFrame={handleFrame} />
                </div>
                
                {predictions && predictions.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-3">Detected Vehicles</h2>
                    <ul className="space-y-2">
                      {predictions
                        .filter(pred => ['car', 'truck', 'bus', 'motorcycle'].includes(pred.class))
                        .map((pred, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="font-medium">
                              {pred.class} ({Math.round(pred.score * 100)}%)
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <TrafficVisualization
                  waitingTimes={waitingTimes}
                  currentSignal={currentSignal}
                />
                
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h2 className="text-xl font-bold mb-3">Traffic Flow</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {trafficFlow.map((flow, idx) => (
                      <div key={idx} className="p-3 bg-gray-100 rounded">
                        <p className="font-medium">Direction {idx + 1}</p>
                        <p className="text-lg">{Math.round(flow)} vehicles/min</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
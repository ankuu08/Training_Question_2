import * as tf from '@tensorflow/tfjs';

export class TrafficAgent {
  constructor() {
    this.model = this.createModel();
    this.learningRate = 0.001;
    this.discountFactor = 0.95;
    this.epsilon = 1.0;
    this.minEpsilon = 0.01;
    this.epsilonDecay = 0.995;
  }

  createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [8] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 4, activation: 'linear' }));
    
    model.compile({
      optimizer: tf.train.adam(this.learningRate),
      loss: 'meanSquaredError'
    });
    
    return model;
  }

  async predict(state) {
    const stateTensor = tf.tensor2d([state], [1, 8]);
    const prediction = await this.model.predict(stateTensor).array();
    stateTensor.dispose();
    return prediction[0];
  }

  async train(state, action, reward, nextState) {
    const stateTensor = tf.tensor2d([state], [1, 8]);
    const nextStateTensor = tf.tensor2d([nextState], [1, 8]);

    const currentQ = await this.model.predict(stateTensor).array();
    const nextQ = await this.model.predict(nextStateTensor).array();

    const target = [...currentQ[0]];
    target[action] = reward + this.discountFactor * Math.max(...nextQ[0]);

    await this.model.fit(stateTensor, tf.tensor2d([target], [1, 4]), {
      epochs: 1,
      verbose: 0
    });

    stateTensor.dispose();
    nextStateTensor.dispose();

    this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
  }

  selectAction(state) {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * 4);
    }
    return this.predict(state).then(predictions => {
      return predictions.indexOf(Math.max(...predictions));
    });
  }
}
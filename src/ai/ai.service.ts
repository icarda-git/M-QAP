require('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs-node';
import * as use from "@tensorflow-models/universal-sentence-encoder"
import * as path from 'path'
import { Injectable, Logger } from '@nestjs/common';
import * as clarisa from './clarisa.json'
@Injectable()
export class AI {
    private readonly logger = new Logger(AI.name);
    model
    naturalmodel
    traningModel: tf.Sequential
    constructor() {

        this.init()
    }
    async init() {
        this.logger.log("Loading Trained Model")
        this.model = await tf.loadLayersModel('file://' + path.resolve(__dirname, 'wos_trained_model/model.json'));
        this.naturalmodel = await use.load()
        this.logger.log("Trained Model Loaded")
    }
    calculatePercent(percent) {
        return Math.round(percent * 100);
    }
    async makePrediction(value) {
        const todoEmbedding = await this.naturalmodel.embed(value.toLowerCase())
        let results: any = this.model.predict(todoEmbedding)
        return { value: clarisa[results.argMax(1).dataSync()[0]], confidant: Math.max(...results.dataSync().map(d => d)) }
    }

}
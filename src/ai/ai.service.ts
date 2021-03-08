require('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs-node';
import * as use from "@tensorflow-models/universal-sentence-encoder"
import * as path from 'path'
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import * as jsonClarisa from './clarisa.json';
@Injectable()
export class AI {
    private readonly logger = new Logger(AI.name);
    model
    clarisa
    naturalmodel
    traningModel: tf.Sequential
    constructor(private httpService: HttpService) {

        this.init()
    }
    async init() {

        this.logger.log("Start Loading Trained Model")
        this.model = await tf.loadLayersModel('file://' + path.resolve(__dirname, 'wos_trained_model/model.json'));
        this.naturalmodel = await use.load()
        this.clarisa = process.env.PRODUCTION ? await this.httpService.get('https://clarisa.cgiar.org/api/institutions', { auth: { username: 'gldc.data', password: '7823282' } }).pipe(map((d: any) => d.data)).toPromise() : jsonClarisa;
        this.logger.log("Trained Model Loaded")
    }
    calculatePercent(percent) {
        return Math.round(percent * 100);
    }
    async makePrediction(value, doi) {
        const todoEmbedding = await this.naturalmodel.embed(value.toLowerCase())
        let results: any = this.model.predict(todoEmbedding)
        let clarisa_index = this.clarisa[results.argMax(1).dataSync()[0]];
        if (clarisa_index)
            this.httpService.post(process.env.MEL_API + 'prediction/external', {
                "wos_name": value,
                "type": "clarisa",
                "confident": Math.round(Math.max(...results.dataSync().map(d => d)) * 100),
                "doi": doi,
                "clarisa_id": clarisa_index.code
            }, { headers: { "authorization": process.env.MEL_API_KEY } }).pipe(map((d: any) => d.data), catchError(d => d)).toPromise()
        return { value: clarisa_index ? clarisa_index : null, confidant: Math.max(...results.dataSync().map(d => d)) }
    }

}
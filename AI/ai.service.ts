require('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs-node';
import * as use from "@tensorflow-models/universal-sentence-encoder"
import * as path from 'path'
import { Injectable, Logger } from '@nestjs/common';

import * as clarisa from './clarisa.json'
import * as mapped from './tbl_wos_institutions_mapping.json'
import * as mappedMEL from './MEL.json'

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
        this.model = await tf.loadLayersModel('file://' + path.resolve(__dirname, 'wos_trained_model/model.json'));
        this.naturalmodel = await use.load()
    }
    calculatePercent(percent) {
        return Math.round(percent * 100);
    }
    async makePrediction(value) {
        const todoEmbedding = await this.naturalmodel.embed(value.toLowerCase())
        let results: any = this.model.predict(todoEmbedding)
        return { value: results.argMax(1).dataSync()[0], confidant: Math.max(...results.dataSync().map(d => d)) }
    }


    async startTraning() {
        this.logger.log('Traning process started');

        let labels_full = clarisa.map((d: any) => d.name);

        let data = mapped.map((d: any) => d.wos_name)
        let labels = mapped.map((d: any) => labels_full.indexOf(d.partner_name))


        clarisa.forEach(element => {
            data.push(element.name)
            labels.push(labels_full.indexOf(element.name))
            if (element.acronym && element.acronym != '' && element.acronym != null) {
                data.push(element.acronym)
                labels.push(labels_full.indexOf(element.name))
                data.push(`${element.name} ${element.acronym}`)
                labels.push(labels_full.indexOf(element.name))
            }
            element.countryOfficeDTO.forEach(country => {
                data.push(`${element.name}${(element.acronym != '' && element.acronym != null) ? ' ' + element.acronym : ''} ${country.name}`)
                labels.push(labels_full.indexOf(element.name))
            });
        }
        );
        let melData = [];

        mappedMEL.forEach((element) => {
            melData.push({ mel_name: element.mel_name, clarisa_name: clarisa.filter((d: any) => d.code == element.marlo_id)[0] ? clarisa.filter((d: any) => d.code == element.marlo_id)[0].name : '' })
        })

        melData.forEach(d => {
            data.push(d.mel_name)
            labels.push(labels_full.indexOf(d.clarisa_name))
        })

        labels = labels.map(d => {
            let filtered: any = clarisa.filter(c => c.name == labels_full[d])
            if (filtered && filtered[0])
                return filtered[0].code
            else
                'N/A'
        })
        this.logger.log('Traning data done');
        this.traningModel = this.createTraningModel(labels);
        this.logger.log('Traning model done');
        const tensorData = await this.convertToTensor(data.map(d => d.toLowerCase()), labels);
        this.logger.log('Traning convert To Tensor done');
        await this.trainModel(tensorData.inputs, tensorData.labels);
    }

    createTraningModel(labels) {
        // Create a sequential model
        const model = tf.sequential();
        // Add a single input layer
        model.add(tf.layers.dense({ inputDim: 512, units: 64, activation: 'sigmoid' }));
        // Add an output layer
        model.add(tf.layers.dense({ units: labels.length, activation: 'softmax' }));
        return model;
    }


    async convertToTensor(data, labels) {
        // Wrapping these calculations in a tidy will dispose any 
        // intermediate tensors.
        const model = await use.load()
        const todoEmbedding = await model.embed(data)

        return tf.tidy(() => {
            // Step 1. Shuffle the data    
            tf.util.shuffle(data);
            // tf.t
            // Step 2. Convert data to Tensor
            const inputTensor = todoEmbedding;
            const labelTensor = tf.tensor1d(labels, 'int32');

            //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
            return {
                inputs: inputTensor,
                labels: tf.oneHot(labelTensor, data.length),
            }
        });
    }
    async trainModel(inputs, labels) {
        // Prepare the model for training.  
        this.traningModel.compile({
            loss: "categoricalCrossentropy",
            optimizer: tf.train.sgd(0.001),
            metrics: ["accuracy"],
            // optimizer: tf.train.adamax(0.2),
            // loss: 'categoricalCrossentropy',
        });
        this.logger.log('Traning compile done');
        const epochs = 80;

        await this.traningModel.fit(inputs, labels, {
            epochs,
            batchSize: 15,
            shuffle: true
            //  callbacks: 
        });
        await this.traningModel.save('file://' + path.resolve(__dirname, 'wos_trained_model'));
        this.traningModel = null
        this.logger.log('Traning Finish');
    }

}
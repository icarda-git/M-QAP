require('@tensorflow/tfjs');
import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as path from 'path';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import * as fs from 'fs';
import { firstValueFrom } from 'rxjs';
import { PredictionsService } from 'src/predictions/predictions.service';
import { TrainningCycleService } from 'src/trainning-cycle/trainning-cycle.service';
@Injectable()
export class AI {
  private readonly logger = new Logger(AI.name);
  model;
  clarisa;
  naturalmodel;
  traningModel: tf.Sequential;
  constructor(
    private httpService: HttpService,
    private predictionsService: PredictionsService,
    private trainning_cycle: TrainningCycleService,
  ) {
    this.init();
  }
  async init() {
      const active_cycle = await this.trainning_cycle.findLatestOne();
      const training_folder_path = path.join(
        process.cwd(),
        'uploads/training-data/' + active_cycle.id,
      );
      this.logger.log(
        'Start Loading Trained Model ' +
          process.env.PRODUCTION +
          ' ' +
          training_folder_path,
      );
      this.model = await tf.loadLayersModel(
        'file://' + training_folder_path + '/model.json',
      );
      this.naturalmodel = await use.load();
      let rawdata: any = fs.readFileSync(
        training_folder_path + '/clarisa_data.json',
      );
      this.clarisa = JSON.parse(rawdata);
      this.logger.log('Trained Model Loaded');
  }
  calculatePercent(percent) {
    return Math.round(percent * 100);
  }
  async makePrediction(value, doi) {
    try {
      const todoEmbedding = await this.naturalmodel.embed(value.toLowerCase());
      const results: any = this.model.predict(todoEmbedding);
      const clarisa_index = this.clarisa[results.argMax(1).dataSync()[0]];
      if (clarisa_index)
        firstValueFrom(
          this.httpService
            .post(
              process.env.MEL_API + 'prediction/external',
              {
                wos_name: value,
                type: 'clarisa',
                confident: Math.round(
                  Math.max(...results.dataSync().map((d) => d)) * 100,
                ),
                doi: doi,
                clarisa_id: clarisa_index.code,
              },
              { headers: { authorization: process.env.MEL_API_KEY } },
            )
            .pipe(
              map((d: any) => d.data),
              catchError((e) => {
                this.logger.log('MEL API is not connected');
                this.logger.error(e);
                return [null];
              }),
            ),
        );

      const confidant: number = this.calculatePercent(
        Math.max(...results.dataSync().map((d) => d)),
      );
      const clarisa_id = clarisa_index ? clarisa_index.code : null;

      this.predictionsService.create({ confidant, clarisa_id, text: value });
      return {
        value: clarisa_index ? clarisa_index : null,
        confidant: this.calculatePercent(
          Math.max(...results.dataSync().map((d) => d)),
        ),
      };
    } catch (e) {
      if (e.message && (e.message as string).indexOf(`reading 'embed'`) >= 0)
        throw new BadRequestException(
          'please try again later AI is loading data',
        );
      else throw new InternalServerErrorException(e);
    }
  }
}

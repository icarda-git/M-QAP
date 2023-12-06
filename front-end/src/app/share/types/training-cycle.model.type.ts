import { Prediction } from './prediction.model.type';

export type TrainingCycle = {
  id: number;

  creation_date: string;

  update_date: string;

  text: string;

  predictions: Prediction[];
};

export type Statistics = {
  totalCommodities: number;
  totalOrganization: number;
  totalTrainingCycle: number;
  totalPrediction: number;
  totalTrainingData: number;
  chartData: {
    cycle_id: number;
    predictions_count: number;
  }[];
  cyclePredictionsAverage: {
    predictions_average: number;
    cycle_id: number;
  }[];
};

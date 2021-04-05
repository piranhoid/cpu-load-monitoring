export interface LoadAverageInfo {
  date: Date;
  value: number;
}

export interface AverageListItem {
  index: string;
  value: number;
}

export interface ThresholdIncidentListItem {
  date: Date;
  lastValue: number;
  isExceedingLimit: boolean;
}

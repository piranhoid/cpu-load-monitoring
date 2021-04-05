export interface LoadAverageInfo {
  date: Date;
  value: number;
}

export interface AverageListItem {
  index: number;
  value: number;
}

export interface IncidentThresholdListItem {
  date: Date;
  lastValue: number;
  isExceedingLimit: boolean;
}
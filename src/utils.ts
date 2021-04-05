/* eslint-disable @typescript-eslint/no-namespace */
import os from 'os';

import { LoadAverageInfo } from "./interfaces/info";

declare global {
  namespace NodeJS {
    interface Global {
      currentCpuStatus: boolean;
    }
  }
}

/**
 * 
 * @param {LoadAverageInfo[]} data 
 * @returns {boolean|nulll} null if status hasn't changed otherwise true / false
 * if cpu load average has exceeding the limit 
 */
export const getCpuStatus = (data: LoadAverageInfo[]) => {
  let j = 0;
  let isExceedingLimit = false;
  for (let i = data.length - 1; i >= 0 && j < +process.env.THRESHOLD_DURATION; i -= 1) {
    if (data[i].value >= +process.env.HIGH_LOAD_AVERAGE_THRESHOLD) {
      isExceedingLimit = true;
    } else {
      isExceedingLimit = false;
    }
    j += 1;
  }
  if (j === +process.env.THRESHOLD_DURATION && global.currentCpuStatus !== isExceedingLimit) {
    global.currentCpuStatus = isExceedingLimit;
    return isExceedingLimit;
  }
  else {
    return null;
  }
}

export const getCpuLoadAverage = () => {
  const cpus = os.cpus().length;
  let loadAverage = os.loadavg()[0] / cpus;
  loadAverage = Math.round(loadAverage * 100) / 100;
  return loadAverage;
}
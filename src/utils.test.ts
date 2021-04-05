import { LoadAverageInfo } from "./interfaces/info";
import { getCpuStatus } from "./utils";

describe('getCpuStatus function', () => {
  beforeEach(() => {
    global.currentCpuStatus = null;
  });
  it('should return true if cpu load average is above threshold', () => {
    const data: LoadAverageInfo[] = [{
      date: new Date('2000-01-10 00:01:00'),
      value: 0.8
    }, {
      date: new Date('2000-01-10 00:02:00'),
      value: 0.8
    }, {
      date: new Date('2000-01-10 00:03:00'),
      value: 0.8
    }, {
      date: new Date('2000-01-10 00:04:00'),
      value: 0.8
    }, {
      date: new Date('2000-01-10 00:04:00'),
      value: 0.8
    }];
    const cpuStatus = getCpuStatus(data);
    expect(cpuStatus).toEqual(true);
  }); 
  it('should return false if cpu load average is below threshold', () => {
    const data: LoadAverageInfo[] = [{
      date: new Date('2000-01-10 00:01:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:02:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:03:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:04:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:04:00'),
      value: 0.3
    }];
    const cpuStatus = getCpuStatus(data);
    expect(cpuStatus).toEqual(false);
  });
  it('should return null if status is the same', () => {
    const data: LoadAverageInfo[] = [{
      date: new Date('2000-01-10 00:01:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:02:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:03:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:04:00'),
      value: 0.3
    }, {
      date: new Date('2000-01-10 00:04:00'),
      value: 0.3
    }];
    getCpuStatus(data);
    const cpuStatus = getCpuStatus(data);
    expect(cpuStatus).toEqual(null);
  });
});

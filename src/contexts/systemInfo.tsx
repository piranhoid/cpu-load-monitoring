import React, { createContext, useContext, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { AverageListItem, LoadAverageInfo, ThresholdIncidentListItem } from '../interfaces/info';

type SystemInfoContextType = {
  loadAverage: number | undefined;
  averageList: AverageListItem[];
  isExceedingLimit: boolean;
  tresholdIncidentList: ThresholdIncidentListItem[];
};

type SystemInfoProviderProps = { children: React.ReactNode };

export const SystemInfoContext = createContext<Partial<SystemInfoContextType>>({
  loadAverage: undefined,
  averageList: [],
  isExceedingLimit: false,
  tresholdIncidentList: [],
});

export const SystemInfoProvider = ({ children }: SystemInfoProviderProps) => {
  const [loadAverage, setLoadAverage] = useState<number>();
  const [averageList, setAverageList] = useState<AverageListItem[]>([]);
  const [isExceedingLimit, setIsExceedingLimit] = useState(false);
  const [tresholdIncidentList, setTresholdIncidentList] = useState<
    ThresholdIncidentListItem[]
  >([]);

  useEffect(() => {
    ipcRenderer.on('getCpuInfoResponse', (_, arg: LoadAverageInfo) => {
      setLoadAverage(arg.value);
      setAverageList((prevState: AverageListItem[]) => {
        let values: AverageListItem[] = [...prevState];
        if (values.length === 10) {
          values = values.splice(1);
        }
        values.push({
          index: arg.date.toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: arg.value
        });
        return values;
      });
    });
    ipcRenderer.on('getExceedingLimitResponse', (_, arg) => {
      setIsExceedingLimit(arg.isExceedingLimit);
      setTresholdIncidentList((prevState: ThresholdIncidentListItem[]) => {
        const values: ThresholdIncidentListItem[] = [...prevState];
        values.push({
          lastValue: arg.lastValue,
          date: arg.date,
          isExceedingLimit: arg.isExceedingLimit,
        });
        return values;
      });
    });
    setInterval(() => {
      ipcRenderer.send('getExceedingLimit');
    }, 2000);
    ipcRenderer.send('getCpuInfo');
  }, []);

  return (
    <SystemInfoContext.Provider
      value={{
        loadAverage,
        averageList,
        isExceedingLimit,
        tresholdIncidentList,
      }}
    >
      {children}
    </SystemInfoContext.Provider>
  );
};

const useSystemInfo = () => useContext(SystemInfoContext);

export default useSystemInfo;

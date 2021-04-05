import React, { createContext, useContext, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { AverageListItem, IncidentThresholdListItem } from '../interfaces/info';

type SystemInfoContextType = {
  loadAverage: number | undefined;
  averageList: AverageListItem[];
  isExceedingLimit: boolean;
  tresholdIncidentList: IncidentThresholdListItem[];
};

type SystemInfoProviderProps = { children: React.ReactNode };

const SystemInfoContext = createContext<SystemInfoContextType>({
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
    IncidentThresholdListItem[]
  >([]);

  useEffect(() => {
    ipcRenderer.on('getCpuInfoResponse', (_, arg) => {
      setLoadAverage(arg.value);
      setAverageList((prevState: AverageListItem[]) => {
        let values: AverageListItem[] = [...prevState];
        if (values.length > 10) {
          values = values.splice(1);
        }
        values.push(arg);
        return values;
      });
    });
    ipcRenderer.on('getExceedingLimitResponse', (_, arg) => {
      setIsExceedingLimit(arg.isExceedingLimit);
      setTresholdIncidentList((prevState: IncidentThresholdListItem[]) => {
        const values: IncidentThresholdListItem[] = [...prevState];
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

import React from 'react';

import useSystemInfo from '../../contexts/systemInfo';
import Chart from '../Chart/Chart';
import ThresholdIncidentList from '../ThresholdIncidentList/ThresholdIncidentList';

const Dashboard = () => {
  const {
    loadAverage,
    isExceedingLimit,
  } = useSystemInfo();

  return (
    <div className="w-full h-full flex flex-col px-12 py-12">
      <div className="flex-1 flex flex-row justify-center">
        <div className="text-4xl text-center flex items-center justify-center">
          <div>
            <div>
              CPU Load Average
          </div>
            <div className="text-green-600 pt-4">
              {loadAverage ?? '--'} {isExceedingLimit ? '🔥' : '👌🏻'}
            </div>
          </div>
        </div>
        <div className="pl-12">
          <Chart />
        </div>
      </div>
      <div className="flex-1 mt-12 border-2 overflow-scroll">
        <ThresholdIncidentList />
      </div>
    </div>
  );
};

export default Dashboard;

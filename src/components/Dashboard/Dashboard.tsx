import React from 'react';

import useSystemInfo from '../../contexts/systemInfo';
import Chart from '../Chart/Chart';

const Dashboard = () => {
  const {
    loadAverage,
    isExceedingLimit,
    tresholdIncidentList,
  } = useSystemInfo();

  return (
    <div>
      <div className="text-green-600 items-center justify-center text-4xl flex flex-col">
        {loadAverage ?? '--'} {isExceedingLimit ? '🔥' : '👌🏻'}
      </div>
      <Chart />
      <ul>
        {tresholdIncidentList.map((d, index) => {
          return (
            <li key={index}>
              {d.isExceedingLimit ? '🔥' : '👌🏻'} - {d.lastValue} -{' '}
              {d.date.toLocaleDateString()}{' '}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dashboard;

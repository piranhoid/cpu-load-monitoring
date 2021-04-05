import React from 'react';

import useSystemInfo from '../../contexts/systemInfo';

const ThresholdIncidentList = () => {
  const {
    tresholdIncidentList,
  } = useSystemInfo();

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th>
            Status
          </th>
          <th>
            Last Value
          </th>
          <th>
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {tresholdIncidentList.map((thresholdIncident, index) => {
          return (
            <tr key={index}>
              <td className="text-center">
                {thresholdIncident.isExceedingLimit ? '🔥' : '👌🏻'}
              </td>
              <td className="text-center">
                {thresholdIncident.lastValue}
              </td>
              <td className="text-center">
                {thresholdIncident.date.toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ThresholdIncidentList;


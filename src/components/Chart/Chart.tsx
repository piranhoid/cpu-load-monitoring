import React from 'react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import useSystemInfo from '../../contexts/systemInfo';

const Chart = () => {
  const { averageList } = useSystemInfo();

  return (
    <LineChart
      width={400}
      height={400}
      data={averageList}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis dataKey="index" />
      <YAxis tickCount={10} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#ff7300"
        yAxisId={0}
        isAnimationActive={false}
        dot={false}
      />
    </LineChart>
  );
};

export default Chart;

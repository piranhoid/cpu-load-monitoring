import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import useSystemInfo from '../../contexts/systemInfo';

const Chart = () => {
  const { averageList } = useSystemInfo();

  return (
    <ResponsiveContainer width={700} height="100%">
      <LineChart
        data={averageList}
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
    </ResponsiveContainer>

  );
};

export default Chart;

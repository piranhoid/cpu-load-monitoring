import React from 'react';
import { Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import useSystemInfo from '../../contexts/systemInfo';

type CustomizedAxisTickProps = {
  y: number,
  x: number,
  payload: {
    value: string
  }
};

const CustomizedAxisTick = (props: CustomizedAxisTickProps) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
    </g>
  );
};

const Chart = () => {
  const { averageList } = useSystemInfo();

  return (
    <ResponsiveContainer width={700} height="100%">
      <LineChart
        data={averageList}
      >
        <XAxis dataKey="index" height={60} tick={CustomizedAxisTick}>
          <Label value="Time" offset={80} position="insideBottom" />
        </XAxis>
        <YAxis tickCount={10}>
          <Label value="Value" angle={90} offset={80} position="insideLeft" />
        </YAxis>
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

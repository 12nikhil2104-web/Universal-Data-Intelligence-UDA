import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function StatusPieChart({ data }) {
  const passCount = data.filter(item => item.fail === 0).length;
  const failCount = data.filter(item => item.fail === 1).length;
  
  const chartData = [
    { name: 'PASS', value: passCount },
    { name: 'FAIL', value: failCount },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="bg-white p-4 shadow rounded h-80">
      <h3 className="font-bold mb-2">System Status Summary</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
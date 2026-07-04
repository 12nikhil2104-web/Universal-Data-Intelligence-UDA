import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DynamicPieChart({ data = [], columns = [], onRemove }) {
  const [selectedColumn, setSelectedColumn] = useState('');

  // AUTO-RESET: Update the dropdown when new data is uploaded
  useEffect(() => {
    if (columns.length > 0 && !columns.includes(selectedColumn)) {
      setSelectedColumn(columns[0]);
    }
  }, [columns, selectedColumn]);

  const chartData = useMemo(() => {
    if (!selectedColumn || data.length === 0) return [];
    
    const counts = {};
    data.forEach(item => {
      const val = item[selectedColumn];
      if (val !== null && val !== undefined && val !== '') {
        counts[val] = (counts[val] || 0) + 1;
      }
    });

    // Sort the counts from highest to lowest
    let sortedData = Object.keys(counts).map(key => ({
      name: String(key),
      value: counts[key]
    })).sort((a, b) => b.value - a.value);

    // ANTI-CRASH MEASURE: If there are hundreds of names, Recharts will crash.
    // We group anything beyond the top 10 into an "Other" slice.
    if (sortedData.length > 10) {
      const top10 = sortedData.slice(0, 10);
      const others = sortedData.slice(10).reduce((sum, item) => sum + item.value, 0);
      top10.push({ name: 'Other...', value: others });
      sortedData = top10;
    }

    return sortedData;
  }, [data, selectedColumn]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#94a3b8'];

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Distribution</h3>
        <div className="flex items-center gap-2">
          <select 
            value={selectedColumn} 
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="p-1 border border-gray-300 rounded bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 max-w-[150px]"
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          {onRemove && <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-sm font-bold ml-2">✕</button>}
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
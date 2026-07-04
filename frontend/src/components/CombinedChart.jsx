import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export default function CombinedChart({ data = [], columns = [], onRemove }) {
  const [activeColumns, setActiveColumns] = useState([]);

  // AUTO-CLEANUP: Remove checked boxes that don't exist in the new CSV
  useEffect(() => {
    setActiveColumns(prev => prev.filter(col => columns.includes(col)));
  }, [columns]);

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea', '#0891b2'];

  const toggleColumn = (col) => {
    setActiveColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Combined Data Overlay</h3>
        {onRemove && <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-sm font-bold">✕</button>}
      </div>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {columns.map((col) => (
          <label key={col} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1 rounded border">
            <input 
              type="checkbox" 
              checked={activeColumns.includes(col)}
              onChange={() => toggleColumn(col)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">{col}</span>
          </label>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="x" stroke="#9ca3af" fontSize={12} interval="preserveStartEnd" minTickGap={30} />
            <YAxis domain={['auto', 'auto']} stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: '8px' }} />
            <Legend />
            {activeColumns.map((col, index) => (
              <Line key={col} type="monotone" dataKey={col} stroke={COLORS[index % COLORS.length]} strokeWidth={3} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
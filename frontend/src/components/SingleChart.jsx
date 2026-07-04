import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Brush } from 'recharts';

export default function SingleChart({ data = [], columns = [], onRemove }) {
  const [selectedColumn, setSelectedColumn] = useState('');

  useEffect(() => {
    if (columns.length > 0 && !columns.includes(selectedColumn)) setSelectedColumn(columns[0]);
  }, [columns, selectedColumn]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 relative">
      <div className="flex justify-between items-center mb-4">
        {/* ... (Your existing dropdown and Remove button) */}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={selectedColumn} stroke="#3b82f6" strokeWidth={2} dot={false} />
            
            {/* THIS ADDS THE ZOOM SLIDER AT THE BOTTOM */}
            <Brush dataKey="x" height={30} stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
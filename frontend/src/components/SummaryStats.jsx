import React, { useState, useMemo, useEffect } from 'react';

export default function SummaryStats({ data = [], columns = [], onRemove }) {
  const [selectedColumn, setSelectedColumn] = useState('');

  useEffect(() => {
    if (columns.length > 0 && !columns.includes(selectedColumn)) setSelectedColumn(columns[0]);
  }, [columns, selectedColumn]);

  const stats = useMemo(() => {
    if (!selectedColumn || data.length === 0) return null;
    
    // Extract only valid numbers
    const values = data.map(d => d[selectedColumn]).filter(v => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return null;

    values.sort((a, b) => a - b);
    
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const min = values[0];
    const max = values[values.length - 1];
    
    // Median calculation
    const mid = Math.floor(values.length / 2);
    const median = values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;

    return { 
      count: values.length,
      mean: mean.toFixed(2), 
      median: median.toFixed(2), 
      min: min.toFixed(2), 
      max: max.toFixed(2) 
    };
  }, [data, selectedColumn]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 flex flex-col justify-between h-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Statistical Summary</h3>
        <div className="flex gap-2 items-center">
          <select value={selectedColumn} onChange={e => setSelectedColumn(e.target.value)} className="p-1 border rounded bg-gray-50 text-sm">
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
          {onRemove && <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-sm font-bold">✕</button>}
        </div>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 gap-4 flex-grow">
          <div className="bg-blue-50 p-4 rounded-lg flex flex-col justify-center items-center">
            <span className="text-blue-500 text-sm font-bold uppercase">Average (Mean)</span>
            <span className="text-3xl font-black text-blue-900">{stats.mean}</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg flex flex-col justify-center items-center">
            <span className="text-emerald-500 text-sm font-bold uppercase">Median</span>
            <span className="text-3xl font-black text-emerald-900">{stats.median}</span>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg flex flex-col justify-center items-center">
            <span className="text-orange-500 text-sm font-bold uppercase">Minimum</span>
            <span className="text-3xl font-black text-orange-900">{stats.min}</span>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg flex flex-col justify-center items-center">
            <span className="text-purple-500 text-sm font-bold uppercase">Maximum</span>
            <span className="text-3xl font-black text-purple-900">{stats.max}</span>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-400 italic">No numeric data available.</div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

export default function ProInteractiveChart({ data = [], columns = [], isCombined = false }) {
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    if (columns.length > 0) {
      if (isCombined) {
        setSelectedColumns(columns.slice(0, 2));
      } else {
        setSelectedColumns([columns[0]]);
      }
    }
  }, [columns, isCombined]);

  const handleToggleColumn = (col) => {
    if (isCombined) {
      if (selectedColumns.includes(col)) {
        if (selectedColumns.length > 1) {
          setSelectedColumns(selectedColumns.filter(c => c !== col));
        }
      } else {
        setSelectedColumns([...selectedColumns, col]);
      }
    } else {
      setSelectedColumns([col]);
    }
  };

  const colors = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea', '#0891b2'];

  const chartData = {
    labels: data.map(d => d.x),
    datasets: selectedColumns.map((col, index) => ({
      label: col,
      data: data.map(d => d[col]),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '10',
      borderWidth: 2,
      pointRadius: 1.5,
      tension: 0.1
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        type: 'linear', // Changes x-axis to linear for precise numeric mathematical tracking
        min: 0,
        beginAtZero: true,
        title: { display: true, text: 'Index Count' }
      },
      y: {
        min: 0,
        beginAtZero: true,
        title: { display: true, text: 'Metrics Value' }
      }
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: { enabled: true, speed: 0.05 },
          pinch: { enabled: true },
          mode: 'xy'
        },
        pan: {
          enabled: true,
          mode: 'xy'
        },
        // Locks the boundaries so users cannot drag or zoom past the 0 origin line
        limits: {
          x: { min: 0 },
          y: { min: 0 }
        }
      },
      legend: { display: true, position: 'top' }
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-wrap gap-1.5 mb-3 bg-gray-50 p-2 rounded-lg border border-gray-200 shrink-0 items-center">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">Available Readings:</span>
        
        {isCombined ? (
          columns.map(col => {
            const active = selectedColumns.includes(col);
            return (
              <button
                key={col}
                onClick={() => handleToggleColumn(col)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all border ${
                  active 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {col}
              </button>
            );
          })
        ) : (
          <select 
            value={selectedColumns[0] || ''} 
            onChange={(e) => setSelectedColumns([e.target.value])}
            className="text-xs bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-grow relative min-h-0 chart-container">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
import React from 'react';

export default function DataTable({ data = [], columns = [], onRemove }) {
  if (data.length === 0) return <div className="p-4 bg-white rounded shadow">No data available.</div>;

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border border-gray-100 flex flex-col h-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Raw Data Explorer</h3>
        {onRemove && <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-sm font-bold">✕</button>}
      </div>
      
      {/* Scrollable Table Container */}
      <div className="overflow-auto flex-grow border rounded-lg">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-100 sticky top-0 uppercase text-gray-600 font-semibold">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-4 py-3 border-b">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Show max 100 rows to prevent browser lag */}
            {data.slice(0, 100).map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-2 text-gray-700">
                    {row[col] !== null ? String(row[col]) : <span className="text-gray-400 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-right">Showing up to 100 rows for performance.</p>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import ProInteractiveChart from '../components/ProInteractiveChart';
import DataTable from '../components/DataTable';
import SummaryStats from '../components/SummaryStats';

export default function DashboardPage() {
  const [dataset, setDataset] = useState([]);
  const [schema, setSchema] = useState({ numeric: [], all: [] });
  const [widgets, setWidgets] = useState([
    { id: 'w1', type: 'single' },
    { id: 'w2', type: 'combined' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://universal-data-intelligence-uda.onrender.com/api/models');
        const result = await response.json();
        
        // Explicitly parses strings into numbers to fix the missing dropdown choices bug
        const parsed = result.data.map((item, i) => {
          const row = { id: i, x: i };
          result.columns.forEach(col => {
            const val = item[col];
            row[col] = (!isNaN(Number(val)) && val !== '' && val !== null) ? Number(val) : val;
          });
          return row;
        });

        const num = result.columns.filter(c => parsed.every(r => typeof r[c] === 'number' || r[c] === null));
        
        setDataset(parsed);
        setSchema({ all: result.columns, numeric: num });
        setLoading(false);
      } catch (err) {
        console.error("Data pipeline processing error:", err);
        setLoading(false);
      }
    };

    fetchData(); // Call the async function
  }, []);

  const addWidget = (type) => setWidgets([...widgets, { id: Date.now(), type }]);
  const removeWidget = (id) => setWidgets(widgets.filter(w => w.id !== id));

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-500 font-medium">Parsing Data Engine Streams...</div>;
  }

  return (
    <div className="p-8 h-screen overflow-y-auto bg-gray-100">
      <div className="flex gap-2 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        {['single', 'combined', 'stats', 'table'].map(t => (
          <button 
            key={t} 
            onClick={() => addWidget(t)} 
            className="capitalize bg-gray-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-sm"
          >
            + {t === 'single' ? 'Single Line' : t === 'combined' ? 'Combined Lines' : t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.map(w => (
          <div key={w.id} className="bg-white p-5 shadow-sm rounded-xl border border-gray-200 h-[480px] flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
              <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                {w.type === 'single' ? '📈 Single Reading Analysis' : w.type === 'combined' ? '📊 Multi-Metric Comparison' : w.type}
              </span>
              <button onClick={() => removeWidget(w.id)} className="text-red-500 text-xs font-semibold hover:text-red-700 transition">
                Remove Unit
              </button>
            </div>
            
            <div className="flex-grow overflow-hidden">
              {w.type === 'single' && <ProInteractiveChart data={dataset} columns={schema.numeric} isCombined={false} />}
              {w.type === 'combined' && <ProInteractiveChart data={dataset} columns={schema.numeric} isCombined={true} />}
              {w.type === 'stats' && <SummaryStats data={dataset} columns={schema.numeric} />}
              {w.type === 'table' && <DataTable data={dataset} columns={schema.all} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

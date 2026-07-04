import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  
  // Mock history state 
  const [history, setHistory] = useState([
    { id: 1, name: 'sales_q3_final.csv', size: '2.4 MB', type: 'text/csv', date: 'Oct 24, 2026 - 10:30 AM' },
    { id: 2, name: 'user_metrics_raw.json', size: '845 KB', type: 'application/json', date: 'Oct 22, 2026 - 02:15 PM' },
  ]);

  // Utility to format raw byte sizes into readable MB/KB
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file) => {
    setIsAnalyzing(true);
    setCurrentFile(null);

    // 1. Create a FormData object to safely transport the file to the backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      // 2. Send the POST request to FastAPI
      const response = await fetch("https://universal-data-intelligence-uda.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        // 3. Upon success, update the UI
        const fileData = {
          name: file.name,
          size: formatBytes(file.size),
          type: file.type || 'Text / Tabular',
          date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
        };

        setCurrentFile(fileData);
        setHistory(prev => [{ id: Date.now(), ...fileData }, ...prev]);
      } else {
        alert("Server failed to parse the dataset: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Network upload error:", error);
      alert("Failed to connect to the backend server. Is your FastAPI server running on port 8000?");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 p-8 min-h-[calc(100vh-80px)]">
      
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Data Ingestion Engine</h1>
        <p className="text-slate-500 mt-1">Upload your datasets for instant schema resolution and analytics.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        
        {/* LEFT COLUMN: Upload & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* DRAG AND DROP ZONE */}
          <div 
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 flex flex-col items-center justify-center bg-white shadow-sm cursor-pointer
              ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
            `}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => {
              e.preventDefault(); 
              setIsDragging(false); 
              if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => e.target.files[0] && processFile(e.target.files[0])} 
              className="hidden" 
              accept=".csv,.json,.xlsx"
            />
            
            <div className={`w-20 h-20 mb-4 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-700 mb-2">Drag & Drop your dataset here</h3>
            <p className="text-slate-500 mb-6 text-sm">Supports CSV, JSON, and Excel files up to 500MB.</p>
            
            <button className="px-6 py-3 bg-slate-900 text-white rounded-full font-semibold shadow-md hover:bg-blue-600 transition-colors pointer-events-none">
              Browse Files manually
            </button>
          </div>

          {/* QUICK ANALYSIS SECTION */}
          {isAnalyzing && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div>
                <h4 className="font-bold text-slate-700">AI Engine Analyzing...</h4>
                <p className="text-sm text-slate-500">Detecting columns, datatypes, and statistical boundaries.</p>
              </div>
            </div>
          )}

          {currentFile && !isAnalyzing && (
            <div className="bg-white rounded-2xl p-0 border border-blue-100 shadow-md overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Analysis Complete
                </h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }}
                  className="px-4 py-1.5 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm hover:bg-blue-200 transition"
                >
                  Open in Dashboard →
                </button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">File Name</p>
                  <p className="font-medium text-slate-800 truncate">{currentFile.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">File Size</p>
                  <p className="font-medium text-slate-800">{currentFile.size}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Detected Class</p>
                  <p className="font-medium text-slate-800">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-sm border border-slate-200">
                      {currentFile.type || 'Text / Tabular'}
                    </span>
                  </p>
                </div>
                <div className="col-span-2 mt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Schema Summary</p>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Successfully parsed tabular data matrix. Detected a high density of numeric time-series data alongside categorical identifiers. Ready for multi-metric overlay and statistical summary generation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: History */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Upload History</h3>
            <p className="text-xs text-slate-500 mt-1">Your recent session files</p>
          </div>
          
          <div className="flex-grow overflow-y-auto p-2">
            {history.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors flex items-start gap-4 border-b border-slate-50 last:border-0 cursor-pointer group">
                
                {/* File Type Icon */}
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                
                <div className="min-w-0 flex-grow">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex gap-2">
                    <span>{item.size}</span>
                    <span>•</span>
                    <span className="truncate">{item.type}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
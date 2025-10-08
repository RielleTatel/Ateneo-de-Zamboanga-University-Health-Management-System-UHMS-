import React from 'react';
import { User, FileText, Settings } from 'lucide-react';


import logo from '../../assets/logo.png';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="w-65 bg-white border-r border-gray-200 flex flex-col">

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src={logo} alt="ADZU Logo" className="h-10 w-10 rounded-lg" />
          <div>
            <div className="text-blue-600 font-bold text-xs">ADZU Infirmary</div>
            <div className="text-gray-400 text-xs">Records</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <button 
          onClick={() => setCurrentPage('overview')}
          className="w-full px-4 py-3 flex items-center gap-3 text-gray-600 hover:bg-gray-50"
        >
          <User size={18} />
          <span className="text-sm">Overview</span>
        </button>
        <button 
          onClick={() => setCurrentPage('records')}
          className={`w-full px-4 py-3 flex items-center gap-3 ${
            currentPage === 'records' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText size={18} />
          <span className="text-sm">Records</span>
        </button>
        <button className="w-full px-4 py-3 flex items-center gap-3 text-gray-600 hover:bg-gray-50">
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
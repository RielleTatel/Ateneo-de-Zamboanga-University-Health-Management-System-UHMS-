import React from 'react';
import { Search } from 'lucide-react';
import { patientsData } from '../../data/patientData';

const RecordsPage = ({ setCurrentPage, setSelectedPatient }) => {
  const patients = Object.values(patientsData).map(patient => ({
    id: patient.id,
    patientId: patient.patientId || patient.id, 
    name: patient.name,
    status: patient.status,
    course: patient.course,
    department: patient.department,
    yearLevel: patient.yearLevel,
    record: patient.record || null
  }));

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Clinical Records</h1>
          <p className="text-sm text-gray-500 mt-1">Search and Manage Infirmary Records</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search with ID, name, or email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All States</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Alphabetical</option>
            </select>
          </div>

          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => {
                  setSelectedPatient(patient);
                  setCurrentPage('profile');
                }}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{patient.name}</span>
                      <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded">
                        {patient.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {patient.patientId} • {patient.course} 
                    </div>
                  </div>
                  <div className="text-gray-400">›</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
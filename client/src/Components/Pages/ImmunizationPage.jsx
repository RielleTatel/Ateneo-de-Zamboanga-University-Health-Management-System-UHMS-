import React, { useState } from 'react';
import { User, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import AddImmunizationModal from '../Modals/AddImmunizationModal';

const ImmunizationPage = ({ setCurrentPage, patientDetails }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [immunizations, setImmunizations] = useState([
    {
      id: 1,
      vaccine: 'COVID - 19 (PFIZER)',
      lastAdministered: 'August 5, 2022',
      complianceStatus: 'Completed',
      nextDue: null
    },
    {
      id: 2,
      vaccine: 'Hepatitis B',
      lastAdministered: 'July 5, 2027',
      complianceStatus: 'Completed',
      nextDue: null
    },
    {
      id: 3,
      vaccine: 'Influenza',
      lastAdministered: 'August 23, 2024',
      complianceStatus: 'Overdue',
      nextDue: 'August 23, 2025 (Missed)'
    }
  ]);

  const handleAddImmunization = (newImmunization) => {
    const formatted = {
      id: immunizations.length + 1,
      vaccine: newImmunization.vaccine,
      lastAdministered: new Date(newImmunization.lastAdministered).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      complianceStatus: newImmunization.complianceStatus,
      nextDue: newImmunization.nextDue ? new Date(newImmunization.nextDue).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null
    };
    setImmunizations([...immunizations, formatted]);
  };

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => setCurrentPage('profile')} className="p-2 hover:bg-gray-200 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <div className="text-sm text-gray-500">Records → Profile → Immunization</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 flex">
            <button className="px-6 py-4 font-semibold text-gray-800 border-b-2 border-blue-500">
              PROFILE
            </button>
            <button 
              className="px-6 py-4 text-gray-500 hover:text-gray-800"
              onClick={() => setCurrentPage('clinical-records')} 
            >
              CLINICAL RECORDS
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-start gap-6 mb-8 shadow-lg p-4 rounded-lg border border-gray-200">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={40} className="text-gray-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{patientDetails.name}</h2>
                  <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded">
                    {patientDetails.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 flex space-x-10 justify-space-between">
                  <div>ID: {patientDetails.patientId}</div>
                  <div>Age: {patientDetails.age}</div>
                  <div>Sex: {patientDetails.sex}</div>
                  <div>Contact No: {patientDetails.contact}</div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6 flex justify-center">
              <button onClick={() => setCurrentPage('profile')} className="px-6 py-3 text-gray-500">
                Profile Overview
              </button>
              <button className="px-6 py-3 font-semibold text-blue-600 border-b-2 border-blue-500">
                Immunization
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Immunization Records</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                + Add Immunization
              </button>
            </div>

            <div className="space-y-3">
              {immunizations.map((imm) => (
                <div key={imm.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{imm.vaccine}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Last Administered: {imm.lastAdministered}</div>
                        <div>Compliance Status: {imm.complianceStatus}</div>
                        {imm.nextDue && <div className="text-red-600">Due Next: {imm.nextDue}</div>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddImmunizationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddImmunization}
      />
    </div>
  );
};

export default ImmunizationPage;
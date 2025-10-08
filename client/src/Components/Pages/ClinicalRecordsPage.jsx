import React, { useState } from 'react';
import { User, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import AddVitalsModal from '../Modals/AddVitalsModal';

const ClinicalRecordsPage = ({ setCurrentPage, patientDetails }) => {
  const [activeTab, setActiveTab] = useState('vitals');
  const [showAddModal, setShowAddModal] = useState(false);
  const [vitals, setVitals] = useState([
    {
      id: 1,
      date: 'September 3, 2025',
      bloodPressure: '120/80',
      weight: '69kg',
      height: '170cm',
      bmi: '22.5',
      heartRate: '72 bpm',
      temperature: '36.8°C',
      respiratoryRate: '18'
    }
  ]);

  const handleAddVitals = (newVital) => {
    const formattedVital = {
      id: vitals.length + 1,
      date: new Date(newVital.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      bloodPressure: newVital.bloodPressure,
      weight: newVital.weight + 'kg',
      height: newVital.height + 'cm',
      heartRate: newVital.heartRate + ' bpm',
      temperature: newVital.temperature + '°C',
      respiratoryRate: newVital.respiratoryRate,
      bmi: '22.5'
    };
    setVitals([formattedVital, ...vitals]);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vitals':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Vitals Records</h3>
              <div className="flex items-center gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Most Recent</option>
                  <option>Oldest First</option>
                </select>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  + Add Vitals
                </button>
              </div>
            </div>
            {vitals.map((vital) => (
              <div key={vital.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">{vital.date}</h3>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Trash2 size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Blood Pressure</div>
                    <div className="font-medium">{vital.bloodPressure}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Weight</div>
                    <div className="font-medium">{vital.weight}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Height</div>
                    <div className="font-medium">{vital.height}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">BMI</div>
                    <div className="font-medium">{vital.bmi}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Heart Rate</div>
                    <div className="font-medium">{vital.heartRate}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Temperature</div>
                    <div className="font-medium">{vital.temperature}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Respiratory Rate</div>
                    <div className="font-medium">{vital.respiratoryRate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'lab-results':
        return (
          <div className="text-center py-12 text-gray-500">
            <p>Lab Results - Coming Soon</p>
          </div>
        );
      case 'clinic-visits':
        return (
          <div className="text-center py-12 text-gray-500">
            <p>Clinic Visits - Coming Soon</p>
          </div>
        );
      case 'referrals':
        return (
          <div className="text-center py-12 text-gray-500">
            <p>Referrals/Follow-up - Coming Soon</p>
          </div>
        );
      case 'doctor-report':
        return (
          <div className="text-center py-12 text-gray-500">
            <p>Doctor Report - Coming Soon</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => setCurrentPage('profile')} className="p-2 hover:bg-gray-200 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <div className="text-sm text-gray-500">Records → Profile → Clinical Records</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 flex">
            <button 
              onClick={() => setCurrentPage('profile')}
              className="px-6 py-4 text-gray-500 hover:text-gray-800"
            >
              PROFILE
            </button>
            <button className="px-6 py-4 font-semibold text-gray-800 border-b-2 border-blue-500">
              CLINICAL RECORDS
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-start gap-6 mb-8 shadow-lg p-4 rounded-lg border border-gray-200">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={40} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{patientDetails.name}</h2>
                  <span className="px-2 py-0.5 bg-gray-800 text-white text-xs rounded">
                    {patientDetails.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex gap-8">
                  <div>ID: {patientDetails.patientId}</div>
                  <div>Age: {patientDetails.age}</div>
                  <div>Sex: {patientDetails.sex}</div>
                  <div>Contact No: {patientDetails.contact}</div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('vitals')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'vitals'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Vitals
                </button>
                <button
                  onClick={() => setActiveTab('lab-results')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'lab-results'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Lab Results
                </button>
                <button
                  onClick={() => setActiveTab('clinic-visits')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'clinic-visits'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Clinic Visits
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'referrals'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Referral/Follow-up
                </button>
                <button
                  onClick={() => setActiveTab('doctor-report')}
                  className={`px-6 py-3 font-semibold transition-colors ${
                    activeTab === 'doctor-report'
                      ? 'text-blue-600 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Doctor Report
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>

      <AddVitalsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddVitals}
      />
    </div>
  );
};

export default ClinicalRecordsPage;
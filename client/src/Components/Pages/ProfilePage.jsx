import React from 'react';
import { User, ChevronLeft } from 'lucide-react';

const ProfilePage = ({ setCurrentPage, patientDetails }) => {
  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => setCurrentPage('records')} className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ChevronLeft size={20} />
          </button>
          <div className="text-sm text-gray-500">Records → Profile → Overview</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 flex">
            <button className="px-6 py-4 font-semibold text-gray-800 border-b-2 border-blue-500">
              PROFILE
            </button>
            <button 
              onClick={() => setCurrentPage('clinical-records')}
              className="px-6 py-4 text-gray-500 hover:text-gray-800"
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
                  <h2 className="text-2xl font-bold text-gray-800">{patientDetails.name}</h2>
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
              <button className="px-6 py-3 font-semibold text-blue-600 border-b-2 border-blue-500">
                Profile Overview
              </button>
              <button 
                onClick={() => setCurrentPage('immunization')}
                className="px-6 py-3 text-gray-500 hover:text-gray-800"
              >
                Immunization
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Date of Birth</span>
                    <span className="text-gray-800">{patientDetails.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Year Level</span>
                    <span className="text-gray-800">{patientDetails.yearLevel}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Department</span>
                    <span className="text-gray-800">{patientDetails.department}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Course</span>
                    <span className="text-gray-800">{patientDetails.course}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Address</span>
                    <span className="text-gray-800 text-right">{patientDetails.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Medical Alerts</h3>
                <div className="h-32 bg-gray-50 rounded-lg mb-6"></div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
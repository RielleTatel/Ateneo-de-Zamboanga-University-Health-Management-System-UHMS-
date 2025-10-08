import React, { useState } from 'react';

const AddVitalsModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    date: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    height: '',
    heartRate: '',
    respiratoryRate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onAdd(formData);
    setFormData({
      date: '',
      bloodPressure: '',
      temperature: '',
      weight: '',
      height: '',
      heartRate: '',
      respiratoryRate: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Vitals</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date Taken</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Blood Pressure</label>
              <input
                type="text"
                placeholder="120/80"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Temperature</label>
              <input
                type="text"
                placeholder="36.8"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
              <input
                type="text"
                placeholder="69"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
              <input
                type="text"
                placeholder="170"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Heart Rate (bpm)</label>
              <input
                type="text"
                placeholder="72"
                value={formData.heartRate}
                onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Respiratory Rate</label>
              <input
                type="text"
                placeholder="18"
                value={formData.respiratoryRate}
                onChange={(e) => setFormData({...formData, respiratoryRate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVitalsModal;
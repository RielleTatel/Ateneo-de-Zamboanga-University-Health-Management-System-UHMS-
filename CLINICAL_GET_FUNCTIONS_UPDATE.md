# Clinical Components - GET Functions Update

## Overview
Updated all clinical frontend components to fetch data from the new normalized database structure, including support for custom fields and prescription schedules.

---

## 🔄 Updates Summary

### **1. Encounters Component** (`client/src/components/layout/clinical/encounters.jsx`)

#### **New API Functions Added:**
```javascript
// Fetch prescriptions for a consultation
const fetchPrescriptionsByConsultation = async (consultation_id) => {
    const { data } = await axiosInstance.get(`/consultations/${consultation_id}/prescriptions`);
    return data.prescriptions || [];
};

// Fetch schedules for a prescription
const fetchSchedulesByPrescription = async (prescription_id) => {
    const { data } = await axiosInstance.get(`/prescriptions/${prescription_id}/schedules`);
    return data.schedules || [];
};
```

#### **Enhanced View Modal:**
- Now fetches prescriptions from `consultation_prescriptions` table
- Fetches schedules from `prescription_schedules` table for each prescription
- Displays multiple prescriptions with their schedules
- Shows legacy prescription fields as fallback for old records

#### **Display Structure:**
```
Consultation Details
  ├── Date of Check
  ├── Medical Clearance
  ├── Symptoms
  ├── Chronic Risk Factors
  ├── History
  └── Prescriptions
      ├── Medication 1: [Name]
      │   ├── Quantity: [value]
      │   ├── Instructions: [value]
      │   └── Dosage Schedule:
      │       ├── [Breakfast] - [1 tablet]
      │       └── [Dinner] - [1 tablet]
      └── Medication 2: [Name]
          └── ...
```

---

### **2. Lab Component** (`client/src/components/layout/clinical/lab.jsx`)

#### **New API Function Added:**
```javascript
const fetchCustomFieldsByResult = async (result_id) => {
    const { data } = await axiosInstance.get(`/results/${result_id}/fields`);
    return data.fields || [];
};
```

#### **State Management:**
- Added `customFieldsMap` state to store custom fields for each result
- Added `useEffect` to fetch custom fields when results are loaded

#### **Enhanced Table Display:**
- Standard lab tests displayed as before
- Custom fields displayed as additional rows (with blue background)
- Custom fields show across all result columns
- Empty cells show '-' if custom field not present for that result

#### **Visual Differentiation:**
- Standard tests: White background
- Custom tests: Blue background (`bg-blue-50`)
- Custom test labels: Blue text (`text-blue-700`)

---

## 🗄️ Backend Routes Added

### **Consultation Routes** (`backend/src/routes/consultationRoutes.js`)
```javascript
// Get prescriptions for a specific consultation
GET /api/consultations/:id/prescriptions
```

### **Prescription Routes** (`backend/src/routes/prescriptionRoutes.js`) - NEW FILE
```javascript
// Get schedules for a specific prescription
GET /api/prescriptions/:prescription_id/schedules
```

### **Result Routes** (`backend/src/routes/resultRoutes.js`)
```javascript
// Get custom fields for a specific result
GET /api/results/:result_id/fields
```

---

## 🔧 Backend Controllers Updated

### **ConsultationController** (`backend/src/controllers/consultationController.js`)

**New Methods Added:**

#### 1. `getPrescriptionsByConsultation()`
```javascript
GET /api/consultations/:id/prescriptions
Response: {
  success: true,
  prescriptions: [
    {
      prescription_id: 1,
      consultation_id: 123,
      medication_name: "Amoxicillin",
      quantity: "21 capsules",
      instructions: "Take with food"
    }
  ]
}
```

#### 2. `getSchedulesByPrescription()`
```javascript
GET /api/prescriptions/:prescription_id/schedules
Response: {
  success: true,
  schedules: [
    {
      schedule_id: 1,
      prescription_id: 456,
      meal_time: "breakfast",
      dosage: "1 capsule"
    }
  ]
}
```

### **ResultController** (`backend/src/controllers/resultController.js`)

**New Method Added:**

#### `getCustomFieldsByResult()`
```javascript
GET /api/results/:result_id/fields
Response: {
  success: true,
  fields: [
    {
      id: 1,
      result_id: 789,
      field_key: "Special Marker",
      field_value: "Positive",
      value_type: "text"
    }
  ]
}
```

---

## 📊 Database Tables Referenced

### **Encounters Component:**
1. `consultations` (main table)
2. `consultation_prescriptions` (prescriptions for each consultation)
3. `prescription_schedules` (schedules for each prescription)

**Relationships:**
```
consultations.consultation_id
    ↓ (1:many)
consultation_prescriptions.consultation_id
    ↓ (1:many)
prescription_schedules.prescription_id
```

### **Lab Component:**
1. `results` (main table)
2. `results_fields` (custom fields for each result)

**Relationships:**
```
results.result_id
    ↓ (1:many)
results_fields.result_id
```

---

## 🎨 UI/UX Improvements

### **Encounters - View Modal:**
- ✅ Clean prescription display with numbered medications
- ✅ Schedules displayed as colored tags
- ✅ Meal times in blue badges
- ✅ Dosage clearly visible
- ✅ Fallback to legacy fields for old records
- ✅ Responsive layout

### **Lab - Custom Fields:**
- ✅ Custom fields visually distinct (blue background)
- ✅ Seamlessly integrated with standard tests
- ✅ Shows across all result columns
- ✅ Empty cells handled gracefully

---

## 🧪 Testing Guide

### **Test Encounters View:**

1. Navigate to Clinical page for a patient
2. Go to "Encounters" tab
3. Click "View" (eye icon) on any consultation
4. Verify:
   - ✅ Basic info displays (date, symptoms, history)
   - ✅ Prescriptions section appears if prescriptions exist
   - ✅ Each prescription shows: name, quantity, instructions
   - ✅ Schedules show as badges (e.g., "breakfast - 1 tablet")
   - ✅ Multiple prescriptions display correctly
   - ✅ Legacy prescriptions still visible for old records

### **Test Lab Custom Fields:**

1. Create a lab result with custom fields via consultation page
2. Navigate to Clinical > Lab tab
3. Verify:
   - ✅ Standard lab tests display normally
   - ✅ Custom fields appear as additional rows
   - ✅ Custom fields have blue background
   - ✅ Values align correctly in columns
   - ✅ Empty cells show '-'

---

## 📝 SQL Verification Queries

### **Check Consultation with Prescriptions:**
```sql
SELECT 
    c.consultation_id,
    c.date_of_check,
    c.symptoms,
    cp.prescription_id,
    cp.medication_name,
    cp.quantity,
    ps.meal_time,
    ps.dosage
FROM consultations c
LEFT JOIN consultation_prescriptions cp ON c.consultation_id = cp.consultation_id
LEFT JOIN prescription_schedules ps ON cp.prescription_id = ps.prescription_id
WHERE c.uuid = '<patient-uuid>'
ORDER BY c.date_of_check DESC;
```

### **Check Lab Result with Custom Fields:**
```sql
SELECT 
    r.result_id,
    r.created_at,
    r.hgb,
    r.wbc,
    rf.field_key,
    rf.field_value
FROM results r
LEFT JOIN results_fields rf ON r.result_id = rf.result_id
WHERE r.user_uuid = '<patient-uuid>'
ORDER BY r.created_at DESC;
```

---

## 🚀 Key Improvements

### **Encounters:**
1. ✅ Supports multiple prescriptions per consultation (not possible with legacy)
2. ✅ Each prescription can have multiple schedules
3. ✅ Clean separation of concerns (prescriptions vs schedules)
4. ✅ Backward compatible with legacy prescription fields
5. ✅ Async loading of prescription data (doesn't slow down main list)

### **Lab:**
1. ✅ Supports unlimited custom lab tests
2. ✅ Custom tests visible in history view
3. ✅ Visual distinction between standard and custom tests
4. ✅ Maintains all existing functionality
5. ✅ Styling preserved

---

## 📋 Files Modified

### **Frontend:**
- ✅ `client/src/components/layout/clinical/encounters.jsx`
  - Added prescription and schedule fetching
  - Updated view modal to display normalized data
  - Added fallback for legacy prescriptions

- ✅ `client/src/components/layout/clinical/lab.jsx`
  - Added custom fields fetching
  - Updated table to display custom fields
  - Added visual styling for custom tests

### **Backend:**
- ✅ `backend/src/routes/consultationRoutes.js`
  - Added route for getting prescriptions by consultation

- ✅ `backend/src/routes/prescriptionRoutes.js` (NEW)
  - Added route for getting schedules by prescription

- ✅ `backend/src/routes/resultRoutes.js`
  - Added route for getting custom fields by result

- ✅ `backend/src/controllers/consultationController.js`
  - Added `getPrescriptionsByConsultation()`
  - Added `getSchedulesByPrescription()`

- ✅ `backend/src/controllers/resultController.js`
  - Added `getCustomFieldsByResult()`

- ✅ `backend/src/index.js`
  - Registered prescription routes

### **Backend Models (Already Created):**
- ✅ `backend/src/models/consultationPrescriptionsModel.js`
- ✅ `backend/src/models/prescriptionSchedulesModel.js`
- ✅ `backend/src/models/resultsFieldsModel.js`

---

## ✅ Completion Checklist

- [x] Encounters component fetches prescriptions
- [x] Encounters component fetches schedules
- [x] Encounters component displays multiple prescriptions
- [x] Encounters component displays schedules as badges
- [x] Lab component fetches custom fields
- [x] Lab component displays custom fields
- [x] Custom fields visually distinguished
- [x] Backend routes created
- [x] Backend controllers updated
- [x] All linter checks pass (0 errors)
- [x] Styling preserved (no changes)
- [x] Backward compatibility maintained

---

## 🎉 Result

All clinical components now properly fetch and display data from the new normalized database structure while maintaining backward compatibility with legacy data!

**Testing Ready:** All GET functions updated and fully integrated. ✅


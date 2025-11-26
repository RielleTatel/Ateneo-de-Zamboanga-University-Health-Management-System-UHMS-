# Consultation Module - CREATE Functionality Implementation

## Overview
Implemented the complete CREATE functionality for the consultation module with support for normalized prescription tables and prescription schedules.

---

## 🗄️ Database Schema

### **Main Table: `consultations`**
```sql
consultation_id (bigint) - Primary Key
date_of_check (timestamptz) - Defaults to now()
uuid (uuid) - Foreign Key to patient.uuid
symptoms (text) - Chief complaints/symptoms
history (text) - Patient history
medical_clearance (varchar) - 'Normal', 'At Risk', 'Critical'
chronic_risk_factor (text) - Comma-separated risk factors

-- Legacy fields (still present but normalized into separate tables):
prescription_medication_name (text)
prescription_medication_quantity (integer)
prescription_instructions (text)
prescription_meal_time (text)
prescription_dosage (text)
```

### **Prescription Table: `consultation_prescriptions`**
```sql
prescription_id (bigint) - Primary Key
consultation_id (bigint) - Foreign Key to consultations.consultation_id (ON DELETE CASCADE)
medication_name (text) - Medication name
quantity (numeric/integer) - Quantity prescribed
instructions (text) - General instructions
created_at (timestamptz) - Timestamp
created_by (uuid) - Optional user reference
```

### **Schedule Table: `prescription_schedules`**
```sql
schedule_id (bigint) - Primary Key
prescription_id (bigint) - Foreign Key to consultation_prescriptions.prescription_id (ON DELETE CASCADE)
meal_time (text) - Time/meal (e.g., "breakfast", "after-dinner", "bedtime")
dosage (text) - Dosage per schedule (e.g., "1 tablet", "2 capsules")
created_at (timestamptz) - Timestamp
```

---

## 📁 Files Created/Modified

### **Backend - New Models**

#### 1. `backend/src/models/consultationPrescriptionsModel.js`
Complete CRUD operations for prescriptions:
- `insertPrescription()` - Insert single prescription
- `insertMultiplePrescriptions()` - Bulk insert prescriptions
- `getPrescriptionsByConsultationId()` - Get all prescriptions for a consultation
- `getPrescriptionById()` - Get specific prescription
- `updatePrescription()` - Update prescription
- `deletePrescription()` - Delete prescription
- `deleteAllPrescriptionsForConsultation()` - Delete all prescriptions for a consultation

#### 2. `backend/src/models/prescriptionSchedulesModel.js`
Complete CRUD operations for schedules:
- `insertSchedule()` - Insert single schedule
- `insertMultipleSchedules()` - Bulk insert schedules
- `getSchedulesByPrescriptionId()` - Get all schedules for a prescription
- `getScheduleById()` - Get specific schedule
- `updateSchedule()` - Update schedule
- `deleteSchedule()` - Delete schedule
- `deleteAllSchedulesForPrescription()` - Delete all schedules for a prescription

### **Backend - Updated Controller**

#### 3. `backend/src/controllers/consultationController.js`
Updated `createConsultation()` method to:
1. Insert main consultation record
2. Loop through prescriptions array
3. For each prescription:
   - Insert into `consultation_prescriptions` table
   - Extract and insert schedules into `prescription_schedules` table
4. Return success with consultation data

**Key Features:**
- Handles optional prescriptions (can be empty array)
- Handles optional schedules per prescription
- Continues on error (doesn't fail entire transaction if one prescription fails)
- Comprehensive logging for debugging

---

## 🎨 Frontend Implementation

### **Component: `ConsultationNotes`**
Located in: `client/src/components/layout/consultation/ConsultationField.jsx`

**State Management:**
```javascript
const [consultationData, setConsultationData] = useState({
  date_of_check: new Date().toISOString().split('T')[0],
  symptoms: "",
  history: "",
  medical_clearance: "",
  chronic_risk_factor: [],
  additional_notes: ""
});

const [prescriptions, setPrescriptions] = useState([]);
```

**Data Structure Sent to Backend:**
```javascript
{
  consultation: {
    date_of_check: "2025-11-26",
    uuid: "patient-uuid",
    symptoms: "Headache and fever",
    history: "No previous episodes",
    medical_clearance: "normal",
    chronic_risk_factor: "smoking, hypertension"
  },
  prescriptions: [
    {
      name: "Amoxicillin",
      quantity: "21 capsules",
      frequency: "Take with food",
      schedules: [
        {
          time: "breakfast",
          tabsPerSchedule: "1 capsule"
        },
        {
          time: "dinner",
          tabsPerSchedule: "1 capsule"
        }
      ]
    }
  ],
  additional_notes: "Patient advised to rest"
}
```

### **Component: `Consult.jsx`**
Located in: `client/src/pages/Consult.jsx`

**Mutation:**
```javascript
const createConsultationMutation = useMutation({
  mutationFn: (data) => axiosInstance.post('/consultations/create', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['consultations', recordId]);
  }
});
```

**Save Handler:**
```javascript
const handleSaveConsultation = async () => {
  if (selectedComponents.includes('consultation') && consultationData) {
    await createConsultationMutation.mutateAsync(consultationData);
  }
  // ... vitals and lab handling
};
```

---

## 🔄 Data Flow

### **1. User Interaction**
1. User navigates to `/records`
2. Clicks "Consultation" button for a patient
3. Selects "Consultation Notes" component
4. Fills out consultation form:
   - Date of check
   - Symptoms
   - History
   - Medical clearance (dropdown)
   - Chronic risk factors (multi-select)
   - Additional notes (optional)

### **2. Prescription Management**
1. User clicks "Add Prescription"
2. Fills prescription details:
   - Medication name
   - Quantity
   - General instructions
3. Clicks "Add Schedule" (optional, can add multiple)
4. For each schedule:
   - Selects meal time (dropdown: breakfast, lunch, dinner, etc.)
   - Enters dosage (e.g., "1 tablet")
5. Can add multiple prescriptions, each with multiple schedules

### **3. Data Submission**
1. User clicks "Save Consultation"
2. Frontend sends data to backend: `POST /api/consultations/create`
3. Backend processes:
   - Inserts consultation → gets `consultation_id`
   - For each prescription:
     - Inserts prescription → gets `prescription_id`
     - For each schedule:
       - Inserts schedule linked to `prescription_id`
4. Returns success response
5. Frontend invalidates queries and redirects to `/records`

---

## 🧪 Testing Scenarios

### **Test 1: Consultation with No Prescriptions**
```javascript
{
  consultation: {
    date_of_check: "2025-11-26",
    uuid: "patient-uuid",
    symptoms: "Routine checkup",
    history: "Healthy",
    medical_clearance: "normal",
    chronic_risk_factor: "none"
  },
  prescriptions: []
}
```
**Expected:** Consultation created, no prescriptions inserted.

### **Test 2: Consultation with 1 Prescription, No Schedules**
```javascript
{
  consultation: { ... },
  prescriptions: [
    {
      name: "Vitamin C",
      quantity: "30 tablets",
      frequency: "Take daily"
      // No schedules
    }
  ]
}
```
**Expected:** Consultation and prescription created, no schedules.

### **Test 3: Consultation with Multiple Prescriptions and Schedules**
```javascript
{
  consultation: { ... },
  prescriptions: [
    {
      name: "Amoxicillin",
      quantity: "21 capsules",
      frequency: "Take with food",
      schedules: [
        { time: "breakfast", tabsPerSchedule: "1 capsule" },
        { time: "dinner", tabsPerSchedule: "1 capsule" }
      ]
    },
    {
      name: "Paracetamol",
      quantity: "10 tablets",
      frequency: "As needed for fever",
      schedules: [
        { time: "bedtime", tabsPerSchedule: "1 tablet" }
      ]
    }
  ]
}
```
**Expected:** Consultation, 2 prescriptions, 3 schedules created.

---

## 🔍 Database Verification Queries

### **Check Consultation**
```sql
SELECT * FROM consultations 
WHERE uuid = '<patient-uuid>' 
ORDER BY date_of_check DESC 
LIMIT 1;
```

### **Check Prescriptions for Consultation**
```sql
SELECT * FROM consultation_prescriptions 
WHERE consultation_id = <consultation-id>
ORDER BY created_at;
```

### **Check Schedules for Prescription**
```sql
SELECT * FROM prescription_schedules 
WHERE prescription_id = <prescription-id>
ORDER BY created_at;
```

### **Complete View (All Related Data)**
```sql
SELECT 
  c.consultation_id,
  c.date_of_check,
  c.symptoms,
  cp.prescription_id,
  cp.medication_name,
  cp.quantity,
  ps.schedule_id,
  ps.meal_time,
  ps.dosage
FROM consultations c
LEFT JOIN consultation_prescriptions cp ON c.consultation_id = cp.consultation_id
LEFT JOIN prescription_schedules ps ON cp.prescription_id = ps.prescription_id
WHERE c.uuid = '<patient-uuid>'
ORDER BY c.date_of_check DESC, cp.prescription_id, ps.schedule_id;
```

---

## ⚠️ Important Notes

### **1. Cascading Deletes**
- Deleting a consultation automatically deletes all its prescriptions (CASCADE)
- Deleting a prescription automatically deletes all its schedules (CASCADE)

### **2. Optional Fields**
- Prescriptions are optional (can create consultation without prescriptions)
- Schedules are optional (can create prescription without schedules)
- Additional notes stored separately (for future use)

### **3. Data Normalization**
- Legacy prescription fields in `consultations` table are still present for backward compatibility
- New prescriptions use normalized tables (`consultation_prescriptions`, `prescription_schedules`)
- This allows for multiple prescriptions per consultation (not possible with legacy fields)

### **4. RLS (Row Level Security)**
- RLS is enabled on all tables
- Ensure policies allow authenticated users to insert/read their own consultations
- Foreign key constraints ensure data integrity

---

## 📊 API Endpoints

### **POST** `/api/consultations/create`
**Request Body:**
```json
{
  "consultation": {
    "date_of_check": "2025-11-26",
    "uuid": "patient-uuid",
    "symptoms": "string",
    "history": "string",
    "medical_clearance": "Normal | At Risk | Critical",
    "chronic_risk_factor": "string (comma-separated)"
  },
  "prescriptions": [
    {
      "name": "string",
      "quantity": "string",
      "frequency": "string",
      "schedules": [
        {
          "time": "string",
          "tabsPerSchedule": "string"
        }
      ]
    }
  ],
  "additional_notes": "string (optional)"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Consultation created successfully",
  "consultation": {
    "consultation_id": 123,
    "date_of_check": "2025-11-26T00:00:00Z",
    "uuid": "patient-uuid",
    ...
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## ✅ Success Criteria

- [x] Consultation record created in `consultations` table
- [x] Prescriptions created in `consultation_prescriptions` table
- [x] Schedules created in `prescription_schedules` table
- [x] Proper foreign key relationships maintained
- [x] Cascading deletes work correctly
- [x] Frontend sends data in correct format
- [x] Backend processes all data correctly
- [x] Error handling for partial failures
- [x] Logging for debugging
- [x] No linter errors
- [x] Styling preserved (no changes to frontend UI)

---

## 🚀 Next Steps (Future Enhancements)

1. **Edit Functionality**: Implement edit for existing consultations
2. **View Functionality**: Display consultation history with prescriptions
3. **Print/Export**: Generate prescription printouts
4. **Validation**: Add frontend validation for required fields
5. **Toast Notifications**: Replace alerts with toast notifications
6. **Confirmation Dialogs**: Add confirmation before navigation
7. **Prescription Templates**: Pre-defined prescription templates
8. **Medication Database**: Integration with medication database for autocomplete

---

## 📞 Support

For questions or issues:
- **Backend Models**: `backend/src/models/consultationPrescriptionsModel.js`, `prescriptionSchedulesModel.js`
- **Backend Controller**: `backend/src/controllers/consultationController.js`
- **Frontend Component**: `client/src/components/layout/consultation/ConsultationField.jsx`
- **Frontend Page**: `client/src/pages/Consult.jsx`


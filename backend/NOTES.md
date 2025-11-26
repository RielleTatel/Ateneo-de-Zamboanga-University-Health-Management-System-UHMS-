SERVERLESS DEPLOYMENT IN VERCEL 
- Must add enviroment variables in vercel directly 
- Express backend in serverless wrapper 


    patient_id,
    uuid,
    role,
    id_number,
    first_name,
    middle_name,
    last_name,
    school_email,
    phone_number,
    date_of_birth,
    age,
    sex,
    barangay,
    street_name,
    house_number,
    department,
    course,
    year,
    emergency_first_name,
    emergency_middle_name,
    emergency_last_name,
    emergency_relationship,
    emergency_contact_number

vitals_id
date_of_check
check_uuid
blood_pressure
temperature
heart_rate
respiratory_rate
weight
height
bmi
user_uuid  


@client/src/pages/Clinical.jsx @client/src/components/layout/clinical/vitals.jsx @backend/src/controllers/vitalController.js @backend/src/models/vitalModel.js @backend/src/routes/vitalRoutes.js @client/src/pages/Records.jsx 

Integrate the backend functions of the vitalsRoutes, to the frontend. The functionalites of the frontend vitals should work, this includes getting the data and other intuitive things such as the dropdown functionalities And other buttons. 

For double checking, if there might be errors in the code, thee are the database columns:

@NOTES.md (30-40)  
@NOTES.md (6-28)  

public.patient:
Primary key: patient_id (unique, non-null)
Unique constraint: uuid (unique, non-null after constraint)
public.vitals:
Primary key: vitals_id (unique, auto-increment)
Foreign key: user_uuid → patient(uuid)
Index: idx_vitals_user_uuid on vitals.user_uuid to speed lookups by patient. 

- There is one to many relationship with patient to vitals. So a patient can have more than just one row of vitals. 
- In the records page  

result_id
created_at
hgb
mcv
wbc
slp
tchol
hdl
ldl
trig
fbs
hba1c
sgpt
screa
burica
na
k
psa
ekg
echo_2d
cxr
diastolic
systolic
urinalysis
folate
vitd
b12
tsh 

consultation_id
date_of_check
uuid
symptoms
history
medical_clearance
chronic_risk_factor
prescription_medication_name
prescription_medication_quantity
prescription_instructions
prescription_meal_time
prescription_dosage

What the consultation_meta table is for (purpose / typical usage)
The consultation_meta table is a metadata table designed to store arbitrary, extensible key/value data associated with a results record. It’s useful when you want to attach flexible, schema-less information to consultations without altering the main consultations table every time you need a new attribute.

Common use cases:

Storing optional or rarely used fields (e.g., external_reference, notes, tags).
Holding structured but variable data per results (e.g., a JSON object with results data).
Implementing an audit/enrichment layer: you can keep small bits of metadata that don’t belong in the main entity table.
Supporting multi-value attributes (e.g., multiple tags or external IDs) by inserting multiple rows per consultation.
This pattern is often called an EAV (entity-attribute-value) style or a metadata/key-value table, but implemented more safely with typed JSONB for values.

Table structure explained (column-by-column)
id bigserial PRIMARY KEY

Surrogate primary key for each metadata row. Useful for easy updates/deletes of single meta entries.
consultation_id bigint NOT NULL REFERENCES public.consultations(consultation_id) ON DELETE CASCADE

Foreign key referencing the main consultations table.
ON DELETE CASCADE ensures that when a results is removed, all its metadata rows are automatically deleted.
key text NOT NULL



Schema relationships (summary)
Below are the relevant tables and the foreign-key columns that connect them:

public.patient

Primary key: patient_id
Connector column (UUID): uuid
public.consultations

Primary key: consultation_id
Connector: uuid → public.patient.uuid
Foreign key constraint: fk_consultations_patient_uuid
(Contains the old prescription columns:)
prescription_medication_name
prescription_medication_quantity
prescription_instructions
prescription_meal_time
prescription_dosage
public.results

Primary key: result_id
Connector: user_uuid → public.patient.uuid
Foreign key constraint: fk_results_patient_uuid
public.vitals

Primary key: vitals_id
Connector: user_uuid → public.patient.uuid
Foreign key constraint: fk_vitals_patient_uuid
public.result_prescriptions (new table)

Primary key: id
Connector: result_id → public.results.result_id
Foreign key constraint: result_prescriptions_result_id_fkey
Columns that map to the prescription fields:
medication_name (maps from prescription_medication_name)
quantity (maps from prescription_medication_quantity)
dosage (maps from prescription_dosage)
instructions (maps from prescription_instructions)
meal_time (maps from prescription_meal_time)
Metadata:
created_at
created_by
public.consultation_meta

Primary key: id
Connector: consultation_id → public.consultations.consultation_id
Foreign key constraint: consultation_meta_consultation_id_fkey
Key connection paths (common lookups)

patient.uuid is the central identity used to link:
consultations.uuid → patient.uuid
results.user_uuid → patient.uuid
vitals.user_uuid → patient.uuid
results.result_id links to prescriptions:
result_prescriptions.result_id → results.result_id




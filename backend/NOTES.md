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
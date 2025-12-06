import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/layout/navigation.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, Legend
} from 'recharts';
import { 
  Users, Calendar, FileText, Activity, TrendingUp, AlertCircle, 
  Heart, Droplet, Scale, Mail, Shield, ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import UserNav from "../components/layout/userNav.jsx";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosInstance from "@/lib/axiosInstance";

// API Functions
const fetchAllConsultations = async () => {
  try {
    const { data } = await axiosInstance.get('/consultations/');
    console.log('📊 [DASHBOARD] Consultations data received:', data.consultations);
    return data.consultations || [];
  } catch (error) {
    console.error("❌ [DASHBOARD] Error fetching consultations:", error);
    return [];
  }
};

const fetchAllResults = async () => {
  try {
    const { data } = await axiosInstance.get('/results/all');
    console.log('📊 [DASHBOARD] Results data received:', data.results);
    return data.results || [];
  } catch (error) {
    console.error("❌ [DASHBOARD] Error fetching results:", error);
    return [];
  }
};

const fetchAllVitals = async () => {
  try {
    const { data } = await axiosInstance.get('/vitals/');
    console.log('📊 [DASHBOARD] Vitals data received:', data.vitals);
    return data.vitals || [];
  } catch (error) {
    console.error("❌ [DASHBOARD] Error fetching vitals:", error);
    return [];
  }
};

const fetchAllPatients = async () => {
  try {
    const { data } = await axiosInstance.get('/patients/');
    console.log('📊 [DASHBOARD] Patients data received:', data.patients);
    return data.patients || [];
  } catch (error) {
    console.error("❌ [DASHBOARD] Error fetching patients:", error);
    return [];
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [processedData, setProcessedData] = useState({
    hypertensiveCount: 0,
    criticalLDLCount: 0,
    diabeticWatchCount: 0,
    obesityCount: 0,
    riskStratification: [],
    chronicFactors: [],
    lipidProfile: [],
    bmiVsBP: [],
    atRiskCohort: [],
    departmentRiskMix: [],
    departmentChronicRiskMix: []
  });

  // Pagination state for At-Risk Cohort table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch all data
  const { data: consultations = [], isLoading: loadingConsultations } = useQuery({
    queryKey: ["consultations"],
    queryFn: fetchAllConsultations,
    refetchOnWindowFocus: false
  });

  const { data: results = [], isLoading: loadingResults } = useQuery({
    queryKey: ["results"],
    queryFn: fetchAllResults,
    refetchOnWindowFocus: false
  });

  const { data: vitals = [], isLoading: loadingVitals } = useQuery({
    queryKey: ["vitals"],
    queryFn: fetchAllVitals,
    refetchOnWindowFocus: false
  });

  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchAllPatients,
    refetchOnWindowFocus: false
  });

  // Process data when it's loaded
  useEffect(() => {
    if (loadingConsultations || loadingResults || loadingVitals || loadingPatients) return;

    console.log('🔄 [DASHBOARD] Processing data...');
    console.log('📋 Total Consultations:', consultations.length);
    console.log('🧪 Total Results:', results.length);
    console.log('💓 Total Vitals:', vitals.length);
    console.log('👥 Unique Patients:', patients.length);

    // ========== FILTER TO GET LATEST RECORDS PER PATIENT ==========
    
    // Get latest consultation per patient
    const latestConsultations = {};
    consultations.forEach(consultation => {
      const uuid = consultation.uuid;
      if (!latestConsultations[uuid] || 
          new Date(consultation.date_of_check) > new Date(latestConsultations[uuid].date_of_check)) {
        latestConsultations[uuid] = consultation;
      }
    });

    // Get latest result per patient
    const latestResults = {};
    results.forEach(result => {
      const uuid = result.user_uuid;
      if (!latestResults[uuid] || 
          new Date(result.created_at) > new Date(latestResults[uuid].created_at)) {
        latestResults[uuid] = result;
      }
    });

    // Get latest vital per patient
    const latestVitals = {};
    vitals.forEach(vital => {
      const uuid = vital.user_uuid;
      if (!latestVitals[uuid] || 
          new Date(vital.date_of_check) > new Date(latestVitals[uuid].date_of_check)) {
        latestVitals[uuid] = vital;
      }
    });

    // Convert to arrays
    const latestConsultationsArray = Object.values(latestConsultations);
    const latestResultsArray = Object.values(latestResults);
    const latestVitalsArray = Object.values(latestVitals);

    console.log('📊 [DASHBOARD] Latest records only:');
    console.log('  Consultations:', latestConsultationsArray.length);
    console.log('  Results:', latestResultsArray.length);
    console.log('  Vitals:', latestVitalsArray.length);

    // Process KPI Cards (using latest data only)
    let hypertensiveCount = 0;
    let criticalLDLCount = 0;
    let diabeticWatchCount = 0;
    let obesityCount = 0;

    // Process Latest Vitals for Hypertension and Obesity
    latestVitalsArray.forEach(vital => {
      let systolic, diastolic;
      
      // Handle BP from separate columns or combined string
      if (vital.systolic && vital.diastolic) {
        systolic = parseFloat(vital.systolic);
        diastolic = parseFloat(vital.diastolic);
      } else if (vital.blood_pressure) {
        const parts = vital.blood_pressure.split('/');
        if (parts.length === 2) {
          systolic = parseFloat(parts[0]);
          diastolic = parseFloat(parts[1]);
        }
      }

      const bmi = parseFloat(vital.bmi);

      if (systolic && diastolic && (systolic > 140 || diastolic > 90)) {
        hypertensiveCount++;
      }

      if (bmi && bmi > 30) {
        obesityCount++;
      }
    });

    // Process Latest Results for LDL and HbA1c
    latestResultsArray.forEach(result => {
      const ldl = parseFloat(result.ldl);
      const hba1c = parseFloat(result.hba1c);

      if (ldl > 130) {
        criticalLDLCount++;
      }

      if (hba1c > 6.5) {
        diabeticWatchCount++;
      }
    });

    // Process Risk Stratification (calculated from latest health data only)
    console.log('🔍 [DASHBOARD] Processing risk stratification...');
    
    // Create a map to track each unique patient's worst risk level
    const patientRiskMap = {};
    
    // Check latest consultations first (if medical_clearance is set)
    latestConsultationsArray.forEach(consultation => {
      const uuid = consultation.uuid;
      const clearance = consultation.medical_clearance;
      
      if (clearance && clearance !== 'Normal') {
        patientRiskMap[uuid] = clearance;
      }
    });

    // Check latest vitals for risk (BP > 140/90 or BMI > 30)
    latestVitalsArray.forEach(vital => {
      let systolic, diastolic;
      
      // Handle BP from separate columns or combined string
      if (vital.systolic && vital.diastolic) {
        systolic = parseFloat(vital.systolic);
        diastolic = parseFloat(vital.diastolic);
      } else if (vital.blood_pressure) {
        const parts = vital.blood_pressure.split('/');
        if (parts.length === 2) {
          systolic = parseFloat(parts[0]);
          diastolic = parseFloat(parts[1]);
        }
      }

      const bmi = parseFloat(vital.bmi);
      const uuid = vital.user_uuid;

      if (systolic && diastolic) {
        if ((systolic > 160 || diastolic > 100 || (bmi && bmi > 35)) && !patientRiskMap[uuid]) {
          patientRiskMap[uuid] = 'Critical';
        } else if ((systolic > 140 || diastolic > 90 || (bmi && bmi > 30)) && !patientRiskMap[uuid]) {
          patientRiskMap[uuid] = 'At Risk';
        }
      } else if (bmi) {
        // Fallback if only BMI is available
        if (bmi > 35 && !patientRiskMap[uuid]) {
          patientRiskMap[uuid] = 'Critical';
        } else if (bmi > 30 && !patientRiskMap[uuid]) {
          patientRiskMap[uuid] = 'At Risk';
        }
      }
    });

    // Check latest results for risk (LDL > 130 or HbA1c > 6.5)
    latestResultsArray.forEach(result => {
      const ldl = parseFloat(result.ldl);
      const hba1c = parseFloat(result.hba1c);
      const uuid = result.user_uuid;

      if ((ldl > 160 || hba1c > 8) && (!patientRiskMap[uuid] || patientRiskMap[uuid] !== 'Critical')) {
        patientRiskMap[uuid] = 'Critical';
      } else if ((ldl > 130 || hba1c > 6.5) && !patientRiskMap[uuid]) {
        patientRiskMap[uuid] = 'At Risk';
      }
    });

    // Count risk levels
    const riskCounts = {
      Normal: 0,
      'At Risk': 0,
      Critical: 0
    };

    // Get unique patients from all sources
    const allPatientUUIDs = new Set([
      ...latestConsultationsArray.map(c => c.uuid),
      ...latestVitalsArray.map(v => v.user_uuid),
      ...latestResultsArray.map(r => r.user_uuid)
    ]);

    allPatientUUIDs.forEach(uuid => {
      const risk = patientRiskMap[uuid] || 'Normal';
      riskCounts[risk]++;
    });

    console.log('📊 [DASHBOARD] Risk counts:', riskCounts);

    const riskStratification = [
      { name: 'Normal', value: riskCounts.Normal, color: '#22c55e' },
      { name: 'At Risk', value: riskCounts['At Risk'], color: '#f59e0b' },
      { name: 'Critical', value: riskCounts.Critical, color: '#ef4444' }
    ];

    // Process Chronic Risk Factors (from latest consultations only)
    const chronicFactorCounts = {};
    console.log('🔍 [DASHBOARD] Processing chronic risk factors...');
    
    latestConsultationsArray.forEach(consultation => {
      const rawFactor = consultation.chronic_risk_factor;
      
      if (rawFactor) {
        // Handle potential non-string values and split
        const factorString = String(rawFactor);
        const factors = factorString.includes(',') 
          ? factorString.split(',') 
          : [factorString];
        
        factors.forEach(f => {
          // Normalize to lowercase and trim for consistent checking
          const normalized = f.trim().toLowerCase();
          
          // Filter out 'none', 'null', empty strings, 'n/a'
          if (
            normalized && 
            normalized !== 'none' && 
            normalized !== 'null' && 
            normalized !== 'n/a' && 
            normalized !== 'undefined'
          ) {
            // Capitalize first letter for display (e.g., "diabetes" -> "Diabetes")
            const display = normalized.charAt(0).toUpperCase() + normalized.slice(1);
            chronicFactorCounts[display] = (chronicFactorCounts[display] || 0) + 1;
          }
        });
      }
    });

    console.log('📊 [DASHBOARD] Chronic factor counts:', chronicFactorCounts);

    const chronicFactors = Object.entries(chronicFactorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    console.log('📊 [DASHBOARD] Processed chronic factors:', chronicFactors);

    // Process Lipid Profile (Average values from latest results only)
    const lipidValues = {
      'Total Chol': [],
      'HDL': [],
      'LDL': [],
      'Triglycerides': []
    };

    latestResultsArray.forEach(result => {
      if (result.tchol) lipidValues['Total Chol'].push(parseFloat(result.tchol));
      if (result.hdl) lipidValues['HDL'].push(parseFloat(result.hdl));
      if (result.ldl) lipidValues['LDL'].push(parseFloat(result.ldl));
      if (result.trig) lipidValues['Triglycerides'].push(parseFloat(result.trig));
    });

    const calculateAverage = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const lipidProfile = [
      {
        metric: 'Total Chol',
        'Avg Student': Math.round(calculateAverage(lipidValues['Total Chol'])),
        'Healthy Limit': 200,
      },
      {
        metric: 'HDL',
        'Avg Student': Math.round(calculateAverage(lipidValues['HDL'])),
        'Healthy Limit': 60,
      },
      {
        metric: 'LDL',
        'Avg Student': Math.round(calculateAverage(lipidValues['LDL'])),
        'Healthy Limit': 100,
      },
      {
        metric: 'Triglycerides',
        'Avg Student': Math.round(calculateAverage(lipidValues['Triglycerides'])),
        'Healthy Limit': 150,
      }
    ];

    // Process BMI vs BP Scatter Plot (one point per patient, latest data)
    console.log('🔍 [DASHBOARD] Processing BMI vs BP correlation...');
    const bmiVsBP = latestVitalsArray
      .map(v => {
        let systolic = null;
        
        // Try explicit column
        if (v.systolic) {
          systolic = parseFloat(v.systolic);
        } 
        // Try parsing blood_pressure string (e.g. "120/80")
        else if (v.blood_pressure) {
          const parts = v.blood_pressure.split('/');
          if (parts.length === 2) {
            systolic = parseFloat(parts[0]);
          }
        }

        const bmi = parseFloat(v.bmi);
        
        return {
          bmi: bmi,
          systolic: systolic,
          user_uuid: v.user_uuid
        };
      })
      .filter(v => {
        // Ensure we have valid numbers for both axes
        const isValid = 
          !isNaN(v.bmi) && v.bmi > 0 && 
          !isNaN(v.systolic) && v.systolic > 0;
          
        return isValid;
      });

    console.log('📊 [DASHBOARD] BMI vs BP data points:', bmiVsBP.length);
    if (bmiVsBP.length > 0) {
      console.log('Sample point:', bmiVsBP[0]);
    } else {
      console.log('⚠️ No valid BMI/BP data points found. Check vitals data structure.');
      if (latestVitalsArray.length > 0) {
        console.log('Sample vital record:', latestVitalsArray[0]);
      }
    }
    if (bmiVsBP.length > 0) {
      console.log('Sample point:', bmiVsBP[0]);
    }

    // Process At-Risk Cohort (using latest data only)
    console.log('🔍 [DASHBOARD] Processing at-risk cohort...');
    
    // Create a patient name lookup map
    const patientNameMap = {};
    patients.forEach(patient => {
      patientNameMap[patient.uuid] = patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown';
    });

    console.log('👥 [DASHBOARD] Patient name map created:', Object.keys(patientNameMap).length, 'patients');
    
    // Create a map to combine data by user with risk factors
    const userDataMap = {};

    // Helper to update user data map
    const updateUserData = (uuid, status, factor, checkupDate) => {
      if (!userDataMap[uuid]) {
        userDataMap[uuid] = {
          uuid,
          name: patientNameMap[uuid] || 'Unknown Patient',
          status: status,
          chronicFactors: [factor],
          lastCheckup: checkupDate
        };
      } else {
        // Update to higher risk level if needed
        if (status === 'Critical' && userDataMap[uuid].status !== 'Critical') {
          userDataMap[uuid].status = 'Critical';
        } else if (status === 'At Risk' && userDataMap[uuid].status === 'Normal') {
          userDataMap[uuid].status = 'At Risk';
        }
        // Add factor if not already present
        if (!userDataMap[uuid].chronicFactors.includes(factor)) {
          userDataMap[uuid].chronicFactors.push(factor);
        }
        // Use most recent checkup date
        if (new Date(checkupDate) > new Date(userDataMap[uuid].lastCheckup)) {
          userDataMap[uuid].lastCheckup = checkupDate;
        }
      }
    };

    // Check latest vitals for risk factors
    latestVitalsArray.forEach(vital => {
      let systolic, diastolic;
      
      // Handle BP from separate columns or combined string
      if (vital.systolic && vital.diastolic) {
        systolic = parseFloat(vital.systolic);
        diastolic = parseFloat(vital.diastolic);
      } else if (vital.blood_pressure) {
        const parts = vital.blood_pressure.split('/');
        if (parts.length === 2) {
          systolic = parseFloat(parts[0]);
          diastolic = parseFloat(parts[1]);
        }
      }

      const bmi = parseFloat(vital.bmi);
      const uuid = vital.user_uuid;

      if (systolic && diastolic) {
        if (systolic > 160 || diastolic > 100) {
          updateUserData(uuid, 'Critical', `BP: ${systolic}/${diastolic}`, vital.date_of_check);
        } else if (systolic > 140 || diastolic > 90) {
          updateUserData(uuid, 'At Risk', `BP: ${systolic}/${diastolic}`, vital.date_of_check);
        }
      }

      if (bmi) {
        if (bmi > 35) {
          updateUserData(uuid, 'Critical', `BMI: ${vital.bmi}`, vital.date_of_check);
        } else if (bmi > 30) {
          updateUserData(uuid, 'At Risk', `BMI: ${vital.bmi}`, vital.date_of_check);
        }
      }
    });

    // Check latest results for risk factors
    latestResultsArray.forEach(result => {
      const ldl = parseFloat(result.ldl);
      const hba1c = parseFloat(result.hba1c);
      const uuid = result.user_uuid;

      if (ldl > 160) {
        updateUserData(uuid, 'Critical', `LDL: ${result.ldl}`, result.created_at);
      } else if (ldl > 130) {
        updateUserData(uuid, 'At Risk', `LDL: ${result.ldl}`, result.created_at);
      }

      if (hba1c > 8) {
        updateUserData(uuid, 'Critical', `HbA1c: ${result.hba1c}`, result.created_at);
      } else if (hba1c > 6.5) {
        updateUserData(uuid, 'At Risk', `HbA1c: ${result.hba1c}`, result.created_at);
      }
    });

    // Check latest consultations for risk factors (medical_clearance)
    latestConsultationsArray.forEach(consultation => {
      const uuid = consultation.uuid;
      const clearance = consultation.medical_clearance;
      const chronicFactor = consultation.chronic_risk_factor;
      
      if (clearance === 'Critical' || clearance === 'At Risk') {
        let factorText = clearance === 'Critical' ? 'Critical Condition' : 'At Risk Condition';
        
        // Add chronic risk factors if available
        if (chronicFactor) {
          const factorString = String(chronicFactor);
          const factors = factorString.includes(',') 
            ? factorString.split(',').map(f => f.trim())
            : [factorString.trim()];
          
          const validFactors = factors.filter(f => 
            f && f.toLowerCase() !== 'none' && 
            f.toLowerCase() !== 'null' && 
            f.toLowerCase() !== 'n/a'
          );
          
          if (validFactors.length > 0) {
            factorText = validFactors.join(', ');
          }
        }
        
        updateUserData(uuid, clearance, factorText, consultation.date_of_check);
      }
    });

    // Filter only At Risk and Critical patients, combine factors into string
    // Use the same patientRiskMap logic to ensure consistency with risk stratification
    const atRiskCohort = Object.values(userDataMap)
      .filter(patient => {
        // Also check patientRiskMap to ensure we include all at-risk patients
        const riskFromMap = patientRiskMap[patient.uuid];
        return (patient.status === 'At Risk' || patient.status === 'Critical' || 
                riskFromMap === 'At Risk' || riskFromMap === 'Critical');
      })
      .map(patient => {
        // Use patientRiskMap status if it's higher risk
        const finalStatus = (patientRiskMap[patient.uuid] === 'Critical' || patient.status === 'Critical') 
          ? 'Critical' 
          : (patientRiskMap[patient.uuid] === 'At Risk' || patient.status === 'At Risk')
          ? 'At Risk'
          : patient.status;
        
        return {
          ...patient,
          status: finalStatus,
          chronicFactor: patient.chronicFactors.join(', ')
        };
      })
      .sort((a, b) => {
        // Sort Critical first, then At Risk
        if (a.status === 'Critical' && b.status !== 'Critical') return -1;
        if (a.status !== 'Critical' && b.status === 'Critical') return 1;
        return 0;
      });

    console.log('📊 [DASHBOARD] At-risk cohort:', atRiskCohort.length, 'patients');

    // Process Critical Risk Ranker – department risk mix (Green / Yellow / Red)
    // Iterate through ALL patients so every department in the registry appears,
    // even if some departments currently have only "Normal" students.
    console.log('🔍 [DASHBOARD] Processing department risk mix...');
    const departmentRiskCounts = {};

    patients.forEach((pt) => {
      const uuid = pt.uuid;
      const dept = pt.department || 'Unknown';
      const risk = patientRiskMap[uuid] || 'Normal';

      if (!departmentRiskCounts[dept]) {
        departmentRiskCounts[dept] = { green: 0, yellow: 0, red: 0, total: 0 };
      }

      const bucket =
        risk === 'Critical'
          ? 'red'
          : risk === 'At Risk'
          ? 'yellow'
          : 'green';

      departmentRiskCounts[dept][bucket] += 1;
      departmentRiskCounts[dept].total += 1;
    });

    const departmentRiskMix = Object.entries(departmentRiskCounts)
      .map(([department, counts]) => {
        const { green, yellow, red, total } = counts;
        if (!total) {
          return { department, green: 0, yellow: 0, red: 0 };
        }
        return {
          department,
          green: green / total,
          yellow: yellow / total,
          red: red / total,
        };
      })
      // Optional: sort by highest red share, then yellow
      .sort((a, b) => {
        if (b.red !== a.red) return b.red - a.red;
        return b.yellow - a.yellow;
      });

    console.log('📊 [DASHBOARD] Department risk mix:', departmentRiskMix);

    // Process Chronic Risk Factor Distribution by Department (100% stacked bar)
    console.log('🔍 [DASHBOARD] Processing department chronic risk factor distribution...');
    const departmentChronicCounts = {};

    // Map each patient to their department and chronic risk factors
    patients.forEach((pt) => {
      const dept = pt.department || 'Unknown';
      const uuid = pt.uuid;

      // Find the latest consultation for this patient
      const patientConsultation = latestConsultationsArray.find(c => c.uuid === uuid);

      if (!departmentChronicCounts[dept]) {
        departmentChronicCounts[dept] = {
          smoking: 0,
          drinking: 0,
          hypertension: 0,
          diabetes: 0,
          none: 0,
          total: 0
        };
      }

      if (patientConsultation && patientConsultation.chronic_risk_factor) {
        const rawFactor = patientConsultation.chronic_risk_factor;
        const factorString = String(rawFactor).toLowerCase();

        // Check for each chronic risk factor
        if (factorString.includes('smoking')) {
          departmentChronicCounts[dept].smoking += 1;
        } else if (factorString.includes('drinking')) {
          departmentChronicCounts[dept].drinking += 1;
        } else if (factorString.includes('hypertension')) {
          departmentChronicCounts[dept].hypertension += 1;
        } else if (factorString.includes('diabetes')) {
          departmentChronicCounts[dept].diabetes += 1;
        } else if (factorString === 'none' || factorString === 'null' || factorString === 'n/a' || factorString === '') {
          departmentChronicCounts[dept].none += 1;
        } else {
          // If it's some other factor, count as none
          departmentChronicCounts[dept].none += 1;
        }
      } else {
        // No consultation data = none
        departmentChronicCounts[dept].none += 1;
      }

      departmentChronicCounts[dept].total += 1;
    });

    const departmentChronicRiskMix = Object.entries(departmentChronicCounts)
      .map(([department, counts]) => {
        const { smoking, drinking, hypertension, diabetes, none, total } = counts;
        if (!total) {
          return { department, smoking: 0, drinking: 0, hypertension: 0, diabetes: 0, none: 0 };
        }
        return {
          department,
          smoking: smoking / total,
          drinking: drinking / total,
          hypertension: hypertension / total,
          diabetes: diabetes / total,
          none: none / total,
        };
      })
      // Sort by highest chronic risk factors (smoking + drinking + hypertension + diabetes)
      .sort((a, b) => {
        const aRisk = a.smoking + a.drinking + a.hypertension + a.diabetes;
        const bRisk = b.smoking + b.drinking + b.hypertension + b.diabetes;
        return bRisk - aRisk;
      });

    console.log('📊 [DASHBOARD] Department chronic risk mix:', departmentChronicRiskMix);

    setProcessedData({
      hypertensiveCount,
      criticalLDLCount,
      diabeticWatchCount,
      obesityCount,
      riskStratification,
      chronicFactors,
      lipidProfile,
      bmiVsBP,
      atRiskCohort,
      departmentRiskMix,
      departmentChronicRiskMix
    });
  }, [consultations, results, vitals, patients, loadingConsultations, loadingResults, loadingVitals, loadingPatients]);

  const isLoading = loadingConsultations || loadingResults || loadingVitals || loadingPatients;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">
      <Navigation />

            {/* Main Content */}
            <div className="flex-1 flex-col"> 
                <div className="flex-1 flex-col p-4">  
                    <div className="min-w-full px-3 flex justify-between items-center">
            <p className="text-[20px]"><b>Cardiovascular Health Dashboard</b></p>
            <UserNav />
                    </div> 

                    <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7"> 
                        {/* Welcome Section */}
                        <div className="mb-8 flex flex-col gap-y-2">
              <h1 className="text-[36px] font-bold" style={{ color: '#0033A0' }}>
                AdZU Health Dashboard
              </h1>
              <p className="text-[15px] text-gray-600">
                Cardiovascular & Metabolic Health Monitoring System
              </p>
                        </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Activity className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#0033A0' }} />
                  <p className="text-gray-600">Loading health data...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Section 1: Top KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-white shadow-md border-2" style={{ borderColor: '#0033A0' }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Hypertensive Crisis</CardTitle>
                      <Heart className="h-5 w-5 text-red-600" />
                                </CardHeader>
                                <CardContent>
                      <div className="text-3xl font-bold">{processedData.hypertensiveCount}</div>
                      <p className="text-xs text-red-600 mt-2">
                        BP &gt; 140/90 mmHg
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
                                </CardContent>
                            </Card>

                  <Card className="bg-white shadow-md border-2" style={{ borderColor: '#0033A0' }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Critical LDL</CardTitle>
                      <Droplet className="h-5 w-5 text-orange-600" />
                                </CardHeader>
                                <CardContent>
                      <div className="text-3xl font-bold">{processedData.criticalLDLCount}</div>
                      <p className="text-xs text-orange-600 mt-2">
                        LDL &gt; 130 mg/dL
                      </p>
                      <p className="text-xs text-gray-500 mt-1">High cardiovascular risk</p>
                                </CardContent>
                            </Card>

                  <Card className="bg-white shadow-md border-2" style={{ borderColor: '#0033A0' }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Diabetic Watch</CardTitle>
                      <Activity className="h-5 w-5 text-purple-600" />
                                </CardHeader>
                                <CardContent>
                      <div className="text-3xl font-bold">{processedData.diabeticWatchCount}</div>
                      <p className="text-xs text-purple-600 mt-2">
                        HbA1c &gt; 6.5%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Elevated diabetes risk</p>
                                </CardContent>
                            </Card>

                  <Card className="bg-white shadow-md border-2" style={{ borderColor: '#0033A0' }}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Obesity Alert</CardTitle>
                      <Scale className="h-5 w-5 text-amber-600" />
                                </CardHeader>
                                <CardContent>
                      <div className="text-3xl font-bold">{processedData.obesityCount}</div>
                      <p className="text-xs text-amber-600 mt-2">
                        BMI &gt; 30 kg/m²
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Weight management needed</p>
                                </CardContent>
                            </Card>
                        </div>

                {/* Section 2: Population Health Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Risk Stratification Donut Chart */}
                  <Card className="bg-white shadow-md border-2 border-outline">
                                <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Shield className="h-5 w-5" style={{ color: '#0033A0' }} />
                        Risk Stratification
                      </CardTitle>
                      <p className="text-sm text-gray-500">Medical clearance distribution</p>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                            data={processedData.riskStratification}
                                                cx="50%"
                                                cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                                                paddingAngle={5}
                            dataKey="value"
                                            >
                            {processedData.riskStratification.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                      <div className="flex justify-center space-x-6 mt-4">
                        {processedData.riskStratification.map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
                              {item.value}
                            </div>
                            <div className="flex items-center">
                                                <div 
                                                    className="w-3 h-3 rounded-full mr-2" 
                                                    style={{ backgroundColor: item.color }}
                                                ></div>
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                  {/* Chronic Risk Factors Bar Chart */}
                  
                  <Card className="bg-white shadow-md border-2 border-outline">
                            <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" style={{ color: '#0033A0' }} />
                        Chronic Risk Factors
                      </CardTitle>
                      <p className="text-sm text-gray-500">Prevalence of risk factors</p>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          data={processedData.chronicFactors} 
                          layout="vertical"
                          margin={{ left: 80 }}
                        >
                                        <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={70} />
                                        <Tooltip />
                          <Bar dataKey="count" fill="#0033A0" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                </div>

                {/* Section 3: Deep Dive Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Chronic Risk Factor Distribution by Department */}
                  <Card className="bg-white shadow-md border-2 border-outline">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" style={{ color: '#0033A0' }} />
                        Chronic Risk Factor Distribution
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Departments ranked by share of students with chronic risk factors
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={processedData.departmentChronicRiskMix}
                          layout="vertical"
                          stackOffset="expand"
                          margin={{ left: 40, right: 10, top: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                          <YAxis 
                            type="category" 
                            dataKey="department" 
                            width={140} 
                            tick={{ fontSize: 12 }}
                            interval={0}
                          />
                          <Tooltip
                            formatter={(value, name) => [`${Math.round(value * 100)}%`, name]}
                          />
                          <Legend />
                          <Bar dataKey="smoking" stackId="chronic" fill="#8b5cf6" name="Smoking" />
                          <Bar dataKey="drinking" stackId="chronic" fill="#ec4899" name="Drinking" />
                          <Bar dataKey="hypertension" stackId="chronic" fill="#ef4444" name="Hypertension" />
                          <Bar dataKey="diabetes" stackId="chronic" fill="#f59e0b" name="Diabetes" />
                          <Bar dataKey="none" stackId="chronic" fill="#22c55e" name="None" />
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Bars represent 100% of each department; identify departments with highest chronic risk factor prevalence.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Critical Risk Ranker – 100% Stacked Bar Chart */}
                  <Card className="bg-white shadow-md border-2 border-outline">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" style={{ color: '#0033A0' }} />
                        Critical Risk Ranker
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Departments ranked by share of students in each risk zone
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={processedData.departmentRiskMix}
                          layout="vertical"
                          stackOffset="expand"
                          margin={{ left: 40, right: 10, top: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                          <YAxis 
                            type="category" 
                            dataKey="department" 
                            width={140} 
                            tick={{ fontSize: 12 }}
                            interval={0}
                          />
                          <Tooltip
                            formatter={(value, name) => [`${Math.round(value * 100)}%`, name]}
                          />
                          <Legend />
                          <Bar dataKey="green" stackId="risk" fill="#22c55e" name="Green (Normal)" />
                          <Bar dataKey="yellow" stackId="risk" fill="#eab308" name="Yellow (At Risk)" />
                          <Bar dataKey="red" stackId="risk" fill="#ef4444" name="Red (Critical)" />
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Bars represent 100% of each department; look for the longest red segment to find
                        where immediate intervention is most needed.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                {/* Section 4: At-Risk Cohort Table */}
                <Card className="bg-white shadow-md border-2 border-outline">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5" style={{ color: '#0033A0' }} />
                      At-Risk Cohort
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Patients requiring immediate attention or follow-up
                    </p>
                  </CardHeader>
                  <CardContent>
                    {processedData.atRiskCohort.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Shield className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        <p>No at-risk patients found. All patients are within healthy ranges.</p>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-semibold">Patient Name</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Risk Factors</TableHead>
                                <TableHead className="font-semibold">Last Checkup</TableHead>
                                <TableHead className="font-semibold text-center">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {processedData.atRiskCohort
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((patient, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">
                                      {patient.name}
                                    </TableCell>
                                    <TableCell>
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                          patient.status === 'Critical'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-orange-100 text-orange-700'
                                        }`}
                                      >
                                        {patient.status}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-sm max-w-xs truncate">
                                      {patient.chronicFactor}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      {formatDate(patient.lastCheckup)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-2"
                                        style={{ borderColor: '#0033A0', color: '#0033A0' }}
                                        onClick={() => navigate('/profile', { 
                                          state: { 
                                            recordId: patient.uuid,
                                            recordName: patient.name 
                                          } 
                                        })}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        View Profile
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination Controls */}
                        {processedData.atRiskCohort.length > itemsPerPage && (
                          <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-gray-600">
                              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                              {Math.min(currentPage * itemsPerPage, processedData.atRiskCohort.length)} of{' '}
                              {processedData.atRiskCohort.length} patients
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* Previous Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="h-8 px-3"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>

                              {/* Page Numbers */}
                              <div className="flex items-center gap-1">
                                {Array.from(
                                  { length: Math.ceil(processedData.atRiskCohort.length / itemsPerPage) },
                                  (_, i) => i + 1
                                ).map((pageNum) => (
                                  <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`h-8 w-8 p-0 ${
                                      currentPage === pageNum 
                                        ? 'text-white' 
                                        : ''
                                    }`}
                                    style={currentPage === pageNum ? { backgroundColor: '#0033A0' } : {}}
                                  >
                                    {pageNum}
                                  </Button>
                                ))}
                              </div>

                              {/* Next Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => 
                                  Math.min(Math.ceil(processedData.atRiskCohort.length / itemsPerPage), prev + 1)
                                )}
                                disabled={currentPage === Math.ceil(processedData.atRiskCohort.length / itemsPerPage)}
                                className="h-8 px-3"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Data Summary Footer */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2" style={{ borderColor: '#0033A0' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" style={{ color: '#0033A0' }} />
                      <span className="font-semibold" style={{ color: '#0033A0' }}>
                        Data Summary
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Dashboard Data:</span>{' '}
                      {patients.length} unique patients • Latest records only
                    </div>
                  </div>
                </div>
              </>
            )}
                    </div>
                </div>
            </div>
        </div> 
    );
};

export default Dashboard; 

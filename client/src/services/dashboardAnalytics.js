/**
 * Service Layer: Dashboard Analytics
 * Aggregates all processed data for the dashboard
 */

import { 
  RISK_THRESHOLDS, 
  RISK_LEVELS, 
  RISK_COLORS,
  isHypertensive,
  isObese,
  hasCriticalLDL,
  isDiabeticWatch,
  calculateVitalRisk,
  calculateLabRisk
} from '@/domain/riskRules';

import {
  getLatestByUser,
  normalizeChronicFactors,
  calculateAverage,
  parseBloodPressure,
  createPatientNameMap,
  extractLipidProfile
} from '@/utils/healthParsing';

/**
 * Build complete dashboard analytics from raw data
 * @param {Object} data - Raw data from API
 * @param {Array} data.consultations - Consultation records
 * @param {Array} data.results - Lab result records
 * @param {Array} data.vitals - Vital records
 * @param {Array} data.patients - Patient records
 * @returns {Object} Processed dashboard data
 */
export const buildDashboardAnalytics = ({ consultations, results, vitals, patients }) => {
  // Get latest records per patient
  const latestConsultations = getLatestByUser(consultations, 'uuid', 'date_of_check');
  const latestResults = getLatestByUser(results, 'user_uuid', 'created_at');
  const latestVitals = getLatestByUser(vitals, 'user_uuid', 'date_of_check');

  // Convert to arrays
  const latestConsultationsArray = Object.values(latestConsultations);
  const latestResultsArray = Object.values(latestResults);
  const latestVitalsArray = Object.values(latestVitals);

  // Build patient name lookup
  const patientNameMap = createPatientNameMap(patients);

  // Build patient risk map (used for multiple calculations)
  const patientRiskMap = buildPatientRiskMap(
    latestConsultationsArray, 
    latestVitalsArray, 
    latestResultsArray
  );

  // Calculate KPIs
  const kpis = calculateKPIs(latestVitalsArray, latestResultsArray);

  // Build risk stratification
  const riskStratification = buildRiskStratification(
    latestConsultationsArray,
    latestVitalsArray,
    latestResultsArray,
    patientRiskMap
  );

  // Build chronic factors chart data
  const chronicFactors = buildChronicFactors(latestConsultationsArray);

  // Build lipid profile chart data
  const lipidProfile = buildLipidProfile(latestResultsArray);

  // Build BMI vs BP scatter data
  const bmiVsBP = buildBmiVsBP(latestVitalsArray);

  // Build at-risk cohort table data
  const atRiskCohort = buildAtRiskCohort(
    latestVitalsArray,
    latestResultsArray,
    latestConsultationsArray,
    patientNameMap,
    patientRiskMap
  );

  // Build department risk mix
  const departmentRiskMix = buildDepartmentRiskMix(patients, patientRiskMap);

  // Build department chronic risk mix
  const departmentChronicRiskMix = buildDepartmentChronicRiskMix(patients, latestConsultations);

  return {
    ...kpis,
    riskStratification,
    chronicFactors,
    lipidProfile,
    bmiVsBP,
    atRiskCohort,
    departmentRiskMix,
    departmentChronicRiskMix
  };
};

/**
 * Build patient risk map from all health records
 */
const buildPatientRiskMap = (consultations, vitals, results) => {
  const patientRiskMap = {};

  // Check consultations first (medical_clearance takes priority)
  consultations.forEach(consultation => {
    const uuid = consultation.uuid;
    const clearance = consultation.medical_clearance;
    
    if (clearance && clearance !== RISK_LEVELS.NORMAL) {
      patientRiskMap[uuid] = clearance;
    }
  });

  // Check vitals for risk
  vitals.forEach(vital => {
    const uuid = vital.user_uuid;
    const { risk } = calculateVitalRisk(vital);
    
    if (risk === RISK_LEVELS.CRITICAL && patientRiskMap[uuid] !== RISK_LEVELS.CRITICAL) {
      patientRiskMap[uuid] = RISK_LEVELS.CRITICAL;
    } else if (risk === RISK_LEVELS.AT_RISK && !patientRiskMap[uuid]) {
      patientRiskMap[uuid] = RISK_LEVELS.AT_RISK;
    }
  });

  // Check lab results for risk
  results.forEach(result => {
    const uuid = result.user_uuid;
    const { risk } = calculateLabRisk(result);
    
    if (risk === RISK_LEVELS.CRITICAL && patientRiskMap[uuid] !== RISK_LEVELS.CRITICAL) {
      patientRiskMap[uuid] = RISK_LEVELS.CRITICAL;
    } else if (risk === RISK_LEVELS.AT_RISK && !patientRiskMap[uuid]) {
      patientRiskMap[uuid] = RISK_LEVELS.AT_RISK;
    }
  });

  return patientRiskMap;
};

/**
 * Calculate KPI values
 */
const calculateKPIs = (vitals, results) => {
  let hypertensiveCount = 0;
  let criticalLDLCount = 0;
  let diabeticWatchCount = 0;
  let obesityCount = 0;

  vitals.forEach(vital => {
    if (isHypertensive(vital)) hypertensiveCount++;
    if (isObese(vital)) obesityCount++;
  });

  results.forEach(result => {
    if (hasCriticalLDL(result)) criticalLDLCount++;
    if (isDiabeticWatch(result)) diabeticWatchCount++;
  });

  return { hypertensiveCount, criticalLDLCount, diabeticWatchCount, obesityCount };
};

/**
 * Build risk stratification pie chart data
 */
const buildRiskStratification = (consultations, vitals, results, patientRiskMap) => {
  const allPatientUUIDs = new Set([
    ...consultations.map(c => c.uuid),
    ...vitals.map(v => v.user_uuid),
    ...results.map(r => r.user_uuid)
  ]);

  const riskCounts = {
    [RISK_LEVELS.NORMAL]: 0,
    [RISK_LEVELS.AT_RISK]: 0,
    [RISK_LEVELS.CRITICAL]: 0
  };

  allPatientUUIDs.forEach(uuid => {
    const risk = patientRiskMap[uuid] || RISK_LEVELS.NORMAL;
    riskCounts[risk]++;
  });

  return [
    { name: RISK_LEVELS.NORMAL, value: riskCounts[RISK_LEVELS.NORMAL], color: RISK_COLORS[RISK_LEVELS.NORMAL] },
    { name: RISK_LEVELS.AT_RISK, value: riskCounts[RISK_LEVELS.AT_RISK], color: RISK_COLORS[RISK_LEVELS.AT_RISK] },
    { name: RISK_LEVELS.CRITICAL, value: riskCounts[RISK_LEVELS.CRITICAL], color: RISK_COLORS[RISK_LEVELS.CRITICAL] }
  ];
};

/**
 * Build chronic factors bar chart data
 */
const buildChronicFactors = (consultations) => {
  const factorCounts = {};

  consultations.forEach(consultation => {
    const factors = normalizeChronicFactors(consultation.chronic_risk_factor);
    factors.forEach(factor => {
      factorCounts[factor] = (factorCounts[factor] || 0) + 1;
    });
  });

  return Object.entries(factorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
};

/**
 * Build lipid profile radar chart data
 */
const buildLipidProfile = (results) => {
  const lipidValues = {
    'Total Chol': [],
    'HDL': [],
    'LDL': [],
    'Triglycerides': []
  };

  results.forEach(result => {
    const lipids = extractLipidProfile(result);
    if (lipids.totalChol) lipidValues['Total Chol'].push(lipids.totalChol);
    if (lipids.hdl) lipidValues['HDL'].push(lipids.hdl);
    if (lipids.ldl) lipidValues['LDL'].push(lipids.ldl);
    if (lipids.triglycerides) lipidValues['Triglycerides'].push(lipids.triglycerides);
  });

  return [
    {
      metric: 'Total Chol',
      'Avg Student': Math.round(calculateAverage(lipidValues['Total Chol'])),
      'Healthy Limit': RISK_THRESHOLDS.LIPID.TOTAL_CHOL,
    },
    {
      metric: 'HDL',
      'Avg Student': Math.round(calculateAverage(lipidValues['HDL'])),
      'Healthy Limit': RISK_THRESHOLDS.LIPID.HDL,
    },
    {
      metric: 'LDL',
      'Avg Student': Math.round(calculateAverage(lipidValues['LDL'])),
      'Healthy Limit': RISK_THRESHOLDS.LIPID.LDL,
    },
    {
      metric: 'Triglycerides',
      'Avg Student': Math.round(calculateAverage(lipidValues['Triglycerides'])),
      'Healthy Limit': RISK_THRESHOLDS.LIPID.TRIGLYCERIDES,
    }
  ];
};

/**
 * Build BMI vs BP scatter plot data
 */
const buildBmiVsBP = (vitals) => {
  return vitals
    .map(vital => {
      const { systolic } = parseBloodPressure(vital);
      const bmi = parseFloat(vital.bmi);
      
      return {
        bmi,
        systolic,
        user_uuid: vital.user_uuid
      };
    })
    .filter(v => !isNaN(v.bmi) && v.bmi > 0 && !isNaN(v.systolic) && v.systolic > 0);
};

/**
 * Build at-risk cohort table data
 */
const buildAtRiskCohort = (vitals, results, consultations, patientNameMap, patientRiskMap) => {
  const userDataMap = {};

  const updateUserData = (uuid, status, factor, checkupDate) => {
    if (!userDataMap[uuid]) {
      userDataMap[uuid] = {
        uuid,
        name: patientNameMap[uuid] || 'Unknown Patient',
        status,
        chronicFactors: [factor],
        lastCheckup: checkupDate
      };
    } else {
      // Update to higher risk level if needed
      if (status === RISK_LEVELS.CRITICAL && userDataMap[uuid].status !== RISK_LEVELS.CRITICAL) {
        userDataMap[uuid].status = RISK_LEVELS.CRITICAL;
      } else if (status === RISK_LEVELS.AT_RISK && userDataMap[uuid].status === RISK_LEVELS.NORMAL) {
        userDataMap[uuid].status = RISK_LEVELS.AT_RISK;
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

  // Process vitals
  vitals.forEach(vital => {
    const { risk, factors } = calculateVitalRisk(vital);
    if (risk !== RISK_LEVELS.NORMAL) {
      factors.forEach(factor => {
        updateUserData(vital.user_uuid, risk, factor, vital.date_of_check);
      });
    }
  });

  // Process results
  results.forEach(result => {
    const { risk, factors } = calculateLabRisk(result);
    if (risk !== RISK_LEVELS.NORMAL) {
      factors.forEach(factor => {
        updateUserData(result.user_uuid, risk, factor, result.created_at);
      });
    }
  });

  // Process consultations
  consultations.forEach(consultation => {
    const clearance = consultation.medical_clearance;
    if (clearance === RISK_LEVELS.CRITICAL || clearance === RISK_LEVELS.AT_RISK) {
      const factors = normalizeChronicFactors(consultation.chronic_risk_factor);
      const factorText = factors.length > 0 
        ? factors.join(', ') 
        : (clearance === RISK_LEVELS.CRITICAL ? 'Critical Condition' : 'At Risk Condition');
      
      updateUserData(consultation.uuid, clearance, factorText, consultation.date_of_check);
    }
  });

  // Filter and format
  return Object.values(userDataMap)
    .filter(patient => {
      const riskFromMap = patientRiskMap[patient.uuid];
      return (patient.status === RISK_LEVELS.AT_RISK || patient.status === RISK_LEVELS.CRITICAL || 
              riskFromMap === RISK_LEVELS.AT_RISK || riskFromMap === RISK_LEVELS.CRITICAL);
    })
    .map(patient => {
      const finalStatus = (patientRiskMap[patient.uuid] === RISK_LEVELS.CRITICAL || patient.status === RISK_LEVELS.CRITICAL) 
        ? RISK_LEVELS.CRITICAL 
        : (patientRiskMap[patient.uuid] === RISK_LEVELS.AT_RISK || patient.status === RISK_LEVELS.AT_RISK)
        ? RISK_LEVELS.AT_RISK
        : patient.status;
      
      return {
        ...patient,
        status: finalStatus,
        chronicFactor: patient.chronicFactors.join(', ')
      };
    })
    .sort((a, b) => {
      if (a.status === RISK_LEVELS.CRITICAL && b.status !== RISK_LEVELS.CRITICAL) return -1;
      if (a.status !== RISK_LEVELS.CRITICAL && b.status === RISK_LEVELS.CRITICAL) return 1;
      return 0;
    });
};

/**
 * Build department risk mix chart data
 */
const buildDepartmentRiskMix = (patients, patientRiskMap) => {
  const departmentRiskCounts = {};

  patients.forEach(pt => {
    const uuid = pt.uuid;
    const dept = pt.department || 'Unknown';
    const risk = patientRiskMap[uuid] || RISK_LEVELS.NORMAL;

    if (!departmentRiskCounts[dept]) {
      departmentRiskCounts[dept] = { green: 0, yellow: 0, red: 0, total: 0 };
    }

    const bucket = risk === RISK_LEVELS.CRITICAL ? 'red' 
                 : risk === RISK_LEVELS.AT_RISK ? 'yellow' 
                 : 'green';

    departmentRiskCounts[dept][bucket] += 1;
    departmentRiskCounts[dept].total += 1;
  });

  return Object.entries(departmentRiskCounts)
    .map(([department, counts]) => {
      const { green, yellow, red, total } = counts;
      if (!total) return { department, green: 0, yellow: 0, red: 0 };
      return {
        department,
        green: green / total,
        yellow: yellow / total,
        red: red / total,
      };
    })
    .sort((a, b) => {
      if (b.red !== a.red) return b.red - a.red;
      return b.yellow - a.yellow;
    });
};

/**
 * Build department chronic risk factor distribution
 */
const buildDepartmentChronicRiskMix = (patients, latestConsultationsMap) => {
  const departmentChronicCounts = {};

  patients.forEach(pt => {
    const dept = pt.department || 'Unknown';
    const uuid = pt.uuid;
    const consultation = latestConsultationsMap[uuid];

    if (!departmentChronicCounts[dept]) {
      departmentChronicCounts[dept] = {
        smoking: 0, drinking: 0, hypertension: 0, diabetes: 0, none: 0, total: 0
      };
    }

    if (consultation?.chronic_risk_factor) {
      const factorString = String(consultation.chronic_risk_factor).toLowerCase();

      if (factorString.includes('smoking')) {
        departmentChronicCounts[dept].smoking += 1;
      } else if (factorString.includes('drinking')) {
        departmentChronicCounts[dept].drinking += 1;
      } else if (factorString.includes('hypertension')) {
        departmentChronicCounts[dept].hypertension += 1;
      } else if (factorString.includes('diabetes')) {
        departmentChronicCounts[dept].diabetes += 1;
      } else {
        departmentChronicCounts[dept].none += 1;
      }
    } else {
      departmentChronicCounts[dept].none += 1;
    }

    departmentChronicCounts[dept].total += 1;
  });

  return Object.entries(departmentChronicCounts)
    .map(([department, counts]) => {
      const { smoking, drinking, hypertension, diabetes, none, total } = counts;
      if (!total) return { department, smoking: 0, drinking: 0, hypertension: 0, diabetes: 0, none: 0 };
      return {
        department,
        smoking: smoking / total,
        drinking: drinking / total,
        hypertension: hypertension / total,
        diabetes: diabetes / total,
        none: none / total,
      };
    })
    .sort((a, b) => {
      const aRisk = a.smoking + a.drinking + a.hypertension + a.diabetes;
      const bRisk = b.smoking + b.drinking + b.hypertension + b.diabetes;
      return bRisk - aRisk;
    });
};

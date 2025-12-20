/**
 * Domain Layer: Risk Rules & Thresholds
 * Contains all medical risk classification constants and calculation logic
 */

// ========== RISK THRESHOLDS ==========
export const RISK_THRESHOLDS = {
  // Blood Pressure Thresholds (mmHg)
  BP: {
    CRITICAL_SYSTOLIC: 160,
    CRITICAL_DIASTOLIC: 100,
    AT_RISK_SYSTOLIC: 140,
    AT_RISK_DIASTOLIC: 90
  },
  
  // BMI Thresholds (kg/m²)
  BMI: {
    CRITICAL: 35,
    AT_RISK: 30
  },
  
  // LDL Cholesterol Thresholds (mg/dL)
  LDL: {
    CRITICAL: 160,
    AT_RISK: 130
  },
  
  // HbA1c Thresholds (%)
  HBA1C: {
    CRITICAL: 8,
    AT_RISK: 6.5
  },
  
  // Lipid Profile Healthy Limits (mg/dL)
  LIPID: {
    TOTAL_CHOL: 200,
    HDL: 60,
    LDL: 100,
    TRIGLYCERIDES: 150
  }
};

// ========== RISK LEVELS ==========
export const RISK_LEVELS = {
  NORMAL: 'Normal',
  AT_RISK: 'At Risk',
  CRITICAL: 'Critical'
};

// ========== RISK COLORS ==========
export const RISK_COLORS = {
  [RISK_LEVELS.NORMAL]: '#22c55e',    // Green
  [RISK_LEVELS.AT_RISK]: '#f59e0b',   // Yellow/Amber
  [RISK_LEVELS.CRITICAL]: '#ef4444'   // Red
};

// ========== CHART COLOR SCHEME ==========
export const CHART_COLORS = {
  PRIMARY: '#0033A0',
  CHRONIC_FACTORS: {
    SMOKING: '#8b5cf6',
    DRINKING: '#ec4899',
    HYPERTENSION: '#ef4444',
    DIABETES: '#f59e0b',
    NONE: '#22c55e'
  }
};

/**
 * Calculate patient risk level from vitals data
 * @param {Object} vital - Vital signs record
 * @returns {{ risk: string, factors: string[] }}
 */
export const calculateVitalRisk = (vital) => {
  const factors = [];
  let risk = RISK_LEVELS.NORMAL;

  // Parse blood pressure
  let systolic, diastolic;
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

  // Check BP thresholds
  if (systolic && diastolic) {
    if (systolic > RISK_THRESHOLDS.BP.CRITICAL_SYSTOLIC || diastolic > RISK_THRESHOLDS.BP.CRITICAL_DIASTOLIC) {
      risk = RISK_LEVELS.CRITICAL;
      factors.push(`BP: ${systolic}/${diastolic}`);
    } else if (systolic > RISK_THRESHOLDS.BP.AT_RISK_SYSTOLIC || diastolic > RISK_THRESHOLDS.BP.AT_RISK_DIASTOLIC) {
      if (risk !== RISK_LEVELS.CRITICAL) risk = RISK_LEVELS.AT_RISK;
      factors.push(`BP: ${systolic}/${diastolic}`);
    }
  }

  // Check BMI thresholds
  if (bmi) {
    if (bmi > RISK_THRESHOLDS.BMI.CRITICAL) {
      risk = RISK_LEVELS.CRITICAL;
      factors.push(`BMI: ${vital.bmi}`);
    } else if (bmi > RISK_THRESHOLDS.BMI.AT_RISK) {
      if (risk !== RISK_LEVELS.CRITICAL) risk = RISK_LEVELS.AT_RISK;
      factors.push(`BMI: ${vital.bmi}`);
    }
  }

  return { risk, factors };
};

/**
 * Calculate patient risk level from lab results
 * @param {Object} result - Lab result record
 * @returns {{ risk: string, factors: string[] }}
 */
export const calculateLabRisk = (result) => {
  const factors = [];
  let risk = RISK_LEVELS.NORMAL;

  const ldl = parseFloat(result.ldl);
  const hba1c = parseFloat(result.hba1c);

  // Check LDL thresholds
  if (ldl) {
    if (ldl > RISK_THRESHOLDS.LDL.CRITICAL) {
      risk = RISK_LEVELS.CRITICAL;
      factors.push(`LDL: ${result.ldl}`);
    } else if (ldl > RISK_THRESHOLDS.LDL.AT_RISK) {
      if (risk !== RISK_LEVELS.CRITICAL) risk = RISK_LEVELS.AT_RISK;
      factors.push(`LDL: ${result.ldl}`);
    }
  }

  // Check HbA1c thresholds
  if (hba1c) {
    if (hba1c > RISK_THRESHOLDS.HBA1C.CRITICAL) {
      risk = RISK_LEVELS.CRITICAL;
      factors.push(`HbA1c: ${result.hba1c}`);
    } else if (hba1c > RISK_THRESHOLDS.HBA1C.AT_RISK) {
      if (risk !== RISK_LEVELS.CRITICAL) risk = RISK_LEVELS.AT_RISK;
      factors.push(`HbA1c: ${result.hba1c}`);
    }
  }

  return { risk, factors };
};

/**
 * Calculate combined patient risk level
 * @param {Object} params - Patient data
 * @param {Object} params.vital - Latest vital record
 * @param {Object} params.result - Latest lab result
 * @param {Object} params.consultation - Latest consultation
 * @returns {{ risk: string, factors: string[] }}
 */
export const calculatePatientRisk = ({ vital, result, consultation }) => {
  let highestRisk = RISK_LEVELS.NORMAL;
  const allFactors = [];

  // Check consultation clearance first
  if (consultation?.medical_clearance && consultation.medical_clearance !== RISK_LEVELS.NORMAL) {
    highestRisk = consultation.medical_clearance;
    
    if (consultation.chronic_risk_factor) {
      const factorString = String(consultation.chronic_risk_factor);
      const factors = factorString.includes(',') 
        ? factorString.split(',').map(f => f.trim())
        : [factorString.trim()];
      
      const validFactors = factors.filter(f => 
        f && f.toLowerCase() !== 'none' && 
        f.toLowerCase() !== 'null' && 
        f.toLowerCase() !== 'n/a'
      );
      
      if (validFactors.length > 0) {
        allFactors.push(...validFactors);
      } else {
        allFactors.push(consultation.medical_clearance === RISK_LEVELS.CRITICAL 
          ? 'Critical Condition' 
          : 'At Risk Condition');
      }
    }
  }

  // Check vital risk
  if (vital) {
    const vitalRisk = calculateVitalRisk(vital);
    if (vitalRisk.risk === RISK_LEVELS.CRITICAL) {
      highestRisk = RISK_LEVELS.CRITICAL;
    } else if (vitalRisk.risk === RISK_LEVELS.AT_RISK && highestRisk === RISK_LEVELS.NORMAL) {
      highestRisk = RISK_LEVELS.AT_RISK;
    }
    allFactors.push(...vitalRisk.factors);
  }

  // Check lab risk
  if (result) {
    const labRisk = calculateLabRisk(result);
    if (labRisk.risk === RISK_LEVELS.CRITICAL) {
      highestRisk = RISK_LEVELS.CRITICAL;
    } else if (labRisk.risk === RISK_LEVELS.AT_RISK && highestRisk === RISK_LEVELS.NORMAL) {
      highestRisk = RISK_LEVELS.AT_RISK;
    }
    allFactors.push(...labRisk.factors);
  }

  return { risk: highestRisk, factors: allFactors };
};

/**
 * Check if patient is hypertensive
 * @param {Object} vital - Vital signs record
 * @returns {boolean}
 */
export const isHypertensive = (vital) => {
  let systolic, diastolic;
  
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

  return systolic > RISK_THRESHOLDS.BP.AT_RISK_SYSTOLIC || 
         diastolic > RISK_THRESHOLDS.BP.AT_RISK_DIASTOLIC;
};

/**
 * Check if patient is obese
 * @param {Object} vital - Vital signs record
 * @returns {boolean}
 */
export const isObese = (vital) => {
  const bmi = parseFloat(vital.bmi);
  return bmi > RISK_THRESHOLDS.BMI.AT_RISK;
};

/**
 * Check if patient has critical LDL
 * @param {Object} result - Lab result record
 * @returns {boolean}
 */
export const hasCriticalLDL = (result) => {
  const ldl = parseFloat(result.ldl);
  return ldl > RISK_THRESHOLDS.LDL.AT_RISK;
};

/**
 * Check if patient is diabetic watch
 * @param {Object} result - Lab result record
 * @returns {boolean}
 */
export const isDiabeticWatch = (result) => {
  const hba1c = parseFloat(result.hba1c);
  return hba1c > RISK_THRESHOLDS.HBA1C.AT_RISK;
};

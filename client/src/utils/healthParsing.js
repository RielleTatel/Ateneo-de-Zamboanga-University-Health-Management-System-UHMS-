/**
 * Utility Layer: Health Data Parsing
 * Contains functions for parsing and extracting health metrics from records
 */

/**
 * Parse blood pressure from various formats
 * @param {Object} vital - Vital signs record
 * @returns {{ systolic: number|null, diastolic: number|null }}
 */
export const parseBloodPressure = (vital) => {
  let systolic = null;
  let diastolic = null;

  // Handle BP from separate columns
  if (vital.systolic && vital.diastolic) {
    systolic = parseFloat(vital.systolic);
    diastolic = parseFloat(vital.diastolic);
  } 
  // Handle BP from combined string (e.g., "120/80")
  else if (vital.blood_pressure) {
    const parts = vital.blood_pressure.split('/');
    if (parts.length === 2) {
      systolic = parseFloat(parts[0]);
      diastolic = parseFloat(parts[1]);
    }
  }

  return { systolic, diastolic };
};

/**
 * Get the latest record per user from an array of records
 * @param {Array} records - Array of records
 * @param {string} uuidField - Field name containing user UUID
 * @param {string} dateField - Field name containing date
 * @returns {Object} Map of uuid -> latest record
 */
export const getLatestByUser = (records, uuidField = 'user_uuid', dateField = 'created_at') => {
  const latestMap = {};
  
  records.forEach(record => {
    const uuid = record[uuidField];
    const currentDate = new Date(record[dateField]);
    
    if (!latestMap[uuid] || currentDate > new Date(latestMap[uuid][dateField])) {
      latestMap[uuid] = record;
    }
  });
  
  return latestMap;
};

/**
 * Normalize chronic risk factors from consultation
 * Handles various formats and filters out invalid values
 * @param {string|null} rawFactor - Raw chronic risk factor value
 * @returns {string[]} Array of normalized factor names
 */
export const normalizeChronicFactors = (rawFactor) => {
  if (!rawFactor) return [];
  
  const factorString = String(rawFactor);
  const factors = factorString.includes(',') 
    ? factorString.split(',') 
    : [factorString];
  
  const INVALID_VALUES = ['none', 'null', 'n/a', 'undefined', ''];
  
  return factors
    .map(f => f.trim().toLowerCase())
    .filter(normalized => !INVALID_VALUES.includes(normalized))
    .map(normalized => normalized.charAt(0).toUpperCase() + normalized.slice(1));
};

/**
 * Calculate average of numeric array
 * @param {number[]} arr - Array of numbers
 * @returns {number} Average or 0 if empty
 */
export const calculateAverage = (arr) => {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date or 'N/A'
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Parse BMI value from vital record
 * @param {Object} vital - Vital signs record
 * @returns {number|null}
 */
export const parseBMI = (vital) => {
  const bmi = parseFloat(vital?.bmi);
  return !isNaN(bmi) ? bmi : null;
};

/**
 * Parse LDL value from lab result
 * @param {Object} result - Lab result record
 * @returns {number|null}
 */
export const parseLDL = (result) => {
  const ldl = parseFloat(result?.ldl);
  return !isNaN(ldl) ? ldl : null;
};

/**
 * Parse HbA1c value from lab result
 * @param {Object} result - Lab result record
 * @returns {number|null}
 */
export const parseHbA1c = (result) => {
  const hba1c = parseFloat(result?.hba1c);
  return !isNaN(hba1c) ? hba1c : null;
};

/**
 * Extract lipid profile values from lab result
 * @param {Object} result - Lab result record
 * @returns {Object} Lipid profile values
 */
export const extractLipidProfile = (result) => {
  return {
    totalChol: result?.tchol ? parseFloat(result.tchol) : null,
    hdl: result?.hdl ? parseFloat(result.hdl) : null,
    ldl: result?.ldl ? parseFloat(result.ldl) : null,
    triglycerides: result?.trig ? parseFloat(result.trig) : null
  };
};

/**
 * Create patient name lookup map
 * @param {Array} patients - Array of patient records
 * @returns {Object} Map of uuid -> patient name
 */
export const createPatientNameMap = (patients) => {
  const nameMap = {};
  
  patients.forEach(patient => {
    nameMap[patient.uuid] = patient.name || 
      `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 
      'Unknown';
  });
  
  return nameMap;
};

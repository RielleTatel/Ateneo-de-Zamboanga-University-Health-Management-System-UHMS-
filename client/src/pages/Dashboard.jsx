import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/layout/navigation.jsx';
import UserNav from '@/components/layout/userNav.jsx';
import { Activity, FileText } from 'lucide-react';

// API Layer
import {
  fetchAllConsultations,
  fetchAllResults,
  fetchAllVitals,
  fetchAllPatients
} from '@/api/dashboard.api';

// Service Layer
import { buildDashboardAnalytics } from '@/services/dashboardAnalytics';

// UI Components
import {
  KpiCards,
  RiskStratificationChart,
  ChronicFactorsChart,
  DepartmentRiskChart,
  DepartmentChronicChart,
  AtRiskCohortTable
} from '@/components/layout/dashboard';

// ========== QUERY KEYS ==========
const QUERY_KEYS = {
  CONSULTATIONS: ['consultations'],
  RESULTS: ['results'],
  VITALS: ['vitals'],
  PATIENTS: ['patients']
};

// ========== LOADING COMPONENT ==========
const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Activity className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#0033A0' }} />
      <p className="text-gray-600">Loading health data...</p>
    </div>
  </div>
);

// ========== DATA SUMMARY COMPONENT ==========
const DataSummary = ({ patientCount }) => (
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
        {patientCount} unique patients • Latest records only
      </div>
    </div>
  </div>
);

// ========== MAIN DASHBOARD COMPONENT ==========
const Dashboard = () => {
  // Fetch all data using React Query
  const { data: consultations = [], isLoading: loadingConsultations } = useQuery({
    queryKey: QUERY_KEYS.CONSULTATIONS,
    queryFn: fetchAllConsultations,
    refetchOnWindowFocus: false
  });

  const { data: results = [], isLoading: loadingResults } = useQuery({
    queryKey: QUERY_KEYS.RESULTS,
    queryFn: fetchAllResults,
    refetchOnWindowFocus: false
  });

  const { data: vitals = [], isLoading: loadingVitals } = useQuery({
    queryKey: QUERY_KEYS.VITALS,
    queryFn: fetchAllVitals,
    refetchOnWindowFocus: false
  });

  const { data: patients = [], isLoading: loadingPatients } = useQuery({
    queryKey: QUERY_KEYS.PATIENTS,
    queryFn: fetchAllPatients,
    refetchOnWindowFocus: false
  });

  const isLoading = loadingConsultations || loadingResults || loadingVitals || loadingPatients;

  // Process data using memoization
  const dashboardData = useMemo(() => {
    if (isLoading) return null;
    
    return buildDashboardAnalytics({
      consultations,
      results,
      vitals,
      patients
    });
  }, [consultations, results, vitals, patients, isLoading]);

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
              <LoadingState />
            ) : dashboardData && (
              <>
                {/* Section 1: Top KPI Cards */}
                <KpiCards data={dashboardData} />

                {/* Section 2: Population Health Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <RiskStratificationChart data={dashboardData.riskStratification} />
                  <ChronicFactorsChart data={dashboardData.chronicFactors} />
                </div>

                {/* Section 3: Deep Dive Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <DepartmentChronicChart data={dashboardData.departmentChronicRiskMix} />
                  <DepartmentRiskChart data={dashboardData.departmentRiskMix} />
                </div>

                {/* Section 4: At-Risk Cohort Table */}
                <AtRiskCohortTable data={dashboardData.atRiskCohort} />

                {/* Data Summary Footer */}
                <DataSummary patientCount={patients.length} />
              </>
            )}
          </div>
        </div>
      </div>
    </div> 
  );
};

export default Dashboard;

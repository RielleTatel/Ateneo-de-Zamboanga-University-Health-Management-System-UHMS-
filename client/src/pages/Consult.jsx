import React, { useState, useCallback } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";

import { VitalsField, LabFields, ConsultationNotes } from "@/components/layout/consultation/ConsultationField";
import ProfileHeader from "@/components/layout/profileHeader";
import Navigation from "@/components/layout/navigation"; 

const Consult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { canAccessConsultation } = useAuth();
    
    // Get the selected components from navigation state
    const { 
        recordId, 
        recordName, 
        recordPosition, 
        recordDepartment, 
        selectedComponents = [] 
    } = location.state || {};

    // Filter out consultation if user doesn't have access
    const allowedComponents = selectedComponents.filter(component => {
        if (component === 'consultation' && !canAccessConsultation()) {
            return false;
        }
        return true;
    });

    // State to hold data from each component
    const [vitalsData, setVitalsData] = useState(null);
    const [labData, setLabData] = useState(null);
    const [consultationData, setConsultationData] = useState(null);

    // Use useCallback to memoize the callback functions
    const handleVitalsChange = useCallback((data) => {
        setVitalsData(data);
    }, []);

    const handleLabChange = useCallback((data) => {
        setLabData(data);
    }, []);

    const handleConsultationChange = useCallback((data) => {
        setConsultationData(data);
    }, []);

    // Mutations for creating records
    const createVitalMutation = useMutation({
        mutationFn: (data) => axiosInstance.post('/vitals/add', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['vitals', recordId]);
        }
    });

    const createLabMutation = useMutation({
        mutationFn: (data) => axiosInstance.post('/results/add', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['results', recordId]);
        }
    });

    const createConsultationMutation = useMutation({
        mutationFn: (data) => axiosInstance.post('/consultations/create', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['consultations', recordId]);
        }
    });

    // Component mapping
    const componentMap = {
        'vitals': { 
            component: VitalsField, 
            title: 'Vitals',
            onDataChange: handleVitalsChange
        },
        'lab': { 
            component: LabFields, 
            title: 'Laboratory Tests',
            onDataChange: handleLabChange
        },
        ...(canAccessConsultation() && {
            'consultation': { 
                component: ConsultationNotes, 
                title: 'Consultation Notes',
                onDataChange: handleConsultationChange
            }
        })
    };

    const handleSaveConsultation = async () => {
        try {
            const promises = [];
            const warnings = [];

            // Check vitals if component was selected
            if (allowedComponents.includes('vitals') && vitalsData) {
                if (vitalsData._meta) {
                    if (vitalsData._meta.emptyFieldCount > 0) {
                        warnings.push(`Vitals: ${vitalsData._meta.emptyFieldCount} field(s) left empty`);
                    }
                    if (vitalsData._meta.hasData) {
                        console.log('Saving vitals:', vitalsData);
                        promises.push(createVitalMutation.mutateAsync(vitalsData));
                    }
                }
            }

            // Check lab results if component was selected
            if (allowedComponents.includes('lab') && labData) {
                if (labData._meta) {
                    if (labData._meta.hasData) {
                        console.log('Saving lab results:', labData);
                        promises.push(createLabMutation.mutateAsync(labData));
                    }
                }
            }

            // Check consultation if component was selected
            if (allowedComponents.includes('consultation') && consultationData && canAccessConsultation()) {
                if (consultationData._meta) {
                    if (consultationData._meta.emptyFieldCount > 0) {
                        warnings.push(`Consultation: ${consultationData._meta.emptyFieldCount} field(s) left empty`);
                    }
                    if (consultationData._meta.hasData) {
                        console.log('Saving consultation:', consultationData);
                        promises.push(createConsultationMutation.mutateAsync(consultationData));
                    }
                }
            }

            // Show warnings if there are empty fields
            if (warnings.length > 0) {
                const warningMessage = "The following sections have empty fields:\n\n" + 
                    warnings.join('\n') + 
                    "\n\nDo you want to continue saving?";
                
                if (!window.confirm(warningMessage)) {
                    return; // User cancelled
                }
            }

            // Check if there's any data to save
            if (promises.length === 0) {
                alert('No data to save. Please fill in at least some fields.');
                return;
            }

            await Promise.all(promises);

            alert('Consultation saved successfully!');
            navigate('/records');
        } catch (error) {
            console.error('Error saving consultation:', error);
            alert('Error saving consultation: ' + (error.response?.data?.error || error.message));
        }
    };

    const renderSelectedComponents = () => {
        if (!allowedComponents || allowedComponents.length === 0) {
            return (
                <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500 text-lg">
                        {selectedComponents.includes('consultation') && !canAccessConsultation()
                            ? 'You do not have permission to access consultation notes. Only doctors and admins can access this component.'
                            : 'No check-up components selected. Please go back and select components.'}
                    </p>
                    <Button 
                        className="mt-4 bg-blue-500 hover:bg-blue-600"
                        onClick={() => navigate('/records')}
                    >
                        Back to Records
                    </Button>
                </div>
            );
        }

        return allowedComponents.map((componentKey) => {
            const componentData = componentMap[componentKey];
            if (componentData) {
                const Component = componentData.component;
                return (
                    <div key={componentKey}>
                        <Component 
                            recordId={recordId} 
                            onDataChange={componentData.onDataChange}
                        />
                    </div>
                );
            }
            return null;
        });
    };

    const isLoading = createVitalMutation.isPending || 
                     createLabMutation.isPending || 
                     createConsultationMutation.isPending;

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">

            {/* 1st half of the screen */}
            <Navigation/> 

            {/* 2nd part of the screen */}
            <div className="flex-1 flex-col p-4"> 
                <div className="min-w-full p-1 flex items-center justify-between"> 
                    <p className="text-[20px]"> <b> Consultation </b> </p>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate('/records')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Records
                    </Button>
                </div> 

                <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">  
                    <ProfileHeader 
                        recordId={recordId}
                        patientName={recordName}
                        patientPosition={recordPosition}
                        patientDepartment={recordDepartment}
                    />  
                    
                    <div className="text-center mb-6"> 
                        <h1 className="text-2xl font-bold"> Consultation Actions </h1>
                        {recordName && (
                            <p className="text-gray-600 mt-2">
                                {recordPosition} • {recordDepartment}
                            </p>
                        )}
                        {allowedComponents.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                Selected Components: {allowedComponents.map(comp => componentMap[comp]?.title).join(', ')}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-6"> 
                        {renderSelectedComponents()}
                    </div>

                    {allowedComponents.length > 0 && (
                        <div className="flex justify-end gap-4 mt-6">
                            <Button 
                                variant="outline"
                                onClick={() => navigate('/records')}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                                onClick={handleSaveConsultation}
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isLoading ? 'Saving...' : 'Save Consultation'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Consult; 

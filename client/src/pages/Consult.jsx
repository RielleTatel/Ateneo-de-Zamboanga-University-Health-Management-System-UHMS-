import React, { useState } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

import { VitalsField, LabFields, ConsultationNotes } from "@/components/layout/consultation/ConsultationField";
import ProfileHeader from "@/components/layout/profileHeader";
import Navigation from "@/components/layout/navigation"; 

const Consult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // Get the selected components from navigation state
    const { 
        recordId, 
        recordName, 
        recordPosition, 
        recordDepartment, 
        selectedComponents = [] 
    } = location.state || {};

    // State to hold data from each component
    const [vitalsData, setVitalsData] = useState(null);
    const [labData, setLabData] = useState(null);
    const [consultationData, setConsultationData] = useState(null);

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
            onDataChange: setVitalsData
        },
        'lab': { 
            component: LabFields, 
            title: 'Laboratory Tests',
            onDataChange: setLabData
        },
        'consultation': { 
            component: ConsultationNotes, 
            title: 'Consultation Notes',
            onDataChange: setConsultationData
        }
    };

    const handleSaveConsultation = async () => {
        try {
            const promises = [];

            // Save vitals if component was selected
            if (selectedComponents.includes('vitals') && vitalsData) {
                console.log('Saving vitals:', vitalsData);
                promises.push(createVitalMutation.mutateAsync(vitalsData));
            }

            // Save lab results if component was selected (with custom fields support)
            if (selectedComponents.includes('lab') && labData) {
                console.log('Saving lab results:', labData);
                promises.push(createLabMutation.mutateAsync(labData));
            }

            // Save consultation if component was selected
            if (selectedComponents.includes('consultation') && consultationData) {
                console.log('Saving consultation:', consultationData);
                promises.push(createConsultationMutation.mutateAsync(consultationData));
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
        if (!selectedComponents || selectedComponents.length === 0) {
            return (
                <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-500 text-lg">
                        No check-up components selected. Please go back and select components.
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

        return selectedComponents.map((componentKey) => {
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
                        {selectedComponents.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                Selected Components: {selectedComponents.map(comp => componentMap[comp]?.title).join(', ')}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-y-6"> 
                        {renderSelectedComponents()}
                    </div>

                    {selectedComponents.length > 0 && (
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

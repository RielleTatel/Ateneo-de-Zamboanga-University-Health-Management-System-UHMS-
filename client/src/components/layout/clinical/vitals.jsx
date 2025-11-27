import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger, 
    DialogFooter, 
    DialogDescription } from "@/components/ui/dialog";
import { Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Plus, AlertCircle, Download } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// API Functions
const fetchVitalsByPatient = async (uuid) => {
    const { data } = await axiosInstance.get(`/vitals/patient/${uuid}`);
    return data.vitals;
};

const addVital = async (vitalData) => {
    const { data } = await axiosInstance.post("/vitals/add", vitalData);
    return data;
};

const deleteVital = async (vital_id) => {
    const { data } = await axiosInstance.delete(`/vitals/delete/${vital_id}`);
    return data;
};

const Vitals = ({ recordId }) => {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newVital, setNewVital] = useState({
        date_of_check: new Date().toISOString().split('T')[0],
        blood_pressure: '',
        temperature: '',
        heart_rate: '',
        respiratory_rate: '',
        weight: '',
        height: '',
        bmi: ''
    });

    // Fetch vitals for the patient
    const { 
        data: vitals = [], 
        isLoading,
        error 
    } = useQuery({
        queryKey: ["vitals", recordId],
        queryFn: () => fetchVitalsByPatient(recordId),
        enabled: !!recordId,
        refetchOnWindowFocus: false
    });

    // Add vital mutation
    const addVitalMutation = useMutation({
        mutationFn: addVital,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vitals", recordId] });
            setIsAddModalOpen(false);
            setNewVital({
                date_of_check: new Date().toISOString().split('T')[0],
                blood_pressure: '',
                temperature: '',
                heart_rate: '',
                respiratory_rate: '',
                weight: '',
                height: '',
                bmi: ''
            });
        }
    });

    // Delete vital mutation
    const deleteVitalMutation = useMutation({
        mutationFn: deleteVital,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vitals", recordId] });
        }
    });

    const handleAddVital = () => {
        // Calculate BMI if weight and height are provided
        let calculatedBMI = newVital.bmi;
        if (newVital.weight && newVital.height) {
            const weightKg = parseFloat(newVital.weight);
            const heightM = parseFloat(newVital.height) / 100; // convert cm to m
            calculatedBMI = (weightKg / (heightM * heightM)).toFixed(2);
        }

        const vitalData = {
            user_uuid: recordId,
            date_of_check: newVital.date_of_check,
            blood_pressure: newVital.blood_pressure || null,
            temperature: newVital.temperature ? parseFloat(newVital.temperature) : null,
            heart_rate: newVital.heart_rate ? parseInt(newVital.heart_rate) : null,
            respiratory_rate: newVital.respiratory_rate ? parseInt(newVital.respiratory_rate) : null,
            weight: newVital.weight ? parseFloat(newVital.weight) : null,
            height: newVital.height ? parseFloat(newVital.height) : null,
            bmi: calculatedBMI ? parseFloat(calculatedBMI) : null
        };

        addVitalMutation.mutate(vitalData);
    };

    const handleDeleteVital = (vital_id) => {
        if (window.confirm("Are you sure you want to delete this vital record?")) {
            deleteVitalMutation.mutate(vital_id);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
        });
    };

    // Group vitals by measurement type
    const vitalTypes = [
        { label: 'Blood Pressure', key: 'blood_pressure', unit: 'mmHg' },
        { label: 'Temperature', key: 'temperature', unit: '°C' },
        { label: 'Heart Rate', key: 'heart_rate', unit: 'bpm' },
        { label: 'Respiratory Rate', key: 'respiratory_rate', unit: 'breaths/min' },
        { label: 'Weight', key: 'weight', unit: 'kg' },
        { label: 'Height', key: 'height', unit: 'cm' },
        { label: 'BMI', key: 'bmi', unit: 'kg/m²' }
    ];

    if (isLoading) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-container p-6">
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Loading vitals data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-container p-6">
                <div className="flex items-center justify-center p-12">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <span className="ml-3 text-red-500">Error loading vitals: {error.message}</span>
                </div>
            </div>
        );
     }

    // Sort vitals by date (most recent first) and limit to last 5 records for display
    const sortedVitals = [...vitals].sort((a, b) => 
        new Date(b.date_of_check) - new Date(a.date_of_check)
    ).slice(0, 5);

    return (
        <div className="bg-white rounded-[23px] border-2 border-container p-6"> 
            {/* Component Header */}
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">
                <p className="text-xl font-bold">Vitals</p>
                <div className="flex gap-2 flex-wrap"> 
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Vital Record</DialogTitle>
                                <DialogDescription>
                                    Enter the patient's vital signs for this checkup.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date of Check</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newVital.date_of_check}
                                        onChange={(e) => setNewVital({ ...newVital, date_of_check: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bp">Blood Pressure (mmHg)</Label>
                                    <Input
                                        id="bp"
                                        placeholder="120/80"
                                        value={newVital.blood_pressure}
                                        onChange={(e) => setNewVital({ ...newVital, blood_pressure: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="temp">Temperature (°C)</Label>
                                    <Input
                                        id="temp"
                                        type="number"
                                        step="0.1"
                                        placeholder="36.5"
                                        value={newVital.temperature}
                                        onChange={(e) => setNewVital({ ...newVital, temperature: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hr">Heart Rate (bpm)</Label>
                                    <Input
                                        id="hr"
                                        type="number"
                                        placeholder="72"
                                        value={newVital.heart_rate}
                                        onChange={(e) => setNewVital({ ...newVital, heart_rate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rr">Respiratory Rate (breaths/min)</Label>
                                    <Input
                                        id="rr"
                                        type="number"
                                        placeholder="16"
                                        value={newVital.respiratory_rate}
                                        onChange={(e) => setNewVital({ ...newVital, respiratory_rate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.1"
                                        placeholder="65.0"
                                        value={newVital.weight}
                                        onChange={(e) => setNewVital({ ...newVital, weight: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        step="0.1"
                                        placeholder="170"
                                        value={newVital.height}
                                        onChange={(e) => setNewVital({ ...newVital, height: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bmi">BMI (kg/m²)</Label>
                                    <Input
                                        id="bmi"
                                        type="number"
                                        step="0.1"
                                        placeholder="Auto-calculated or enter manually"
                                        value={newVital.bmi}
                                        onChange={(e) => setNewVital({ ...newVital, bmi: e.target.value })}
                                    />
                                </div>
                            </div>
                            {addVitalMutation.isError && (
                                <div className="text-red-500 text-sm">
                                    Error: {addVitalMutation.error?.response?.data?.error || addVitalMutation.error?.message}
                                </div>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleAddVital}
                                    disabled={addVitalMutation.isPending}
                                >
                                    {addVitalMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Vital Record'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> 

                </div> 
            </div> 

            {/* Vitals Table */}
            <div className="overflow-x-auto">
                {sortedVitals.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No vital records found</p>
                        <p className="text-sm mt-2">Add a new vital record to get started</p>
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800 ">
                                <TableHead className="text-white font-semibold ">Vital Sign</TableHead>
                                {sortedVitals.map((vital) => (
                                    <TableHead key={vital.vitals_id} className="text-white font-semibold text-center min-w-32">
                                        <div className="flex flex-row justify-center items-center gap-x-3">
                                            <span>{formatDate(vital.date_of_check)}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteVital(vital.vitals_id)}
                                                disabled={deleteVitalMutation.isPending}
                                                className="h-6 w-6 p-0 mt-1 mx-auto text-red-400 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                </TableHead>
                            ))} 
                        </TableRow>
                    </TableHeader> 
                    <TableBody> 
                            {vitalTypes.map((type) => (
                                <TableRow key={type.key} className="hover:bg-gray-50 ">
                                    <TableCell className="font-medium">
                                        <div className="font-semibold">{type.label}</div>
                                        <div className="text-xs text-gray-500">{type.unit}</div>
                                    </TableCell>
                                    {sortedVitals.map((vital) => (
                                        <TableCell key={vital.vitals_id} className="text-center">
                                            {vital[type.key] || '-'}
                                    </TableCell>     
                                ))} 
                            </TableRow> 
                        ))}
                    </TableBody>
                </Table> 
                )}
            </div>

            {vitals.length > 5 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    Showing latest 5 of {vitals.length} records
                </div>
            )}
        </div>
    );
};

export default Vitals;

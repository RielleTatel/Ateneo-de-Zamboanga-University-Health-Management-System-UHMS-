import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive, Calendar, AlertTriangle } from "lucide-react";

// Mock data for initial vitals
const initialVitals = [
    {
        id: 1,
        dateTaken: '2025-09-03',
        bloodPressure: '120/80',
        temperature: '36.8',
        weight: '65',
        height: '170',
        heartRate: '72',
        respiratoryRate: '16',
        bmi: '22.5' // Calculated or stored
    }
];

// Blank form data
const blankForm = {
    dateTaken: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
    height: '',
    heartRate: '',
    respiratoryRate: ''
};

const Vitals = () => {
    const [vitalsRecords, setVitalsRecords] = useState(initialVitals);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVital, setSelectedVital] = useState(null);
    
    const [formData, setFormData] = useState(blankForm);
    const [errors, setErrors] = useState({});

    // --- Validation Functions ---
    const validateNumericInput = (value, min, max, fieldName) => {
        if (!value) return `${fieldName} is required`;
        const num = parseFloat(value);
        if (isNaN(num)) return `${fieldName} must be a valid number`;
        if (min !== undefined && num < min) return `${fieldName} must be at least ${min}`;
        if (max !== undefined && num > max) return `${fieldName} must be at most ${max}`;
        return '';
    };

    const validateBloodPressure = (value) => {
        if (!value) return 'Blood pressure is required';
        const bpPattern = /^\d{2,3}\/\d{2,3}$/;
        if (!bpPattern.test(value)) return 'Blood pressure must be in format: 120/80';
        
        const [systolic, diastolic] = value.split('/').map(Number);
        if (systolic < 70 || systolic > 250) return 'Systolic pressure must be between 70-250';
        if (diastolic < 40 || diastolic > 150) return 'Diastolic pressure must be between 40-150';
        if (systolic <= diastolic) return 'Systolic must be higher than diastolic';
        return '';
    };

    const validateForm = () => {
        const newErrors = {};
        const data = isEditing ? selectedVital : formData;
        
        if (!data.dateTaken) {
            newErrors.dateTaken = 'Date is required';
        } else {
            const takenDate = new Date(data.dateTaken);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize
            if (takenDate > today && takenDate.toDateString() !== today.toDateString()) {
                newErrors.dateTaken = 'Date cannot be in the future';
            }
        }
        
        const bpError = validateBloodPressure(data.bloodPressure);
        if (bpError) newErrors.bloodPressure = bpError;
        
        const tempError = validateNumericInput(data.temperature, 30, 45, 'Temperature');
        if (tempError) newErrors.temperature = tempError;
        
        const weightError = validateNumericInput(data.weight, 1, 500, 'Weight');
        if (weightError) newErrors.weight = weightError;
        
        const heightError = validateNumericInput(data.height, 30, 300, 'Height');
        if (heightError) newErrors.height = heightError;
        
        const hrError = validateNumericInput(data.heartRate, 30, 250, 'Heart rate');
        if (hrError) newErrors.heartRate = hrError;
        
        const rrError = validateNumericInput(data.respiratoryRate, 5, 60, 'Respiratory rate');
        if (rrError) newErrors.respiratoryRate = rrError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        const updater = isEditing ? setSelectedVital : setFormData;
        updater(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Calculate BMI
    const calculateBMI = (weight, height) => {
        if (!weight || !height || height <= 0) return 'N/A';
        const heightInMeters = parseFloat(height) / 100;
        const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const dataToSubmit = isEditing ? selectedVital : formData;
            const bmi = calculateBMI(dataToSubmit.weight, dataToSubmit.height);
            const finalData = { ...dataToSubmit, bmi };

            if (isEditing) {
                setVitalsRecords(vitalsRecords.map(v => v.id === finalData.id ? finalData : v));
                console.log('Vitals updated:', finalData);
            } else {
                setVitalsRecords([{ ...finalData, id: Date.now() }, ...vitalsRecords]);
                console.log('Vitals submitted:', finalData);
            }

            setIsAddModalOpen(false);
            setIsViewEditModalOpen(false);
            setIsEditing(false);
            setSelectedVital(null);
            setFormData(blankForm);
            setErrors({});
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setFormData(blankForm);
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleOpenViewModal = (vitals) => {
        setSelectedVital(vitals);
        setIsEditing(false);
        setIsViewEditModalOpen(true);
    };

    const handleOpenEditModal = (e, vitals) => {
        e.stopPropagation();
        setSelectedVital({ ...vitals });
        setIsEditing(true);
        setErrors({});
        setIsViewEditModalOpen(true);
    };

    const handleOpenArchiveModal = (e, vitals) => {
        e.stopPropagation();
        setSelectedVital(vitals);
        setIsArchiveModalOpen(true);
    };

    const handleArchive = () => {
        setVitalsRecords(vitalsRecords.filter(v => v.id !== selectedVital.id));
        setIsArchiveModalOpen(false);
        setSelectedVital(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        });
    };

    // Reusable Form
    const VitalsFormFields = ({ data, onInputChange }) => (

        <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
                <Field>
                    <FieldLabel>Date Taken *</FieldLabel>
                    <FieldContent>
                        <div className="relative">
                            <Input type="date" value={data.dateTaken} onChange={(e) => onInputChange('dateTaken', e.target.value)} className={errors.dateTaken ? 'border-red-500' : ''} />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.dateTaken && <p className="text-red-500 text-sm mt-1">{errors.dateTaken}</p>}
                    </FieldContent>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field><FieldLabel>Blood Pressure *</FieldLabel><FieldContent><Input placeholder="120/80" value={data.bloodPressure} onChange={(e) => onInputChange('bloodPressure', e.target.value)} className={errors.bloodPressure ? 'border-red-500' : ''} />{errors.bloodPressure && <p className="text-red-500 text-sm mt-1">{errors.bloodPressure}</p>}</FieldContent></Field>
                    <Field><FieldLabel>Temperature (°C) *</FieldLabel><FieldContent><Input type="number" step="0.1" min="30" max="45" placeholder="36.5" value={data.temperature} onChange={(e) => onInputChange('temperature', e.target.value)} className={errors.temperature ? 'border-red-500' : ''} />{errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}</FieldContent></Field>
                    <Field><FieldLabel>Weight (kg) *</FieldLabel><FieldContent><Input type="number" step="0.1" min="1" max="500" placeholder="65.0" value={data.weight} onChange={(e) => onInputChange('weight', e.target.value)} className={errors.weight ? 'border-red-500' : ''} />{errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}</FieldContent></Field>
                    <Field><FieldLabel>Height (cm) *</FieldLabel><FieldContent><Input type="number" step="0.1" min="30" max="300" placeholder="170.0" value={data.height} onChange={(e) => onInputChange('height', e.target.value)} className={errors.height ? 'border-red-500' : ''} />{errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}</FieldContent></Field>
                    <Field><FieldLabel>Heart Rate (bpm) *</FieldLabel><FieldContent><Input type="number" min="30" max="250" placeholder="72" value={data.heartRate} onChange={(e) => onInputChange('heartRate', e.target.value)} className={errors.heartRate ? 'border-red-500' : ''} />{errors.heartRate && <p className="text-red-500 text-sm mt-1">{errors.heartRate}</p>}</FieldContent></Field>
                    <Field><FieldLabel>Respiratory Rate *</FieldLabel><FieldContent><Input type="number" min="5" max="60" placeholder="16" value={data.respiratoryRate} onChange={(e) => onInputChange('respiratoryRate', e.target.value)} className={errors.respiratoryRate ? 'border-red-500' : ''} />{errors.respiratoryRate && <p className="text-red-500 text-sm mt-1">{errors.respiratoryRate}</p>}</FieldContent></Field>
                </div>
            </CardContent>
        </Card>
    );

    // Reusable View
    const VitalsRecordView = ({ vitals }) => (
        <Card>
            <CardHeader>
                <CardTitle>Vitals on {formatDate(vitals.dateTaken)}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="text-center sm:text-left"><p className="text-xs text-gray-500 mb-1">Blood Pressure</p><p className="font-medium text-gray-900">{vitals.bloodPressure} <span className="text-xs">mmHg</span></p></div>
                    <div className="text-center sm:text-left"><p className="text-xs text-gray-500 mb-1">Weight</p><p className="font-medium text-gray-900">{vitals.weight} <span className="text-xs">kg</span></p></div>
                    <div className="text-center sm:text-left"><p className="text-xs text-gray-500 mb-1">Height</p><p className="font-medium text-gray-900">{vitals.height} <span className="text-xs">cm</span></p></div>
                    <div className="text-center sm:text-left"><p className="text-xs text-gray-500 mb-1">BMI</p><p className="font-medium text-gray-900">{vitals.bmi}</p></div>
                    <div className="text-center sm:text-left"><p className="text-xs text-gray-500 mb-1">Heart Rate</p><p className="font-medium text-gray-900">{vitals.heartRate} <span className="text-xs">bpm</span></p></div>
                    <div className="text-center sm:text-left"><p className="text-xs text-gray-500 mb-1">Temperature</p><p className="font-medium text-gray-900">{vitals.temperature} <span className="text-xs">°C</span></p></div>
                    <div className="text-center sm:text-left"><p className="text-xs text-gray-500 mb-1">Respiratory Rate</p><p className="font-medium text-gray-900">{vitals.respiratoryRate}</p></div>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">

            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Vitals</p>
                
                <div className="flex items-center gap-4">
                    <Select defaultValue="recent">
                        <SelectTrigger className="w-40"><SelectValue placeholder="Most Recent" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="date">By Date</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    {/* ADD MODAL */}
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify" onClick={handleOpenAddModal}>
                                + Add Vitals
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Add Vitals</DialogTitle></DialogHeader>
                            <VitalsFormFields data={formData} onInputChange={handleInputChange} />
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Vitals Records */}
            <div className="space-y-4">
                {vitalsRecords.length > 0 ? (
                    vitalsRecords.map(vitals => (
                        <div 
                            key={vitals.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleOpenViewModal(vitals)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-gray-900 text-lg">{formatDate(vitals.dateTaken)}</h3>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        onClick={(e) => handleOpenEditModal(e, vitals)}
                                        title="Edit Vitals"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        onClick={(e) => handleOpenArchiveModal(e, vitals)}
                                        title="Archive Vitals"
                                    >
                                        <Archive className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                                <div className="text-center"><p className="text-xs text-gray-500 mb-1">Blood Pressure</p><p className="font-medium text-gray-900">{vitals.bloodPressure}</p></div>
                                <div className="text-center"><p className="text-xs text-gray-500 mb-1">Weight</p><p className="font-medium text-gray-900">{vitals.weight}kg</p></div>
                                <div className="text-center"><p className="text-xs text-gray-500 mb-1">Height</p><p className="font-medium text-gray-900">{vitals.height}cm</p></div>
                                <div className="text-center"><p className="text-xs text-gray-500 mb-1">BMI</p><p className="font-medium text-gray-900">{vitals.bmi}</p></div>
                                <div className="text-center"><p className="text-xs text-gray-500 mb-1">Heart Rate</p><p className="font-medium text-gray-900">{vitals.heartRate} bpm</p></div>
                                <div className="text-center"><p className="text-xs text-gray-500 mb-1">Temperature</p><p className="font-medium text-gray-900">{vitals.temperature} °C</p></div>
                                <div className="text-center"><p className="text-xs text-gray-500 mb-1">Resp. Rate</p><p className="font-medium text-gray-900">{vitals.respiratoryRate}</p></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No vitals records found. Add a new record to get started.</p>
                )}
            </div>

            {/* --- VIEW/EDIT MODAL --- */}
            <Dialog open={isViewEditModalOpen} onOpenChange={setIsViewEditModalOpen}>
                <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Vitals' : 'View Vitals'}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedVital && (
                        isEditing ? (
                            <VitalsFormFields data={selectedVital} onInputChange={handleInputChange} />
                        ) : (
                            <VitalsRecordView vitals={selectedVital} />
                        )
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsViewEditModalOpen(false)}>
                            {isEditing ? 'Cancel' : 'Close'}
                        </Button>
                        {isEditing && (
                            <Button onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- ARCHIVE CONFIRMATION MODAL --- */}
            <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Archive Vitals Record
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive the vitals record from {formatDate(selectedVital?.dateTaken)}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleArchive}>Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Vitals;
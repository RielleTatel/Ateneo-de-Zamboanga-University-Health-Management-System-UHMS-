import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive, Calendar, AlertTriangle } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// Blank form
const blankForm = {
    vaccineType: '',
    lastAdministered: '',
    nextDue: '',
    complianceStatus: 'up-to-date'
};

const Immunization = ({ patientUuid }) => {
    const [immunizations, setImmunizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImmunization, setSelectedImmunization] = useState(null);

    const [formData, setFormData] = useState(blankForm);
    const [errors, setErrors] = useState({});

    // Map backend record -> frontend shape
    const mapFromBackend = (item) => ({
        id: item.immunization_id,
        vaccineType: item.vaccine,
        lastAdministered: item.last_administered || "",
        nextDue: item.next_due || "",
        complianceStatus: item.status || "up-to-date",
    });

    // Map frontend shape -> backend payload
    const mapToBackend = (item) => ({
        vaccine: item.vaccineType,
        last_administered: item.lastAdministered || null,
        next_due: item.nextDue || null,
        status: item.complianceStatus,
    });

    // Load immunizations on mount
    useEffect(() => {
        const fetchImmunizations = async () => {
            if (!patientUuid) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setApiError("");
            try {
                const res = await axiosInstance.get(`/immunizations/patient/${patientUuid}`);
                const records = res.data?.immunizations || [];
                setImmunizations(records.map(mapFromBackend));
            } catch (error) {
                console.error("[Immunization] Failed to load records:", error);
                setApiError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to load immunization records."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchImmunizations();
    }, [patientUuid]);

    const validateForm = () => {
        const newErrors = {};
        const data = isEditing ? selectedImmunization : formData;
        
        if (!data.vaccineType.trim()) {
            newErrors.vaccineType = 'Vaccine type is required';
        } else if (data.vaccineType.trim().length < 2) {
            newErrors.vaccineType = 'Vaccine type must be at least 2 characters';
        }
        
        if (!data.lastAdministered) {
            newErrors.lastAdministered = 'Last administered date is required';
        } else {
            const adminDate = new Date(data.lastAdministered);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize
            if (adminDate > today && adminDate.toDateString() !== today.toDateString()) {
                newErrors.lastAdministered = 'Date cannot be in the future';
            }
        }
        
        if (data.nextDue && data.lastAdministered) {
            const nextDueDate = new Date(data.nextDue);
            const adminDate = new Date(data.lastAdministered);
            if (nextDueDate <= adminDate) {
                newErrors.nextDue = 'Next due date must be after last administered date';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = useCallback((field, value) => {
        if (isEditing) {
            setSelectedImmunization(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        
        // Clear error for this field if it exists
        setErrors(prev => {
            if (prev[field]) {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            }
            return prev;
        });
    }, [isEditing]);

    const handleSubmit = async () => {
        if (validateForm()) {
            setApiError("");
            try {
                if (isEditing) {
                    // Update existing record
                    const payload = mapToBackend(selectedImmunization);
                    const res = await axiosInstance.patch(
                        `/immunizations/update/${selectedImmunization.id}`,
                        payload
                    );
                    const updated = mapFromBackend(res.data.immunization);
                    setImmunizations((prev) =>
                        prev.map((item) =>
                            item.id === updated.id ? updated : item
                        )
                    );
                } else {
                    // Create new record
                    const payload = { 
                        ...mapToBackend(formData),
                        patient_uuid: patientUuid 
                    };
                    const res = await axiosInstance.post("/immunizations/add", payload);
                    const created = mapFromBackend(res.data.immunization);
                    setImmunizations((prev) => [created, ...prev]);
                }

                setIsAddModalOpen(false);
                setIsViewEditModalOpen(false);
                setIsEditing(false);
                setSelectedImmunization(null);
                setFormData(blankForm);
                setErrors({});
            } catch (error) {
                console.error("[Immunization] Failed to save record:", error);
                setApiError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to save immunization record."
                );
            }
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setFormData(blankForm);
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleOpenViewModal = (item) => {
        setSelectedImmunization(item);
        setIsEditing(false);
        setIsViewEditModalOpen(true);
    };
    
    const handleOpenEditModal = (e, item) => {
        e.stopPropagation();
        setSelectedImmunization({ ...item });
        setIsEditing(true);
        setErrors({});
        setIsViewEditModalOpen(true);
    };

    const handleOpenArchiveModal = (e, item) => {
        e.stopPropagation();
        setSelectedImmunization(item);
        setIsArchiveModalOpen(true);
    };

    const handleArchive = async () => {
        if (!selectedImmunization) return;
        setApiError("");
        try {
            await axiosInstance.delete(`/immunizations/delete/${selectedImmunization.id}`);
            setImmunizations((prev) =>
                prev.filter((item) => item.id !== selectedImmunization.id)
            );
            setIsArchiveModalOpen(false);
            setSelectedImmunization(null);
        } catch (error) {
            console.error("[Immunization] Failed to archive record:", error);
            setApiError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to archive immunization record."
            );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        });
    };

    // --- Reusable Form ---
    const ImmunizationFormFields = useCallback(({ data, onInputChange, fieldErrors }) => (
        <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
                <Field>
                    <FieldLabel>Vaccine Type *</FieldLabel>
                    <FieldContent>
                        <Input 
                            placeholder="COVID - 19 (PFIZER)" 
                            value={data.vaccineType} 
                            onChange={(e) => onInputChange('vaccineType', e.target.value)} 
                            className={fieldErrors.vaccineType ? 'border-red-500' : ''} 
                        />
                        {fieldErrors.vaccineType && <p className="text-red-500 text-sm mt-1">{fieldErrors.vaccineType}</p>}
                    </FieldContent>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Last Administered *</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Input 
                                    type="date" 
                                    value={data.lastAdministered} 
                                    onChange={(e) => onInputChange('lastAdministered', e.target.value)} 
                                    className={fieldErrors.lastAdministered ? 'border-red-500' : ''} 
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {fieldErrors.lastAdministered && <p className="text-red-500 text-sm mt-1">{fieldErrors.lastAdministered}</p>}
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel>Next Due (if applicable)</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Input 
                                    type="date" 
                                    value={data.nextDue} 
                                    onChange={(e) => onInputChange('nextDue', e.target.value)} 
                                    className={fieldErrors.nextDue ? 'border-red-500' : ''} 
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {fieldErrors.nextDue && <p className="text-red-500 text-sm mt-1">{fieldErrors.nextDue}</p>}
                        </FieldContent>
                    </Field>
                </div>
                <Field>
                    <FieldLabel>Compliance Status</FieldLabel>
                    <FieldContent>
                        <Select value={data.complianceStatus} onValueChange={(value) => onInputChange('complianceStatus', value)}>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="up-to-date">Up-to-date</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="missed">Missed</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
            </CardContent>
        </Card>
    ), []);

    // --- Status Styling Helper ---
    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
            case 'up-to-date':
                return 'text-green-600';
            case 'overdue':
                return 'text-orange-600';
            case 'missed':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };
    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    };

    // --- Reusable View ---
    const ImmunizationView = ({ item }) => (
        <Card>
            <CardHeader>
                <CardTitle>{item.vaccineType}</CardTitle>
                <CardDescription className={`font-medium ${getStatusClass(item.complianceStatus)}`}>
                    Status: {formatStatus(item.complianceStatus)}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Last Administered</p>
                    <p className="font-semibold">{formatDate(item.lastAdministered)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Next Due Date</p>
                    <p className="font-semibold">{formatDate(item.nextDue)}</p>
                </div>
            </CardContent>
        </Card>
    );

    // --- Record Item Component ---
    const ImmunizationRecord = ({ item }) => (
        <div 
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => handleOpenViewModal(item)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.vaccineType}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                        <span>Last Administered: {formatDate(item.lastAdministered)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className={`font-medium ${getStatusClass(item.complianceStatus)}`}>
                            Status: {formatStatus(item.complianceStatus)}
                        </span>
                    </div>
                    {item.nextDue && (item.complianceStatus === 'overdue' || item.complianceStatus === 'missed') && (
                        <div className="mt-1 text-sm text-red-600">
                            Due Next: {formatDate(item.nextDue)} {item.complianceStatus === 'missed' ? '(Missed)' : ''}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <button 
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={(e) => handleOpenEditModal(e, item)}
                        title="Edit Record"
                    >
                        <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={(e) => handleOpenArchiveModal(e, item)}
                        title="Archive Record"
                    >
                        <Archive className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2">
                <p className="text-xl font-bold">Immunization Records</p> 

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="modify" onClick={handleOpenAddModal}>
                            + Add Immunization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add Immunization</DialogTitle></DialogHeader>
                        <ImmunizationFormFields data={formData} onInputChange={handleInputChange} fieldErrors={errors} />
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Immunization Records */}
            <div className="space-y-4 mt-6">
                {apiError && (
                    <p className="text-red-600 text-sm text-center">{apiError}</p>
                )}
                {loading ? (
                    <p className="text-gray-500 text-center">Loading immunization records...</p>
                ) : immunizations.length > 0 ? (
                    immunizations.map((item) => (
                        <ImmunizationRecord key={item.id} item={item} />
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No immunization records found.</p>
                )}
            </div>

            {/* --- VIEW/EDIT MODAL --- */}
            <Dialog open={isViewEditModalOpen} onOpenChange={setIsViewEditModalOpen}>
                <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Immunization' : 'View Immunization'}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedImmunization && (
                        isEditing ? (
                            <ImmunizationFormFields data={selectedImmunization} onInputChange={handleInputChange} fieldErrors={errors} />
                        ) : (
                            <ImmunizationView item={selectedImmunization} />
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
                            Archive Record
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive the record for <strong>{selectedImmunization?.vaccineType}</strong>?
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

export default Immunization;
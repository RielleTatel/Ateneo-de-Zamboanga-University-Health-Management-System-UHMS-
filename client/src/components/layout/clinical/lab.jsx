import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// API Functions
const fetchResultsByPatient = async (uuid) => {
    const { data } = await axiosInstance.get(`/results/patient/${uuid}`);
    return data.results;
};

const fetchCustomFieldsByResult = async (result_id) => {
    try {
        const { data } = await axiosInstance.get(`/results/${result_id}/fields`);
        return data.fields || [];
    } catch (error) {
        console.error("Error fetching custom fields:", error);
        return [];
    }
};

const addResult = async (resultData) => {
    const { data } = await axiosInstance.post("/results/add", resultData);
    return data;
};

const deleteResult = async (result_id) => {
    const { data } = await axiosInstance.delete(`/results/delete/${result_id}`);
    return data;
};

const Lab = ({ recordId }) => {
    const queryClient = useQueryClient();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [customFieldsMap, setCustomFieldsMap] = useState({});
    
    // Lab test types with their units
    const labTests = [
        { key: 'systolic', label: 'Blood Pressure (SBP)', unit: 'mmHg', category: 'Vitals' },
        { key: 'diastolic', label: 'Blood Pressure (DBP)', unit: 'mmHg', category: 'Vitals' },
        { key: 'hgb', label: 'HgB', unit: 'g/dL', category: 'Blood Tests' },
        { key: 'mcv', label: 'MCV', unit: 'fL', category: 'Blood Tests' },
        { key: 'wbc', label: 'WBC', unit: 'K/μL', category: 'Blood Tests' },
        { key: 'slp', label: 'S/L/P', unit: 'mg/dL', category: 'Blood Tests' },
        { key: 'sgpt', label: 'SGPT', unit: 'U/L', category: 'Liver' },
        { key: 'tchol', label: 'Total Cholesterol', unit: 'mg/dL', category: 'Lipid Panel' },
        { key: 'hdl', label: 'HDL', unit: 'mg/dL', category: 'Lipid Panel' },
        { key: 'ldl', label: 'LDL', unit: 'mg/dL', category: 'Lipid Panel' },
        { key: 'trig', label: 'Triglycerides', unit: 'mg/dL', category: 'Lipid Panel' },
        { key: 'fbs', label: 'FBS', unit: 'mg/dL', category: 'Diabetes' },
        { key: 'hba1c', label: 'HBA1C', unit: '%', category: 'Diabetes' },
        { key: 'screa', label: 'Serum Creatinine', unit: 'mg/dL', category: 'Kidney' },
        { key: 'burica', label: 'Blood Uric Acid', unit: 'mg/dL', category: 'Kidney' },
        { key: 'na', label: 'Sodium (Na)', unit: 'mEq/L', category: 'Electrolytes' },
        { key: 'k', label: 'Potassium (K)', unit: 'mEq/L', category: 'Electrolytes' },
        { key: 'psa', label: 'PSA', unit: 'ng/mL', category: 'Other' },
        { key: 'folate', label: 'Folate', unit: 'ng/mL', category: 'Vitamins' },
        { key: 'vitd', label: 'Vitamin D', unit: 'ng/mL', category: 'Vitamins' },
        { key: 'b12', label: 'Vitamin B12', unit: 'pg/mL', category: 'Vitamins' },
        { key: 'tsh', label: 'TSH', unit: 'mIU/L', category: 'Thyroid' },
    ];

    const [newResult, setNewResult] = useState({
        ...labTests.reduce((acc, test) => ({ ...acc, [test.key]: '' }), {})
    });

    // Fetch results for the patient
    const { 
        data: results = [], 
        isLoading,
        error 
    } = useQuery({
        queryKey: ["results", recordId],
        queryFn: () => fetchResultsByPatient(recordId),
        enabled: !!recordId,
        refetchOnWindowFocus: false
    });

    // Add result mutation
    const addResultMutation = useMutation({
        mutationFn: addResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results", recordId] });
            setIsAddModalOpen(false);
            setNewResult(labTests.reduce((acc, test) => ({ ...acc, [test.key]: '' }), {}));
        }
    });

    // Delete result mutation
    const deleteResultMutation = useMutation({
        mutationFn: deleteResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["results", recordId] });
        }
    });

    // Fetch custom fields for all results (must be before any conditional returns)
    useEffect(() => {
        const fetchAllCustomFields = async () => {
            if (!results || results.length === 0) return;
            
            const sortedResults = [...results].sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
            ).slice(0, 5);

            const fieldsMap = {};
            for (const result of sortedResults) {
                const customFields = await fetchCustomFieldsByResult(result.result_id);
                fieldsMap[result.result_id] = customFields;
            }
            setCustomFieldsMap(fieldsMap);
        };

        fetchAllCustomFields();
    }, [results]);

    const handleAddResult = () => {
        // Filter out empty values and convert to appropriate types
        const resultData = {
            user_uuid: recordId,
            ...Object.keys(newResult).reduce((acc, key) => {
                if (newResult[key]) {
                    // Check if it's a numeric field
                    const test = labTests.find(t => t.key === key);
                    if (test && test.category !== 'Diagnostics' && test.unit !== 'Result') {
                        acc[key] = parseFloat(newResult[key]) || newResult[key];
                    } else {
                        acc[key] = newResult[key];
                    }
                }
                return acc;
            }, {})
        };

        addResultMutation.mutate(resultData);
    };

    const handleDeleteResult = (result_id) => {
        if (window.confirm("Are you sure you want to delete this lab result?")) {
            deleteResultMutation.mutate(result_id);
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

    if (isLoading) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Loading lab results...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                <div className="flex items-center justify-center p-12">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <span className="ml-3 text-red-500">Error loading lab results: {error.message}</span>
                </div>
            </div>
        );
    }

    // Sort results by date (most recent first) and limit to last 5 records
    const sortedResults = [...results].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
    ).slice(0, 5);

    // Get all unique custom field keys across all results
    const allCustomFieldKeys = Object.values(customFieldsMap)
        .flat()
        .reduce((acc, field) => {
            if (!acc.includes(field.field_key)) {
                acc.push(field.field_key);
            }
            return acc;
        }, []);

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component Header */}
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">
                <p className="text-xl font-bold">Laboratory Test Results</p>
                <div className="flex gap-2 flex-wrap">
                     <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Lab Results</DialogTitle>
                                <DialogDescription>
                                    Enter the patient's lab test results. Leave fields empty if not tested.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4 ">
                                {labTests.map((test) => (
                                    <div key={test.key} className="space-y-2 ">
                                        <Label htmlFor={test.key}>
                                            {test.label} ({test.unit})
                                        </Label>
                                                    <Input 
                                            id={test.key}
                                            type={test.category === 'Diagnostics' || test.unit === 'Result' ? 'text' : 'number'}
                                            step="0.01"
                                            placeholder={test.category === 'Diagnostics' ? 'Filename or notes' : 'Enter value'}
                                            value={newResult[test.key]}
                                            onChange={(e) => setNewResult({ ...newResult, [test.key]: e.target.value })}
                                        />
                                    </div>
                                ))}
                            </div>
                            {addResultMutation.isError && (
                                <div className="text-red-500 text-sm">
                                    Error: {addResultMutation.error?.response?.data?.error || addResultMutation.error?.message}
                                    </div>
                            )}
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleAddResult}
                                    disabled={addResultMutation.isPending}
                                >
                                    {addResultMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Lab Results'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                </div> 
            </div>

            {/* Lab Results Table */}
            <div className="overflow-x-auto">
                {sortedResults.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg font-medium">No lab results found</p>
                        <p className="text-sm mt-2">Add new lab results to get started</p>
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Laboratory Test</TableHead>
                                {sortedResults.map((result) => (
                                    <TableHead key={result.result_id} className="text-white font-semibold text-center min-w-32 group relative">
                                        <div className="flex flex-row justify-center items-center gap-x-3">
                                            <span>{formatDate(result.created_at)}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteResult(result.result_id)}
                                                disabled={deleteResultMutation.isPending}
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
                            {labTests.map((test) => (
                                <TableRow key={test.key} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                        <div className="font-semibold">{test.label}</div>
                                        <div className="text-xs text-gray-500">{test.unit}</div>
                                    </TableCell>
                                    {sortedResults.map((result) => (
                                        <TableCell key={result.result_id} className="text-center">
                                            {result[test.key] ? (
                                                test.category === 'Diagnostics' ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <FileText className="w-3 h-3 text-blue-500" />
                                                        <span className="text-blue-500 text-xs cursor-pointer hover:underline">
                                                            {result[test.key]}
                                                        </span>
                                    </div>
                                                ) : (
                                                    result[test.key]
                                                )
                                            ) : (
                                                '-'
                                        )}
                                    </TableCell>
                                ))} 
                            </TableRow>
                        ))}
                        
                        {/* Custom Fields Section */}
                        {allCustomFieldKeys.length > 0 && allCustomFieldKeys.map((fieldKey) => (
                            <TableRow key={`custom-${fieldKey}`} className="hover:bg-gray-50 bg-blue-50">
                                <TableCell className="font-medium">
                                    <div className="font-semibold text-blue-700">{fieldKey}</div>
                                    <div className="text-xs text-gray-500">Custom Test</div>
                                </TableCell>
                                {sortedResults.map((result) => {
                                    const customField = customFieldsMap[result.result_id]?.find(
                                        field => field.field_key === fieldKey
                                    );
                                    return (
                                        <TableCell key={result.result_id} className="text-center">
                                            {customField?.field_value || '-'}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </div>
            
            {results.length > 5 && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    Showing latest 5 of {results.length} records
                </div>
            )}
        </div>
    );
};

export default Lab;

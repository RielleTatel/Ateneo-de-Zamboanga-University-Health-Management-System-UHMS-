import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Edit, Plus, Trash2 } from "lucide-react";

const Lab = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
    const [newRowData, setNewRowData] = useState({
        test: '',
        unit: '',
        "11/3/2025": '',
        "10/15/2025": '',
        "9/3/2025": '',
        "3/31/2025": '',
        "8/3/2024": ''
    });
    const [errors, setErrors] = useState({});
    const [labData, setLabData] = useState([
        {
            test: "Weight",
            unit: "kg",
            "11/3/2025": "64.3",
            "10/15/2025": "64.9",
            "9/3/2025": "65",
            "3/31/2025": "-",
            "8/3/2024": "59.6"
        },
        {
            test: "BMI",
            unit: "kg/m²",
            "11/3/2025": "22.3",
            "10/15/2025": "22.5",
            "9/3/2025": "22.5",
            "3/31/2025": "-",
            "8/3/2024": "20.6"
        },
        {
            test: "Blood Pressure",
            unit: "SBP/DBP - mmHg",
            "11/3/2025": "117/76",
            "10/15/2025": "112/72",
            "9/3/2025": "120/80",
            "3/31/2025": "108/70",
            "8/3/2024": "115/75"
        },
        {
            test: "HgB",
            unit: "g/dL",
            "11/3/2025": "13.9",
            "10/15/2025": "14.8",
            "9/3/2025": "14.2",
            "3/31/2025": "13.7",
            "8/3/2024": "15"
        },
        {
            test: "MCV",
            unit: "fL",
            "11/3/2025": "89",
            "10/15/2025": "94",
            "9/3/2025": "87",
            "3/31/2025": "91",
            "8/3/2024": "95"
        },
        {
            test: "WBC",
            unit: "K/μL",
            "11/3/2025": "6.5",
            "10/15/2025": "7.8",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "6.9"
        },
        {
            test: "S/L/P",
            unit: "mg/dL",
            "11/3/2025": "-",
            "10/15/2025": "-",
            "9/3/2025": "-",
            "3/31/2025": "-",
            "8/3/2024": "-"
        },
        {
            test: "SGPT",
            unit: "U/L",
            "11/3/2025": "24",
            "10/15/2025": "28",
            "9/3/2025": "33",
            "3/31/2025": "30",
            "8/3/2024": "26"
        },
        {
            test: "Tchol",
            unit: "mg/dL",
            "11/3/2025": "5.3",
            "10/15/2025": "5.3",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "187"
        },
        {
            test: "HDL",
            unit: "mg/dL",
            "11/3/2025": "5.3",
            "10/15/2025": "5.3",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "58"
        },
        {
            test: "LDL",
            unit: "mg/dL",
            "11/3/2025": "5.3",
            "10/15/2025": "5.3",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "6.9"
        },
        {
            test: "Trig",
            unit: "mg/dL",
            "11/3/2025": "-",
            "10/15/2025": "-",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "6.9"
        },
        {
            test: "FBS",
            unit: "mg/dL",
            "11/3/2025": "-",
            "10/15/2025": "-",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "6.9"
        },
        {
            test: "HBA1C",
            unit: "%",
            "11/3/2025": "-",
            "10/15/2025": "-",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "6.9"
        },
        {
            test: "Screa",
            unit: "mg/dL",
            "11/3/2025": "-",
            "10/15/2025": "-",
            "9/3/2025": "5.3",
            "3/31/2025": "8.1",
            "8/3/2024": "6.9"
        },
        {
            test: "BUricA",
            unit: "mg/dL",
            "11/3/2025": "-",
            "10/15/2025": "-",
            "9/3/2025": "-",
            "3/31/2025": "-",
            "8/3/2024": "-"
        },
        {
            test: "2D Echo",
            unit: "Attachment",
            "11/3/2025": { type: "file", name: "20ECh...Doe.dcm" },
            "10/15/2025": "-",
            "9/3/2025": "-",
            "3/31/2025": "-",
            "8/3/2024": "-"
        },
        {
            test: "EKG",
            unit: "Attachment",
            "11/3/2025": "-",
            "10/15/2025": { type: "files", files: ["Doe...EKG.dcm", "Doe...Results.pdf"] },
            "9/3/2025": "-",
            "3/31/2025": "-",
            "8/3/2024": { type: "file", name: "Doe...EKG.dcm" }
        }
    ]);

    const dates = ["11/3/2025", "10/15/2025", "9/3/2025", "3/31/2025", "8/3/2024"];

    const validateForm = (data) => {
        const newErrors = {};
        
        if (!data.test.trim()) {
            newErrors.test = 'Test name is required';
        }
        
        if (!data.unit.trim()) {
            newErrors.unit = 'Unit is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value, isEditing = false) => {
        if (isEditing) {
            setEditingRow(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            setNewRowData(prev => ({
                ...prev,
                [field]: value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleAddRow = () => {
        if (validateForm(newRowData)) {
            setLabData(prev => [...prev, { ...newRowData, id: Date.now() }]);
            setNewRowData({
                test: '',
                unit: '',
                "11/3/2025": '',
                "10/15/2025": '',
                "9/3/2025": '',
                "3/31/2025": '',
                "8/3/2024": ''
            });
            setIsAddModalOpen(false);
            setErrors({});
        }
    };

    const handleEditRow = (rowIndex) => {
        setEditingRow({ ...labData[rowIndex], index: rowIndex });
        setIsEditModalOpen(true);
    };

    const handleUpdateRow = () => {
        if (validateForm(editingRow)) {
            const updatedData = [...labData];
            updatedData[editingRow.index] = { ...editingRow };
            delete updatedData[editingRow.index].index;
            setLabData(updatedData);
            setIsEditModalOpen(false);
            setEditingRow(null);
            setErrors({});
        }
    };

    const handleDeleteRow = (rowIndex) => {
        const updatedData = labData.filter((_, index) => index !== rowIndex);
        setLabData(updatedData);
    };

    const renderCell = (value) => {
        if (typeof value === 'object' && value !== null) {
            if (value.type === 'file') {
                return (
                    <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-500" />
                        <span className="text-blue-500 text-xs cursor-pointer hover:underline">
                            {value.name}
                        </span>
                    </div>
                );
            } else if (value.type === 'files') {
                return (
                    <div className="space-y-1">
                        {value.files.map((file, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <FileText className="w-3 h-3 text-blue-500" />
                                <span className="text-blue-500 text-xs cursor-pointer hover:underline">
                                    {file}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            }
        }
        return value || "-";
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Laboratory Test Results</p>
                <div className="flex gap-2">
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify" className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Row
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Lab Test</DialogTitle>
                            </DialogHeader>
                            
                            <Card>
                                <CardContent className="p-4 sm:p-6 space-y-4">
                                    {/* Test Name and Unit */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Test Name *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="e.g., Weight, Blood Pressure"
                                                    value={newRowData.test}
                                                    onChange={(e) => handleInputChange('test', e.target.value)}
                                                    className={errors.test ? 'border-red-500' : ''}
                                                />
                                                {errors.test && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.test}</p>
                                                )}
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Unit *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="e.g., kg, mmHg, mg/dL"
                                                    value={newRowData.unit}
                                                    onChange={(e) => handleInputChange('unit', e.target.value)}
                                                    className={errors.unit ? 'border-red-500' : ''}
                                                />
                                                {errors.unit && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                                                )}
                                            </FieldContent>
                                        </Field>
                                    </div>

                                    {/* Date Values */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {dates.map((date) => (
                                            <Field key={date}>
                                                <FieldLabel>{date}</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        placeholder="Value or '-'"
                                                        value={newRowData[date]}
                                                        onChange={(e) => handleInputChange(date, e.target.value)}
                                                    />
                                                </FieldContent>
                                            </Field>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddRow}>
                                    Add Test
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Lab Results Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Laboratory Test</TableHead>
                            {dates.map((date) => (
                                <TableHead key={date} className="text-white font-semibold text-center min-w-24">
                                    {date}
                                </TableHead>
                            ))}
                            <TableHead className="text-white font-semibold text-center min-w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    <div>
                                        <div className="font-semibold">{row.test}</div>
                                        <div className="text-xs text-gray-500">{row.unit}</div>
                                    </div>
                                </TableCell>
                                {dates.map((date) => (
                                    <TableCell key={date} className="text-center">
                                        {renderCell(row[date])}
                                    </TableCell>
                                ))}
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditRow(index)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteRow(index)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Lab Test</DialogTitle>
                    </DialogHeader>
                    
                    {editingRow && (
                        <Card>
                            <CardContent className="p-4 sm:p-6 space-y-4">
                                {/* Test Name and Unit */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel>Test Name *</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                placeholder="e.g., Weight, Blood Pressure"
                                                value={editingRow.test}
                                                onChange={(e) => handleInputChange('test', e.target.value, true)}
                                                className={errors.test ? 'border-red-500' : ''}
                                            />
                                            {errors.test && (
                                                <p className="text-red-500 text-sm mt-1">{errors.test}</p>
                                            )}
                                        </FieldContent>
                                    </Field>

                                    <Field>
                                        <FieldLabel>Unit *</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                placeholder="e.g., kg, mmHg, mg/dL"
                                                value={editingRow.unit}
                                                onChange={(e) => handleInputChange('unit', e.target.value, true)}
                                                className={errors.unit ? 'border-red-500' : ''}
                                            />
                                            {errors.unit && (
                                                <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                                            )}
                                        </FieldContent>
                                    </Field>
                                </div>

                                {/* Date Values */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dates.map((date) => (
                                        <Field key={date}>
                                            <FieldLabel>{date}</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Value or '-'"
                                                    value={typeof editingRow[date] === 'object' ? JSON.stringify(editingRow[date]) : editingRow[date] || ''}
                                                    onChange={(e) => handleInputChange(date, e.target.value, true)}
                                                />
                                            </FieldContent>
                                        </Field>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateRow}>
                            Update Test
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Lab; 
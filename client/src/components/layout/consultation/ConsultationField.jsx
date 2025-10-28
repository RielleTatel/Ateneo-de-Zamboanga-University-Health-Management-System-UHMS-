import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

// --- Vitals Field Component for Consultation ---
export const VitalsField = () => {
    const [editingCell, setEditingCell] = useState(null);
    
    const initialVitalsData = [
        { id: 1, test: "Blood Pressure", unit: "mmHg", value: "" },
        { id: 2, test: "Temperature", unit: "°C", value: "" },
        { id: 3, test: "Heart Rate", unit: "bpm", value: "" },
        { id: 4, test: "Respiratory Rate", unit: "breaths/min", value: "" },
        { id: 5, test: "Weight", unit: "kg", value: "" },
        { id: 6, test: "Height", unit: "cm", value: "" },
        { id: 7, test: "BMI", unit: "kg/m²", value: "" }
    ];

    const [vitalsData, setVitalsData] = useState(initialVitalsData);

    const handleCellUpdate = (rowIndex, columnId, value) => {
        const updatedData = vitalsData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        setVitalsData(updatedData);
    };

    const handleAddRow = () => {
        const newRow = { 
            id: Date.now(), 
            test: "", 
            unit: "", 
            value: "" 
        };
        setVitalsData([...vitalsData, newRow]);
    };

    const handleDeleteRow = (rowIndex) => {
        setVitalsData(vitalsData.filter((_, index) => index !== rowIndex));
    };

    const EditableCell = ({ value, rowIndex, columnId, className = "" }) => {
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId;

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleCellUpdate(rowIndex, columnId, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingCell(null); }}
                    autoFocus
                    className={`h-8 ${className}`}
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCell({ rowIndex, columnId })}
                className="cursor-pointer min-h-[32px] flex items-center justify-center p-2 -m-2"
            >
                {value || "-"}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">
                <p className="text-xl font-bold">Vitals</p>
                <Button 
                    variant="modify" 
                    className="flex items-center gap-2"
                    onClick={handleAddRow}
                >
                    <Plus className="w-4 h-4" /> Add Row
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Vital Test</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-32">Value</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {vitalsData.map((row, rowIndex) => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    <div className="font-semibold">
                                        <EditableCell 
                                            value={row.test} 
                                            rowIndex={rowIndex} 
                                            columnId="test" 
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <EditableCell 
                                            value={row.unit} 
                                            rowIndex={rowIndex} 
                                            columnId="unit" 
                                        />
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    <EditableCell 
                                        value={row.value} 
                                        rowIndex={rowIndex} 
                                        columnId="value" 
                                    />
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDeleteRow(rowIndex)} 
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
        </div>
    );
};

// --- Lab Field Component for Consultation ---
export const LabFields = () => {
    const [editingCell, setEditingCell] = useState(null);
    
    const initialLabData = [
        { id: 1, test: "Complete Blood Count (CBC)", unit: "g/dL", value: "" },
        { id: 2, test: "Blood Glucose", unit: "mg/dL", value: "" },
        { id: 3, test: "Cholesterol", unit: "mg/dL", value: "" },
        { id: 4, test: "Urinalysis", unit: "N/A", value: "" }
    ];

    const [labData, setLabData] = useState(initialLabData);

    const handleCellUpdate = (rowIndex, columnId, value) => {
        const updatedData = labData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        setLabData(updatedData);
    };

    const handleAddRow = () => {
        const newRow = { 
            id: Date.now(), 
            test: "", 
            unit: "", 
            value: "" 
        };
        setLabData([...labData, newRow]);
    };

    const handleDeleteRow = (rowIndex) => {
        setLabData(labData.filter((_, index) => index !== rowIndex));
    };

    const EditableCell = ({ value, rowIndex, columnId, className = "" }) => {
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId;

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleCellUpdate(rowIndex, columnId, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingCell(null); }}
                    autoFocus
                    className={`h-8 ${className}`}
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCell({ rowIndex, columnId })}
                className="cursor-pointer min-h-[32px] flex items-center justify-center p-2 -m-2"
            >
                {value || "-"}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">
                <p className="text-xl font-bold">Laboratory Tests</p>
                <Button 
                    variant="modify" 
                    className="flex items-center gap-2"
                    onClick={handleAddRow}
                >
                    <Plus className="w-4 h-4" /> Add Row
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Laboratory Test</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-32">Result</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {labData.map((row, rowIndex) => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    <div className="font-semibold">
                                        <EditableCell 
                                            value={row.test} 
                                            rowIndex={rowIndex} 
                                            columnId="test" 
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <EditableCell 
                                            value={row.unit} 
                                            rowIndex={rowIndex} 
                                            columnId="unit" 
                                        />
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    <EditableCell 
                                        value={row.value} 
                                        rowIndex={rowIndex} 
                                        columnId="value" 
                                    />
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDeleteRow(rowIndex)} 
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
        </div>
    );
};

// --- Consultation Notes Component ---
export const ConsultationNotes = () => {
    const [notes, setNotes] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [prescription, setPrescription] = useState("");

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6 space-y-6">
            <p className="text-xl font-bold">Consultation Notes</p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-2">Chief Complaint / Symptoms</label>
                    <Textarea
                        placeholder="Enter patient's chief complaint and symptoms..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px] resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Diagnosis</label>
                    <Textarea
                        placeholder="Enter diagnosis..."
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="min-h-[100px] resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-2">Prescription / Treatment Plan</label>
                    <Textarea
                        placeholder="Enter prescription and treatment plan..."
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        className="min-h-[100px] resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

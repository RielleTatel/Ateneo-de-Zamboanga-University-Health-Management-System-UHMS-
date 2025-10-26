import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Edit, Plus, Trash2, X } from "lucide-react";

const Lab = () => {
    // --- State Management ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
    const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
    
    // State for in-line editing: { rowIndex: number, columnId: string }
    const [editingCell, setEditingCell] = useState(null); 

    const [newColumnDate, setNewColumnDate] = useState('');
    const [columnToDelete, setColumnToDelete] = useState(null);

    const initialDates = ["11/3/2025", "10/15/2025", "9/3/2025", "3/31/2025", "8/3/2024"];
    const [dates, setDates] = useState(initialDates);

    const initialData = [
        { id: 1, test: "Weight", unit: "kg", "11/3/2025": "64.3", "10/15/2025": "64.9", "9/3/2025": "65", "3/31/2025": "-", "8/3/2024": "59.6" },
        { id: 2, test: "BMI", unit: "kg/m²", "11/3/2025": "22.3", "10/15/2025": "22.5", "9/3/2025": "22.5", "3/31/2025": "-", "8/3/2024": "20.6" },
        { id: 3, test: "Blood Pressure", unit: "SBP/DBP - mmHg", "11/3/2025": "117/76", "10/15/2025": "112/72", "9/3/2025": "120/80", "3/31/2025": "108/70", "8/3/2024": "115/75" },
        { id: 4, test: "HgB", unit: "g/dL", "11/3/2025": "13.9", "10/15/2025": "14.8", "9/3/2025": "14.2", "3/31/2025": "13.7", "8/3/2024": "15" },
        { id: 5, test: "MCV", unit: "fL", "11/3/2025": "89", "10/15/2025": "94", "9/3/2025": "87", "3/31/2025": "91", "8/3/2024": "95" },
        { id: 6, test: "WBC", unit: "K/μL", "11/3/2025": "6.5", "10/15/2025": "7.8", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "6.9" },
        { id: 7, test: "S/L/P", unit: "mg/dL", "11/3/2025": "-", "10/15/2025": "-", "9/3/2025": "-", "3/31/2025": "-", "8/3/2024": "-" },
        { id: 8, test: "SGPT", unit: "U/L", "11/3/2025": "24", "10/15/2025": "28", "9/3/2025": "33", "3/31/2025": "30", "8/3/2024": "26" },
        { id: 9, test: "Tchol", unit: "mg/dL", "11/3/2025": "5.3", "10/15/2025": "5.3", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "187" },
        { id: 10, test: "HDL", unit: "mg/dL", "11/3/2025": "5.3", "10/15/2025": "5.3", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "58" },
        { id: 11, test: "LDL", unit: "mg/dL", "11/3/2025": "5.3", "10/15/2025": "5.3", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "6.9" },
        { id: 12, test: "Trig", unit: "mg/dL", "11/3/2025": "-", "10/15/2025": "-", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "6.9" },
        { id: 13, test: "FBS", unit: "mg/dL", "11/3/2025": "-", "10/15/2025": "-", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "6.9" },
        { id: 14, test: "HBA1C", unit: "%", "11/3/2025": "-", "10/15/2025": "-", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "6.9" },
        { id: 15, test: "Screa", unit: "mg/dL", "11/3/2025": "-", "10/15/2025": "-", "9/3/2025": "5.3", "3/31/2025": "8.1", "8/3/2024": "6.9" },
        { id: 16, test: "BUricA", unit: "mg/dL", "11/3/2025": "-", "10/15/2025": "-", "9/3/2025": "-", "3/31/2025": "-", "8/3/2024": "-" },
        { id: 17, test: "2D Echo", unit: "Attachment", "11/3/2025": { type: "file", name: "20ECh...Doe.dcm" }, "10/15/2025": "-", "9/3/2025": "-", "3/31/2025": "-", "8/3/2024": "-" },
        { id: 18, test: "EKG", unit: "Attachment", "11/3/2025": "-", "10/15/2025": { type: "files", files: ["Doe...EKG.dcm", "Doe...Results.pdf"] }, "9/3/2025": "-", "3/31/2025": "-", "8/3/2024": { type: "file", name: "Doe...EKG.dcm" } }
    ];

    const [labData, setLabData] = useState(initialData);

    const initialNewRowData = dates.reduce((acc, date) => ({ ...acc, [date]: '' }), { test: '', unit: '' });
    const [newRowData, setNewRowData] = useState(initialNewRowData);
    const [errors, setErrors] = useState({});

    // --- Form Validation ---
    const validateForm = (data) => {
        const newErrors = {};
        if (!data.test.trim()) newErrors.test = 'Test name is required';
        if (!data.unit.trim()) newErrors.unit = 'Unit is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setNewRowData(prev => ({...prev, [field]: value}));
        if (errors[field]) setErrors(prev => ({...prev, [field]: ''}));
    };

    // --- In-line Editing Handler ---
    const handleCellUpdate = (rowIndex, columnId, value) => {
        const updatedData = labData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        setLabData(updatedData);
    };

    // --- Row Operations ---
    const handleAddRow = () => {
        if (validateForm(newRowData)) {
            setLabData(prev => [...prev, { ...newRowData, id: Date.now() }]);
            setNewRowData(initialNewRowData);
            setIsAddModalOpen(false);
            setErrors({});
        }
    };
    
    const handleDeleteRow = (rowIndex) => {
        setLabData(labData.filter((_, index) => index !== rowIndex));
    };

    // --- Column Operations ---
    const handleAddColumn = () => {
        if (newColumnDate && !dates.includes(newColumnDate)) {
            const newDates = [newColumnDate, ...dates];
            setDates(newDates);
            const updatedLabData = labData.map(row => ({...row, [newColumnDate]: '-'}));
            setLabData(updatedLabData);
            setNewRowData(prev => ({...prev, [newColumnDate]: ''}));
            setNewColumnDate('');
            setIsAddColumnModalOpen(false);
        }
    };

    const confirmDeleteColumn = (date) => {
        setColumnToDelete(date);
        setIsDeleteColumnModalOpen(true);
    };

    const handleDeleteColumn = () => {
        if (columnToDelete) {
            const newDates = dates.filter(date => date !== columnToDelete);
            setDates(newDates);
            const updatedLabData = labData.map(row => {
                const newRow = { ...row };
                delete newRow[columnToDelete];
                return newRow;
            });
            setLabData(updatedLabData);
            setColumnToDelete(null);
            setIsDeleteColumnModalOpen(false);
        }
    };

    // --- Cell Rendering ---
    const renderCellContent = (value) => {
        if (typeof value === 'object' && value !== null) {
            const FileIcon = <FileText className="w-3 h-3 text-blue-500" />;
            const renderFile = (name) => (
                <div key={name} className="flex items-center gap-1">
                    {FileIcon}
                    <span className="text-blue-500 text-xs cursor-pointer hover:underline">{name}</span>
                </div>
            );
            if (value.type === 'file') return renderFile(value.name);
            if (value.type === 'files') return <div className="space-y-1"> {value.files.map(renderFile)} </div>;
        }
        return value || "-";
    };

    // --- Component for Editable Cell ---
    const EditableCell = ({ value, rowIndex, columnId }) => {
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId;

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleCellUpdate(rowIndex, columnId, e.target.value)}
                    onBlur={() => setEditingCell(null)} // Save on blur
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingCell(null); }} // Save on Enter
                    autoFocus
                    className="h-8"
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCell({ rowIndex, columnId })}
                className="cursor-pointer min-h-[32px] flex items-center justify-center p-2 -m-2" // Added padding for easier clicking
            >
                {value || "-"}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">

            {/* --- Component Header --- */}
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">

                <p className="text-xl font-bold">Laboratory Test Results</p>
                <div className="flex gap-2 flex-wrap">
                     <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild><Button variant="modify" className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Row</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Add New Lab Test</DialogTitle></DialogHeader>
                            <Card><CardContent className="p-4 sm:p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field><FieldLabel>Test Name *</FieldLabel><FieldContent><Input placeholder="e.g., Weight, Blood Pressure" value={newRowData.test} onChange={(e) => handleInputChange('test', e.target.value)} className={errors.test ? 'border-red-500' : ''} />{errors.test && <p className="text-red-500 text-sm mt-1">{errors.test}</p>}</FieldContent></Field>
                                    <Field><FieldLabel>Unit *</FieldLabel><FieldContent><Input placeholder="e.g., kg, mmHg, mg/dL" value={newRowData.unit} onChange={(e) => handleInputChange('unit', e.target.value)} className={errors.unit ? 'border-red-500' : ''} />{errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}</FieldContent></Field>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dates.map((date) => (<Field key={date}><FieldLabel>{date}</FieldLabel><FieldContent><Input placeholder="Value or '-'" value={newRowData[date]} onChange={(e) => handleInputChange(date, e.target.value)} /></FieldContent></Field>))}
                                </div>
                            </CardContent></Card>
                            <DialogFooter className="gap-2"><Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button><Button onClick={handleAddRow}>Add Test</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isAddColumnModalOpen} onOpenChange={setIsAddColumnModalOpen}>
                        <DialogTrigger asChild><Button variant="modify" className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Column</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader><DialogTitle>Add New Date Column</DialogTitle></DialogHeader>
                            <div className="space-y-2"><FieldLabel htmlFor="new-date">New Date</FieldLabel><Input id="new-date" placeholder="MM/DD/YYYY" value={newColumnDate} onChange={(e) => setNewColumnDate(e.target.value)} /><p className="text-xs text-gray-500">e.g., 12/25/2025</p></div>
                            <DialogFooter><Button variant="outline" onClick={() => setIsAddColumnModalOpen(false)}>Cancel</Button><Button onClick={handleAddColumn}>Add Column</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="flex items-center gap-2"><Download className="w-4 h-4" />Export</Button>
                </div> 

            </div>

            {/* --- Lab Results Table --- */}
            <div className="overflow-x-auto">

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Laboratory Test</TableHead>
                            {dates.map((date) => (
                                <TableHead key={date} className="text-white font-semibold text-center min-w-32 group relative">
                                    {date}
                                    <Button variant="ghost" size="sm" onClick={() => confirmDeleteColumn(date)} className="h-6 w-6 p-0 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"> <X className="h-4 w-4 text-red-400" /> </Button>
                                </TableHead>
                            ))}
                            <TableHead className="text-white font-semibold text-center min-w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                        {labData.map((row, rowIndex) => (
                            <TableRow key={row.id || rowIndex} className="hover:bg-gray-50">

                                {/* Editable Row? */}
                                <TableCell className="font-medium">

                                    <div className="font-semibold">
                                        <EditableCell value={row.test} rowIndex={rowIndex} columnId="test" />
                                    </div>

                                    <div className="text-xs text-gray-500">
                                         <EditableCell value={row.unit} rowIndex={rowIndex} columnId="unit" />
                                    </div>
                                </TableCell>

                            {/* 1st Row ??? */}
                                {dates.map((date) => (
                                    <TableCell key={date} className="text-center">
                                        {typeof row[date] === 'object' ? (
                                            renderCellContent(row[date])
                                        ) : (
                                            <EditableCell value={row[date]} rowIndex={rowIndex} columnId={date} />
                                        )}
                                    </TableCell>
                                ))} 

                            {/* 2nd Row ??? */}
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRow(rowIndex)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700"> <Trash2 className="h-4 w-4" /> </Button>
                                    </div>
                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </div>
            
            {/* Delete Column Confirmation Modal */}
            <Dialog open={isDeleteColumnModalOpen} onOpenChange={setIsDeleteColumnModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader> <DialogTitle>Delete Column</DialogTitle></DialogHeader>
                    <p> Are you sure you want to delete the entire column for <strong>{columnToDelete}</strong>? This action cannot be undone.</p>
                    <DialogFooter><Button variant="outline" onClick={() => setIsDeleteColumnModalOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDeleteColumn}>Delete</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Lab;
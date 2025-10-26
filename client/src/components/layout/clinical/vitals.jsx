import React from "react"; 
import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive, Calendar, AlertTriangle, Download, FileText, X, Trash2 } from "lucide-react";

// Mock data for initial vitals

const vitals = () => { 

    const initialDates = ["10/15/2025", "9/3/2025", "8/3/2025"];
    const [dates, setDates] = useState(initialDates);  

    const initialVitals = [
        {
            id: 1,
            test: "Blood Pressure",
            unit: "mmHg",
            "10/15/2025": "118/76",
            "9/3/2025": "120/80",
            "8/3/2025": "115/75"
        },
        {
            id: 2,
            test: "Temperature",
            unit: "°C",
            "10/15/2025": "36.9",
            "9/3/2025": "36.8",
            "8/3/2025": "36.7"
        },
        {
            id: 3,
            test: "Weight",
            unit: "kg",
            "10/15/2025": "64.8",
            "9/3/2025": "65.0",
            "8/3/2025": "63.9"
        },
        {
            id: 4,
            test: "Height",
            unit: "cm",
            "10/15/2025": "170",
            "9/3/2025": "170",
            "8/3/2025": "170"
        },
        {
            id: 5,
            test: "Heart Rate",
            unit: "bpm",
            "10/15/2025": "70",
            "9/3/2025": "72",
            "8/3/2025": "68"
        },
        {
            id: 6,
            test: "Respiratory Rate",
            unit: "breaths/min",
            "10/15/2025": "15",
            "9/3/2025": "16",
            "8/3/2025": "15"
        },
        {
            id: 7,
            test: "BMI",
            unit: "kg/m²",
            "10/15/2025": "22.4",
            "9/3/2025": "22.5",
            "8/3/2025": "22.1"
        }
    ];


    const [editingCell, setEditingCell] = useState(null); 

    const [vitalsData, setVitalsData] = useState(initialVitals);

    const handleCellUpdate = (rowIndex, columnId, value) => {
        const updateData = vitalsData.map((row, index) => {
            if (index === rowIndex) {
                return {...row, [columnId]: value }; 
            }
            return row; 
        }); 

        setVitalsData(updateData); 
    }

    // HOW TO RENDER OTHER FILES OR OTHER VALUES 
    const renderCellContent = (value) => {
        if (typeof value === 'object' && value !== null) {
            const FileIcon = <FileText className="w-3 h-3 text-blue-500"/> 
            const renderFile = (name) => {
                <div 
                key={name} 
                className="flex items-center gap-1"
                > 
                    {FileIcon}
                    <span className="text-blue-500 text-xs cursor-pointer hover:underline"> {name} </span>
                </div>
            };  

            if (value.type === 'file') {
                return renderFile(value.name); 
            } 

            if (value.type === 'files') {
                return <div className="space-y-1"> 
                    {value.files.map(renderFile)}
                </div>
            }
        }
        return value || "-"; 
     } 

     // COMPONENT FOR AN EDITABLE CELL 
     const EditableCell = ({ value, rowIndex, columnId}) => {
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
                onClick={''}
                className="cursor-pointer min-h-[32px] flex items-center justify-center p-2 -m-2" // Added padding for easier clicking
            > 
                {value || "-"}
            </div>
        )
     }

    return (
        <div className="bg-white rounded-[23px] border-2 border-container p-6"> 

            {/* --- CONTAINER --- */} 
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">

                <p className="text-xl font-bold"> Vitals  </p> 

                <div className="flex gap-2 flex-wrap"> 
                    <Button variant="outline" className="flex items-center gap-2"> <Download className="w-4 h-4" />Export</Button>
                </div>
            </div> 

            {/* --- Vitals Table --- */} 
            <div className="overflow-x-auto "> 
                
                <Table>

                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold"> Vitals test </TableHead> 

                            {dates.map((date) => (
                                <TableHead key={date} className="text-white font-semibold text-center min-w-32 group relative"> 
                                    {date}
                                    <Button variant="ghost" size="sm" onClick={''} className="h-6 w-6 p-0 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"> <X className="h-4 w-4 text-red-400" /> </Button>
                                </TableHead>
                            ))} 
                            <TableHead className="text-white font-semibold text-center min-w-24"> Actions </TableHead>

                        </TableRow>
                    </TableHeader> 

                    <TableBody> 
                        {initialVitals.map((row, rowIndex) => (
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
                                            <Button variant="ghost" size="sm" onClick={''} className="h-8 w-8 p-0 text-red-600 hover:text-red-700"> <Trash2 className="h-4 w-4" /> </Button>
                                        </div>
                                    </TableCell>

                            </TableRow> 
                        ))}
                    </TableBody>

                </Table> 
            </div>

        </div>
    )
}

export default vitals; 
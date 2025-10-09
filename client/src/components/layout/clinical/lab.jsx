import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download } from "lucide-react";

const Lab = () => {
    const labData = [
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
    ];

    const dates = ["11/3/2025", "10/15/2025", "9/3/2025", "3/31/2025", "8/3/2024"];

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
                <Button variant="modify" className="flex items-center gap-2">
                    Add To Table
                    <Download className="w-4 h-4" />
                </Button>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Lab; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Shield, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/healthParsing';
import { RISK_LEVELS, CHART_COLORS } from '@/components/layout/dashboard/domain/riskRules';

const ITEMS_PER_PAGE = 6;

const AtRiskCohortTable = ({ data }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handleViewProfile = (patient) => {
    navigate('/profile', { 
      state: { 
        recordId: patient.uuid,
        recordName: patient.name 
      } 
    });
  };

  if (data.length === 0) {
    return (
      <Card className="bg-white shadow-md border-2 border-outline">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: CHART_COLORS.PRIMARY }} />
            At-Risk Cohort
          </CardTitle>
          <p className="text-sm text-gray-500">
            Patients requiring immediate attention or follow-up
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No at-risk patients found. All patients are within healthy ranges.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md border-2 border-outline">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" style={{ color: CHART_COLORS.PRIMARY }} />
          At-Risk Cohort
        </CardTitle>
        <p className="text-sm text-gray-500">
          Patients requiring immediate attention or follow-up
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Patient Name</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Risk Factors</TableHead>
                <TableHead className="font-semibold">Last Checkup</TableHead>
                <TableHead className="font-semibold text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((patient, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {patient.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        patient.status === RISK_LEVELS.CRITICAL
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs truncate">
                    {patient.chronicFactor}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(patient.lastCheckup)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2"
                      style={{ borderColor: CHART_COLORS.PRIMARY, color: CHART_COLORS.PRIMARY }}
                      onClick={() => handleViewProfile(patient)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {data.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {endIndex} of {data.length} patients
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 px-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 p-0 ${currentPage === pageNum ? 'text-white' : ''}`}
                    style={currentPage === pageNum ? { backgroundColor: CHART_COLORS.PRIMARY } : {}}
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AtRiskCohortTable;

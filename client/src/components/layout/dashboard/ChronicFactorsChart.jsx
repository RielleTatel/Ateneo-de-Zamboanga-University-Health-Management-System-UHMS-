/**
 * Chronic Risk Factors Bar Chart Component
 * Displays prevalence of chronic risk factors
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { CHART_COLORS } from '@/domain/riskRules';

const ChronicFactorsChart = ({ data }) => {
  return (
    <Card className="bg-white shadow-md border-2 border-outline">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5" style={{ color: CHART_COLORS.PRIMARY }} />
          Chronic Risk Factors
        </CardTitle>
        <p className="text-sm text-gray-500">Prevalence of risk factors</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={70} />
            <Tooltip />
            <Bar dataKey="count" fill={CHART_COLORS.PRIMARY} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChronicFactorsChart;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { CHART_COLORS } from '@/components/layout/dashboard/domain/riskRules';

const DepartmentChronicChart = ({ data }) => {
  return (
    <Card className="bg-white shadow-md border-2 border-outline">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="h-5 w-5" style={{ color: CHART_COLORS.PRIMARY }} />
          Chronic Risk Factor Distribution
        </CardTitle>
        <p className="text-sm text-gray-500">
          Departments ranked by share of students with chronic risk factors
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            stackOffset="expand"
            margin={{ left: 40, right: 10, top: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} />
            <YAxis 
              type="category" 
              dataKey="department" 
              width={140} 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <Tooltip
              formatter={(value, name) => [`${Math.round(value * 100)}%`, name]}
            />
            <Legend />
            <Bar dataKey="smoking" stackId="chronic" fill={CHART_COLORS.CHRONIC_FACTORS.SMOKING} name="Smoking" />
            <Bar dataKey="drinking" stackId="chronic" fill={CHART_COLORS.CHRONIC_FACTORS.DRINKING} name="Drinking" />
            <Bar dataKey="hypertension" stackId="chronic" fill={CHART_COLORS.CHRONIC_FACTORS.HYPERTENSION} name="Hypertension" />
            <Bar dataKey="diabetes" stackId="chronic" fill={CHART_COLORS.CHRONIC_FACTORS.DIABETES} name="Diabetes" />
            <Bar dataKey="none" stackId="chronic" fill={CHART_COLORS.CHRONIC_FACTORS.NONE} name="None" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Bars represent 100% of each department; identify departments with highest chronic risk factor prevalence.
        </p>
      </CardContent>
    </Card>
  );
};

export default DepartmentChronicChart;

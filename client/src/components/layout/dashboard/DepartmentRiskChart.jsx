import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
  CHART_COLORS,
  RISK_COLORS,
  RISK_LEVELS
} from '@/components/layout/dashboard/domain/riskRules';

const DEPARTMENT_ABBREVIATIONS = {
  'Science, Information Technology, and Engineering Academic Organization': 'SITEAO',
  'Liberal Arts Academic Organization': 'LAAO',
  'Education Academic Organization': 'EAO',
  'Nursing Academic Organization': 'NAO',
  'Accountancy Academic Organization': 'AAO',
  'Management Academic Organization': 'MAO',

  'School of Management and Accountancy': 'SMA',
  'School of Liberal Arts': 'SLA',
  'College of Science, Information Technology, and Engineering': 'CSITE',
  'School of Education': 'SOE',
  'College of Nursing': 'CON', 
  'Others': 'Others'
};

const DepartmentRiskChart = ({ data }) => {
  return (
    <Card className="bg-white shadow-md border-2 border-outline">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp
            className="h-5 w-5"
            style={{ color: CHART_COLORS.PRIMARY }}
          />
          Critical Risk Ranker
        </CardTitle>
        <p className="text-sm text-gray-500">
          Departments ranked by share of students in each risk zone
        </p>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            stackOffset="expand"
            margin={{ left: 100, right: 10, top: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              type="number"
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
            />

            <YAxis
              type="category"
              dataKey="department"
              width={120}
              interval={0}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                DEPARTMENT_ABBREVIATIONS[value] || value
              }
            />

            <Tooltip
              formatter={(value, name) => [
                `${Math.round(value * 100)}%`,
                name
              ]}
              labelFormatter={(label) =>
                DEPARTMENT_ABBREVIATIONS[label]
                  ? `${DEPARTMENT_ABBREVIATIONS[label]} – ${label}`
                  : label
              }
            />

            <Legend />

            <Bar
              dataKey="green"
              stackId="risk"
              fill={RISK_COLORS[RISK_LEVELS.NORMAL]}
              name="Green (Normal)"
            />
            <Bar
              dataKey="yellow"
              stackId="risk"
              fill="#eab308"
              name="Yellow (At Risk)"
            />
            <Bar
              dataKey="red"
              stackId="risk"
              fill={RISK_COLORS[RISK_LEVELS.CRITICAL]}
              name="Red (Critical)"
            />
          </BarChart>
        </ResponsiveContainer>

        <p className="text-xs text-gray-500 mt-2 text-center">
          Bars represent 100% of each department; the longer the red segment,
          the higher the urgency for intervention.
        </p>
      </CardContent>
    </Card>
  );
};

export default DepartmentRiskChart;

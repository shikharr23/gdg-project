import React from 'react';
import { Chart } from 'react-google-charts';

export default function Charts({ overall, subjects }) {
  if (!overall || !subjects) return null;

  const overallData = [
    ['Status', 'Count'],
    ['Attended', overall.attended],
    ['Missed', Math.max(0, overall.total - overall.attended)],
  ];

  const subjectsData = [
    ['Subject', 'Attendance %'],
    ...subjects.map((s) => [s.subjectName, Number(s.attendancePct)]),
  ];

  const columnOptions = {
    title: 'Attendance % by Subject',
    legend: { position: 'none' },
    vAxis: { minValue: 0, maxValue: 100 },
    height: 300,
  };

  const pieOptions = {
    title: 'Overall Attendance',
    pieHole: 0.4,
    height: 300,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="card p-4 bw-border">
        <Chart
          chartType="PieChart"
          data={overallData}
          options={pieOptions}
          width="100%"
          loader={<div>Loading chart...</div>}
        />
      </div>

      <div className="card p-4 bw-border">
        <Chart
          chartType="ColumnChart"
          data={subjectsData}
          options={columnOptions}
          width="100%"
          loader={<div>Loading chart...</div>}
        />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "../../styles/EmployeeReports.css"; // Create this CSS file

function EmployeeReports() {
  const [reports] = useState([
    { id: 1, title: "Monthly Performance", progress: 88, type: "Performance" },
    { id: 2, title: "Attendance Summary", progress: 94, type: "Attendance" },
    { id: 3, title: "Task Completion", progress: 76, type: "Task" },
  ]);

  return (
    <div className="employee-reports">
      <h2>📊 Employee Reports</h2>
      <p className="subtitle">
        Review your performance metrics, attendance, and progress reports.
      </p>

      <div className="report-cards">
        {reports.map((report) => (
          <div key={report.id} className="report-card">
            <h3>{report.title}</h3>
            <p>Type: {report.type}</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${report.progress}%` }}
              >
                {report.progress}%
              </div>
            </div>

            <button className="download-btn">⬇️ Download Report</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeReports;
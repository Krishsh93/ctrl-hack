import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import HealthScore from './HealthScore';

function PatientDashboard() {
  const patientEmail = localStorage.getItem("email");

  const [showPatientAnalysis, setShowPatientAnalysis] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const [showHealthScore, setShowHealthScore] = useState(false);

  const fetchHistoricalData = async () => {
    try {
      const historyResponse = await axios.get(process.env.REACT_APP_API + `/patient/${patientEmail}`, {
        email: patientEmail,
      });
      setHistoricalData(historyResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const getLineChartData = () => {
    const dates = historicalData.healthReport?.predictions?.map((data) => new Date(data.date).toLocaleDateString());
    const normalValues = historicalData.healthReport?.predictions?.map((data) => data.normalPercentage);
    const hemorrhageValues = historicalData.healthReport?.predictions?.map((data) => data.hemorrhagicPercentage);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Healthy Percentage',
          data: normalValues,
          borderColor: '#4CAF50',
          fill: false,
        },
        {
          label: 'Hemorrhage Percentage',
          data: hemorrhageValues,
          borderColor: '#F44336',
          fill: false,
        }
      ],
    };
  };

  return (
    <>
      {showHealthScore && (<HealthScore patientEmail={patientEmail} />)}

      {showPatientAnalysis && (
        <div className="w-full px-4"> {/* Removed negative margins and used padding */}
          <div className="flex gap-4 mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setShowPatientAnalysis(false);
                setShowHealthScore(true);
              }}
            >
              AI Matrices Analysis
            </button>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Box 1: Patient Age (spanning all columns) */}
            <div className="col-span-12 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800">Age</h3>
              <p className="text-3xl font-bold text-green-500">{historicalData.profile?.age || '20'}</p>
            </div>

            {/* Box 2: Water Intake (spanning half the columns) */}
            <div className="col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800">Water Intake</h3>
              <p className="text-3xl font-bold text-yellow-500">{historicalData.waterIntake || '3'} L</p>
            </div>

            {/* Box 3: Sleep Hours (spanning half the columns) */}
            <div className="col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800">Sleep Hours</h3>
              <p className="text-3xl font-bold text-blue-500">{historicalData.sleepHours || '8'} hrs</p>
            </div>

            {/* Line Chart for Previous Diagnosis History (spanning all columns) */}
            <div className="col-span-12 bg-white shadow-lg rounded-sm border border-slate-200 p-4">
              <h2 className="text-xl font-semibold mb-2">Previous Diagnosis History:</h2>
              <div className="w-full h-80">
                <Line data={getLineChartData()} />
              </div>
            </div>

            {/* Health Score */}
            <div className="col-span-12 flex justify-center bg-white shadow-lg rounded-sm border border-slate-200 p-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Health Score:</h2>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={historicalData.HealthScore || 0}
                    text={`${historicalData.HealthScore || 0}`}
                    styles={buildStyles({
                      pathColor: '#4a90e2',
                      textColor: '#4a90e2',
                      trailColor: '#d6d6d6',
                      textSize: '18px',
                      strokeWidth: 8,
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PatientDashboard;

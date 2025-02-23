import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import HealthScore from './HealthScore';
import { io } from "socket.io-client";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line as RechartsLine } from "recharts";

function PatientDashboard() {
  const patientEmail = localStorage.getItem("email");

  const [showPatientAnalysis, setShowPatientAnalysis] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);
  const [showHealthScore, setShowHealthScore] = useState(false);
  
  // Real-time monitoring states
  const [realtimeData, setRealtimeData] = useState([]);
  const [prediction, setPrediction] = useState("Normal");
  
  useEffect(() => {
    const socket = io("http://localhost:4000", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO Server");
    });

    socket.on("healthData", (newData) => {
      console.log("Received real-time data:", newData);
      setRealtimeData(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), ...newData }]);
    });

    socket.on("prediction", (pred) => {
      setPrediction(pred.risk);
    });

    return () => socket.disconnect();
  }, []);

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
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  setShowPatientAnalysis(false);
                  setShowHealthScore(true);
                }}
              >
                AI Matrices Analysis
              </button>
            </div>

            {/* Real-Time Monitoring Section */}
            <div className="mb-6">
            <div className="mb-6 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">📊 Real-Time Patient Monitoring</h2>
                <p className="text-sm">
                  Risk Prediction: <strong className={prediction === "Low Risk" ? "text-red-600" : "text-green-600"}>Low Risk</strong>
                </p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <RechartsLine type="monotone" dataKey="heartRate" stroke="red" name="Heart Rate" />
                    <RechartsLine type="monotone" dataKey="systolicBP" stroke="blue" name="Systolic BP" />
                    <RechartsLine type="monotone" dataKey="diastolicBP" stroke="green" name="Diastolic BP" />
                    <RechartsLine type="monotone" dataKey="hrv" stroke="orange" name="HRV" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Age Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Age</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-green-500">{historicalData.profile?.age || '20'}</span>
                  <span className="ml-2 text-sm text-gray-500">years</span>
                </div>
              </div>

              {/* Water Intake Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Water Intake</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-blue-500">{historicalData.waterIntake || '3'}</span>
                  <span className="ml-2 text-sm text-gray-500">liters/day</span>
                </div>
              </div>

              {/* Sleep Hours Card */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Sleep Hours</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-indigo-500">{historicalData.sleepHours || '8'}</span>
                  <span className="ml-2 text-sm text-gray-500">hours/day</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Previous Diagnosis History Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Diagnosis History</h2>
                <div className="w-full h-80">
                  <Line 
                    data={getLineChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0,0,0,0.05)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Health Score Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Score</h2>
                <div className="flex justify-center items-center h-80">
                  <div className="w-64">
                    <CircularProgressbar
                      value={historicalData.HealthScore || 0}
                      text={`${historicalData.HealthScore || 0}`}
                      styles={buildStyles({
                        pathColor: '#4CAF50',
                        textColor: '#1F2937',
                        trailColor: '#E5E7EB',
                        textSize: '20px',
                        pathTransitionDuration: 0.5,
                      })}
                    />
                  </div>
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
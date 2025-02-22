"use client"

import { useState, useEffect, useCallback } from "react"
import { Line } from "react-chartjs-2"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import axios from "axios"
import Hemorrhagic from "./Hemorrhagic"
import SymptomForm from "./SymptomForm"
import HealthScore from "./HealthScore"
import MedicalDataForm from "./BloodSample"

function PatientAnalysis({ selectedPatient }) {
  const patientEmail = selectedPatient.email

  const [activeSection, setActiveSection] = useState("overview")
  const [historicalData, setHistoricalData] = useState([])

  const fetchHistoricalData = useCallback(async () => {
    try {
      const historyResponse = await axios.get(process.env.REACT_APP_API + `/patient/${patientEmail}`)
      setHistoricalData(historyResponse.data)
    } catch (err) {
      console.error(err)
    }
  }, [patientEmail])

  useEffect(() => {
    fetchHistoricalData()
  }, [fetchHistoricalData])

  const getLineChartData = () => {
    const dates = historicalData.healthReport?.predictions?.map((data) => new Date(data.date).toLocaleDateString())
    const normalValues = historicalData.healthReport?.predictions?.map((data) => data.normalPercentage)
    const hemorrhageValues = historicalData.healthReport?.predictions?.map((data) => data.hemorrhagicPercentage)

    return {
      labels: dates,
      datasets: [
        {
          label: "Healthy Percentage",
          data: normalValues,
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Hemorrhage Percentage",
          data: hemorrhageValues,
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    }
  }

  const renderAnalysisContent = () => {
    switch (activeSection) {
      case "hemorrhagic":
        return <Hemorrhagic patientEmail={patientEmail} fetchHistoricalData={fetchHistoricalData} historicalData={historicalData} getLineChartData={getLineChartData} />
      case "diseasePrediction":
        return <SymptomForm />
      case "healthScore":
        return <HealthScore patientEmail={patientEmail} />
      case "bloodSample":
        return <MedicalDataForm />
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard title="Age" value={selectedPatient.profile?.age || "20"} unit="years" color="text-emerald-600" />
              <MetricCard title="Water Intake" value={historicalData.waterIntake || "3"} unit="L" color="text-amber-500" />
              <MetricCard title="Sleep Hours" value={historicalData.sleepHours || "8"} unit="hrs" color="text-blue-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Previous Diagnosis History</h2>
                <div className="h-80">
                  <Line data={getLineChartData()} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Health Score</h2>
                <div className="w-64 h-64">
                  <CircularProgressbar value={historicalData.HealthScore || 0} text={`${historicalData.HealthScore || 0}`} styles={buildStyles({ pathColor: "#3B82F6", textColor: "#3B82F6", trailColor: "#E5E7EB", textSize: "18px" })} />
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Patient Analysis: {selectedPatient.profile?.name?.FName}</h1>
      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "hemorrhagic", label: "Hemorrhage Diagnosis" },
            { id: "diseasePrediction", label: "Disease Prediction" },
            { id: "healthScore", label: "AI Matrices Analysis" },
            { id: "bloodSample", label: "AI Blood Sample Analysis" },
          ].map(({ id, label }) => (
            <AnalysisButton key={id} onClick={() => setActiveSection(id)}>{label}</AnalysisButton>
          ))}
        </div>
      </div>
      {renderAnalysisContent()}
    </div>
  )
}

function MetricCard({ title, value, unit, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>
        {value} <span className="text-lg font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  )
}

function AnalysisButton({ children, onClick }) {
  return (
    <button className="bg-white text-blue-600 font-semibold py-2 px-4 border border-blue-600 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors" onClick={onClick}>
      {children}
    </button>
  )
}

export default PatientAnalysis

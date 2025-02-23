import { useState, useEffect, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Brain, Activity, Stethoscope, ChartBar, HeartOff, Heart, Thermometer, Droplets } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import Hemorrhagic from "./Hemorrhagic";
import SymptomForm from "./SymptomForm";
import HealthScore from "./HealthScore";
import MedicalDataForm from "./BloodSample";

const Hexagon = ({ className, children }) => (
  <div className={`relative w-16 h-16 ${className}`}>
    <div className="absolute inset-0 transform rotate-45 bg-gradient-to-r from-white/50 to-white/20 rounded-lg backdrop-blur-sm"></div>
    <div className="absolute inset-0 flex items-center justify-center">
      {children}
    </div>
  </div>
);

function PatientAnalysis({ selectedPatient }) {
  const patientEmail = selectedPatient.email;
  const [activeSection, setActiveSection] = useState("overview");
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    try {
      const historyResponse = await axios.get(
        process.env.REACT_APP_API + `/patient/${patientEmail}`
      );
      setHistoricalData(historyResponse.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [patientEmail]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  const getLineChartData = () => {
    const dates = historicalData.healthReport?.predictions?.map((data) =>
      new Date(data.date).toLocaleDateString()
    );
    const normalValues = historicalData.healthReport?.predictions?.map(
      (data) => data.normalPercentage
    );
    const hemorrhageValues = historicalData.healthReport?.predictions?.map(
      (data) => data.hemorrhagicPercentage
    );

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
    };
  };

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Activity,
      color: "text-emerald-600",
      bgColor: "from-emerald-400 to-emerald-600",
      shadowColor: "shadow-emerald-500/50",
    },
    {
      id: "hemorrhagic",
      label: "Hemorrhage Diagnosis",
      icon: Brain,
      color: "text-red-600",
      bgColor: "from-red-400 to-red-600",
      shadowColor: "shadow-red-500/50",
    },
    {
      id: "diseasePrediction",
      label: "Disease Prediction",
      icon: Stethoscope,
      color: "text-purple-600",
      bgColor: "from-purple-400 to-purple-600",
      shadowColor: "shadow-purple-500/50",
    },
    {
      id: "healthScore",
      label: "AI Matrices Analysis",
      icon: ChartBar,
      color: "text-blue-600",
      bgColor: "from-blue-400 to-blue-600",
      shadowColor: "shadow-blue-500/50",
    },
    {
      id: "bloodSample",
      label: "AI Blood Sample Analysis",
      icon: HeartOff,
      color: "text-amber-600",
      bgColor: "from-amber-400 to-amber-600",
      shadowColor: "shadow-amber-500/50",
    },
  ];

  const renderAnalysisContent = () => {
    switch (activeSection) {
      case "hemorrhagic":
        return (
          <Hemorrhagic
            patientEmail={patientEmail}
            fetchHistoricalData={fetchHistoricalData}
            historicalData={historicalData}
            getLineChartData={getLineChartData}
          />
        );
      case "diseasePrediction":
        return <SymptomForm />;
      case "healthScore":
        return <HealthScore patientEmail={patientEmail} />;
      case "bloodSample":
        return <MedicalDataForm />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FloatingCard
                icon={<Heart className="w-8 h-8" />}
                title="Age"
                value={selectedPatient.profile?.age || "20"}
                unit="years"
                color="emerald"
              />
              <FloatingCard
                icon={<Droplets className="w-8 h-8" />}
                title="Water Intake"
                value={historicalData.waterIntake || "3"}
                unit="L"
                color="amber"
              />
              <FloatingCard
                icon={<Thermometer className="w-8 h-8" />}
                title="Sleep Hours"
                value={historicalData.sleepHours || "8"}
                unit="hrs"
                color="blue"
              />
            </div>

            <div className="grid grid-cols-1 ">
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-lg bg-opacity-80">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-600" />
                  Previous Diagnosis History
                </h2>
                <div className="h-80">
                  <Line
                    data={getLineChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true, max: 100 } },
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-lg bg-opacity-80 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <ChartBar className="w-6 h-6 text-blue-600" />
                  Health Score
                </h2>
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
                  <CircularProgressbar
                    value={historicalData.HealthScore || 0}
                    text={`${historicalData.HealthScore || 0}`}
                    styles={buildStyles({
                      pathColor: "#3B82F6",
                      textColor: "#3B82F6",
                      trailColor: "#E5E7EB",
                      textSize: "18px",
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 transform perspective-1000">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-flow"></div>
        <h1 className="text-4xl font-bold text-white flex items-center gap-3 relative z-10">
          <Hexagon className="animate-float">
            <Activity className="w-8 h-8 text-white" />
          </Hexagon>
          Patient Analysis: {selectedPatient.profile?.name?.FName}
        </h1>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-4">
          {navigationItems.map(({ id, label, icon: Icon, color, bgColor, shadowColor }) => (
            <NavigationButton
              key={id}
              onClick={() => setActiveSection(id)}
              isActive={activeSection === id}
              icon={<Icon className="w-6 h-6" />}
              bgGradient={bgColor}
              shadowColor={shadowColor}
            >
              {label}
            </NavigationButton>
          ))}
        </div>
      </div>

      <div className="transition-all duration-500 ease-in-out">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          renderAnalysisContent()
        )}
      </div>
    </div>
  );
}

function FloatingCard({ icon, title, value, unit, color }) {
  return (
    <div className={`relative group perspective-1000`}>
      <div className={`absolute inset-0 bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-2xl blur opacity-30 group-hover:opacity-40 transition-opacity`}></div>
      <div className="relative bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 backdrop-blur-lg bg-opacity-80">
        <div className={`text-${color}-600 mb-4`}>{icon}</div>
        <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
        <p className={`text-3xl font-bold text-${color}-600`}>
          {value} <span className="text-lg font-normal text-gray-500">{unit}</span>
        </p>
        <div className={`h-1 w-full mt-4 rounded-full bg-gradient-to-r from-${color}-400 to-${color}-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
      </div>
    </div>
  );
}

function NavigationButton({ children, onClick, isActive, icon, bgGradient, shadowColor }) {
  return (
    <button
      className={`relative group perspective-1000 ${isActive ? 'scale-105' : ''}`}
      onClick={onClick}
    >
      <div className={`
        absolute inset-0 bg-gradient-to-r ${bgGradient} rounded-xl blur-sm transform 
        ${isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
        group-hover:opacity-100 group-hover:scale-105 transition-all duration-500
      `}></div>
      <div className={`
        relative flex items-center gap-2 py-3 px-6 rounded-xl shadow-lg ${shadowColor}
        ${isActive ? 'bg-white text-gray-800' : 'bg-white/80 text-gray-600'}
        backdrop-blur-sm transform transition-all duration-500
        group-hover:-translate-y-1 group-hover:shadow-xl
      `}>
        <span className="transition-transform duration-300 transform group-hover:scale-110">
          {icon}
        </span>
        <span className="font-semibold">{children}</span>
      </div>
    </button>
  );
}

export default PatientAnalysis;


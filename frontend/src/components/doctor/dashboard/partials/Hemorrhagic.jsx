import React, { useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';
ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

const ImageUpload = ({
  setShowPatientAnalysis,
  showPatientAnalysis,
  showHemorrhagic,
  setShowHemorrhagic,
  patientEmail,
  fetchHistoricalData,
  getLineChartData,
  historicalData
}) => {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!file) {
      setError("Please select a file.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(`http://localhost:5000/predict_hemorrhage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const predictionData = response.data;
  
      if (!predictionData || !predictionData[0]) {
        throw new Error("Invalid prediction response from server.");
      }
  
      const formattedPrediction = {
        normalPercentage: predictionData[0][0]?.toFixed(4) * 100 || 0,
        hemorrhagicPercentage: predictionData[0][1]?.toFixed(4) * 100 || 0,
      };
  
      setPrediction(predictionData);
      setError(null);
  
      await axios.post("http://localhost:4000/patientrecord", {
        email: patientEmail,
        prediction: formattedPrediction
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      fetchHistoricalData();
    } catch (err) {
      setError("Upload Correct Image");
      console.error(err);
    }
  };

  const getChartData = () => {
    if (!prediction) return {};

    const normalPercentage = prediction[0][0].toFixed(4) * 100 || 0;
    const hemorrhagicPercentage = prediction[0][1].toFixed(4) * 100 || 0;

    return {
      labels: ['Healthy', 'Possible Hemorrhage'],
      datasets: [{
        data: [normalPercentage, hemorrhagicPercentage],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 1,
      }],
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Brain Hemorrhage Detection
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 p-8 rounded-xl border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors duration-300">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label 
                  htmlFor="file-input"
                  className="cursor-pointer block"
                >
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-700">Upload Brain Scan Image</p>
                    <p className="text-sm text-gray-500 mt-1">Click to browse or drag and drop</p>
                  </div>
                </label>
                {file && (
                  <p className="text-sm text-blue-600 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Analyze Image
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHemorrhagic(false);
                  setShowPatientAnalysis(!showPatientAnalysis);
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Patient Dashboard
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {prediction && (
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-100 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Analysis Results</h2>
              <div className="max-w-xs mx-auto">
                <Pie data={getChartData()} />
              </div>
            </div>
          )}

          {historicalData && (
            <div className="mt-8 p-6 bg-white rounded-xl border border-gray-100 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Previous Diagnosis History</h2>
              <Line data={getLineChartData()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add custom animation keyframes
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default ImageUpload;
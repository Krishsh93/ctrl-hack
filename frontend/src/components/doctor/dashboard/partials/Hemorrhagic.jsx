import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';


// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);


const ImageUpload = ({setShowPatientAnalysis,showPatientAnalysis,showHemorrhagic,setShowHemorrhagic,patientEmail,fetchHistoricalData,getLineChartData,historicalData}) => {
  
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
  
      // Store response data immediately to avoid using outdated state
      const predictionData = response.data;
  
      if (!predictionData || !predictionData[0]) {
        throw new Error("Invalid prediction response from server.");
      }
  
      const formattedPrediction = {
        normalPercentage: predictionData[0][0]?.toFixed(4) * 100 || 0,
        hemorrhagicPercentage: predictionData[0][1]?.toFixed(4) * 100 || 0,
      };
  
      setPrediction(predictionData); // Now update the state
      setError(null);
  
      console.log(patientEmail);
      console.log(formattedPrediction);
  
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
      setError("Error uploading the file.");
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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload an Image for Prediction</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={()=>{
            setShowHemorrhagic(false)
            setShowPatientAnalysis(!showPatientAnalysis)}}
        >
          Go to Patient Dashboard 
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {prediction && (
        <div className="mt-4 w-full max-w-xs">
          <h2 className="text-xl font-semibold mb-2">Prediction Results:</h2>
          <Pie data={getChartData()} />
        </div>
      )}
      {historicalData && (
        <div className="mt-4 w-full">
          <h2 className="text-xl font-semibold mb-2">Previous Diagnosis History:</h2>
          <Line data={getLineChartData()} />
        </div>
      )}
    </div>
  );
};


export default ImageUpload;



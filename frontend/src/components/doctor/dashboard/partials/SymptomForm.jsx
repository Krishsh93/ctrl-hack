// src/components/SymptomForm.js
import React, { useState } from 'react';
import axios from 'axios';

const SymptomForm = ({setShowPatientAnalysis,setShowDiseasePrediction}) => {
  const [symptoms, setSymptoms] = useState([]);
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddSymptom = () => {
    if (input && !symptoms.includes(input)) {
      setSymptoms([...symptoms, input]);
      setInput('');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000//predict_symptoms', { symptoms });
      setPrediction(response.data.predicted_label);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : 'Something went wrong');
      setPrediction(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Disease Prediction</h1>
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a symptom"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleAddSymptom}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Symptom
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Symptoms List:</h2>
        <ul className="list-disc ml-6">
          {symptoms.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Predict Disease
      </button>
      <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={()=>{
            setShowDiseasePrediction(false)
            setShowPatientAnalysis(true)}}
        >
          Go to Patient Dashboard 
        </button>
      {prediction && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Prediction:</h2>
          <p>{prediction.join(', ')}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default SymptomForm;

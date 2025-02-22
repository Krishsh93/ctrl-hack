import React, { useState } from 'react';
import axios from 'axios';

const MedicalDataForm = () => {
  const [formData, setFormData] = useState({
    rbc: '',
    pcv: '',
    mcv: '',
    mch: '',
    rdw: '',
    tlc: '',
    plt_mm3: '',
    hgb: '',
    age: '',
    sex: '',
    mchc: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/predict_blood', {
        RBC: formData.rbc,
        PCV: formData.pcv,
        MCV: formData.mcv,
        MCH: formData.mch,
        RDW: formData.rdw,
        TLC: formData.tlc,
        'PLT /mm3': formData.plt_mm3,
        HGB: formData.hgb,
        Age: formData.age,
        MCHC: formData.mchc,
        Sex: formData.sex
        
      });

      // Assuming the response contains the model's prediction
      setResult(response.data.disease);
    } catch (err) {
      setError('Failed to fetch the result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Medical Data Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Input Fields */}
        {['rbc', 'pcv', 'mcv', 'mch', 'rdw', 'tlc', 'plt_mm3', 'hgb', 'age', 'sex', 'mchc'].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">{field.toUpperCase()}</label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={`Enter ${field.toUpperCase()} value`}
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Display Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <h3 className="text-lg font-semibold">Model Prediction Result:</h3>
          <p>{JSON.stringify(result)}</p>
        </div>
      )}

      {/* Display Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalDataForm;

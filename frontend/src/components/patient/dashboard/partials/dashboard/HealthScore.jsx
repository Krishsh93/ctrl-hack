import { set } from 'lodash';
import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
// import './App.css'; // Import the CSS file to apply the theme

const HealthScore = ({patientEmail}) => {
    const [sleepDuration, setSleepDuration] = useState(7);
    const [qualityOfSleep, setQualityOfSleep] = useState(7);
    const [physicalActivityLevel, setPhysicalActivityLevel] = useState(60);
    const [stressLevel, setStressLevel] = useState(5);
    const [dailySteps, setDailySteps] = useState(5000);
    const [bmiCategory, setBmiCategory] = useState('Normal Weight');
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sleep_duration: sleepDuration,
                quality_of_sleep: qualityOfSleep,
                physical_activity_level: physicalActivityLevel,
                stress_level: stressLevel,
                daily_steps: dailySteps,
                bmi_category: bmiCategory
            }),
        });

        const data = await response.json();
        setResult(data);
        try {
            const historyResponse = await axios.post(process.env.REACT_APP_API + `/patient/healthscore/${patientEmail}`, {
              email: patientEmail,HealthScore:data.health_score
            });
            
          } catch (err) { console.error(err); }
        
        
        
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <br />
            <h1 className="font-semibold text-slate-800">AI Health Matrices Analysis</h1>
            <br />
            {!result && (
                <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                    {/* Sliders and Dropdown */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Sleep Duration (hours)</label>
                        <input
                            type="range"
                            min="0"
                            max="12"
                            value={sleepDuration}
                            onChange={(e) => setSleepDuration(Number(e.target.value))}
                            className="w-full"
                        />
                        <span>{sleepDuration} hours</span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Quality of Sleep (1-10)</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={qualityOfSleep}
                            onChange={(e) => setQualityOfSleep(Number(e.target.value))}
                            className="w-full"
                        />
                        <span>{qualityOfSleep}</span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Physical Activity Level (minutes)</label>
                        <input
                            type="range"
                            min="0"
                            max="120"
                            value={physicalActivityLevel}
                            onChange={(e) => setPhysicalActivityLevel(Number(e.target.value))}
                            className="w-full"
                        />
                        <span>{physicalActivityLevel} minutes</span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Stress Level (1-10)</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={stressLevel}
                            onChange={(e) => setStressLevel(Number(e.target.value))}
                            className="w-full"
                        />
                        <span>{stressLevel}</span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Daily Steps</label>
                        <input
                            type="range"
                            min="0"
                            max="20000"
                            value={dailySteps}
                            onChange={(e) => setDailySteps(Number(e.target.value))}
                            className="w-full"
                        />
                        <span>{dailySteps} steps</span>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">BMI Category</label>
                        <select
                            value={bmiCategory}
                            onChange={(e) => setBmiCategory(e.target.value)}
                            className="w-full bg-gray-200 border border-gray-300 rounded-lg p-2"
                        >
                            <option value="Underweight">Underweight</option>
                            <option value="Normal Weight">Normal Weight</option>
                            <option value="Overweight">Overweight</option>
                            <option value="Obesity">Obesity</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Submit
                    </button>

                    {/* Health Score and Messages */}


                </div>)}
            {result && (
                <div className="mt-8 text-center">
                    <div>
                        <p className="text-lg font-semibold">{result.sleep_message}</p>
                        <p className="text-lg font-semibold">{result.water_message}</p>
                    </div>
                    <br />
                    <div className="mb-4">
                        <CircularProgressbar
                            value={result.health_score}
                            text={`${result.health_score}`}
                            styles={buildStyles({
                                pathColor: '#4a90e2',
                                textColor: '#4a90e2',
                                trailColor: '#d6d6d6',
                                textSize: '18px',
                                strokeWidth: 8,
                            })}
                        />
                    </div>
                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => {
                            
                            setResult(null);
                        }}
                    >
                        Go back
                    </button>

                </div>
            )}
        </div>
    );
};

export default HealthScore;

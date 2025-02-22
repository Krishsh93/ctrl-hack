import React, { useEffect, useState } from 'react';
import Image01 from '../images/user-36-05.jpg';
import Image02 from '../images/user-36-04.jpg';
import Image03 from '../images/user-36-07.jpg';
import Image04 from '../images/user-36-08.jpg';
import Image05 from '../images/user-36-09.jpg';
import PatientAnalysis from './PatientAnalysis';
import axios from 'axios';

function Doctors() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showPatientAnalysis, setShowPatientAnalysis] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/patients`);
      setPatients(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setPatients([]); // Clear patients data if there's an error
    }
  };

  const handlePatientAnalysisClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientAnalysis(true);
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      {showPatientAnalysis ? (
        <PatientAnalysis selectedPatient={selectedPatient}/>
      ) : (
        <>
          <header className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Patients</h2>
          </header>
          <div className="p-3">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Name</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Email</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-left">Gender</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Patient Analysis</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {patients.map((patient) => (
                    <tr key={patient._id}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                            <img
                              className="rounded-full"
                              src={Image02}
                              width="40"
                              height="40"
                              alt="Patient"
                            />
                          </div>
                          <div className="font-medium text-slate-800">
                            {patient.profile?.name?.FName} {patient.profile?.name?.LName}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{patient.email}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">
                          {patient.profile?.gender}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <button
                          className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md group"
                          onClick={()=>handlePatientAnalysisClick(patient)}
                        >
                          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              ></path>
                            </svg>
                          </span>
                          <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
                            View
                          </span>
                          <span className="relative invisible">View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Doctors;

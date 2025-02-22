import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image02 from '../../images/user-36-04.jpg';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/doctors`);
      setDoctors(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setDoctors([]);
    }
  };

  const handleBookAppointment = (doctor) => {
    alert(`Appointment booked with Dr. ${doctor.profile?.name?.FName} ${doctor.profile?.name?.LName}`);
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Doctors</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-50">
              <tr>
                <th className="p-2 whitespace-nowrap">Name</th>
                <th className="p-2 whitespace-nowrap">Email</th>
                <th className="p-2 whitespace-nowrap">Degree</th>
                <th className="p-2 whitespace-nowrap">Fees</th>
                <th className="p-2 whitespace-nowrap">Mobile</th>
                <th className="p-2 whitespace-nowrap text-center">Book Appointment</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                        <img className="rounded-full" src={Image02} width="40" height="40" alt="Doctor" />
                      </div>
                      <div className="font-medium text-slate-800">
                        {doctor.profile?.name?.FName} {doctor.profile?.name?.LName}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">{doctor.email}</td>
                  <td className="p-2 whitespace-nowrap">{doctor.profile?.degree}</td>
                  <td className="p-2 whitespace-nowrap">${doctor.profile?.fees}</td>
                  <td className="p-2 whitespace-nowrap">{doctor.profile?.mobile}</td>
                  <td className="p-2 whitespace-nowrap">
                    <button
                      className="bg-purple-500 text-white py-2 px-4 rounded-full hover:bg-purple-600"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DoctorsList;

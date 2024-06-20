import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const InputField = ({ id, label, type, value, error, onChange }) => (
  <div className="mb-5">
    <label htmlFor={id} className="block mb-2 font-medium text-gray-900">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      className={`shadow-sm bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={onChange}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// AddMedication Component
const AddMedication = () => {

  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    date: '',
    time: '',
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [id]: '' }));
  }

  const validateFormData = () => {
    const { name, date, time } = formData;
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!date) {
      newErrors.date = 'Date is required';
    } else if (!dateRegex.test(date)) {
      newErrors.date = 'Invalid date format (YYYY-MM-DD)';
    } else if (new Date(date) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.date = 'Date cannot be in the past';
    }

    if (!time) {
      newErrors.time = 'Time is required';
    } else if (!timeRegex.test(time)) {
      newErrors.time = 'Invalid time format (HH:MM)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFormData()) {
      const data = {
        name: formData.name,
        start_date: formData.date,
        time: formData.time,
        notes: "Take with Water",
        form_type: "oto",
        routing: "oto",
      };

      try {

        const response = await fetch(`${import.meta.env.VITE_APP_API}/panel/medication/api/${id ? 'update/' + id : 'add'}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.status == 200) {
          console.log(result);
          alert("updated successfully")
        } else {
          console.error(result);
          alert(result.message);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form. Please try again.');
      }
    }
  };

  //  ============  for time convert HH:MM:SS to HH:MM  ================= // 
  const convertTimeToHHMM = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    return `${hours}:${minutes}`;
  }
  
  //  ================ for Update Fetch the previous data =============== //
  const fetchDataForUpdate = useCallback(async () => {
    if (id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API}/panel//medication/api/fetch/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
        });

        const result = await response.json();
        if (response.status == 200) {

          setFormData({
            name: result.name,
            date: result.start_date,
            time: convertTimeToHHMM(result.time),
          });
        } else {
          console.error(result);
          alert(result.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching the data. Please try again.');
      }
    }
  }, [id]);

  useEffect(() => {
    fetchDataForUpdate();
  }, [fetchDataForUpdate]);

  return (
    <form className="max-w-sm mx-auto">
      <InputField id="name" label="Name" type="text" value={formData.name} error={errors.name} onChange={handleInputChange} />
      <InputField id="date" label="Date" type="date" value={formData.date} error={errors.date} onChange={handleInputChange} />
      <InputField id="time" label="Time" type="time" value={formData.time} error={errors.time} onChange={handleInputChange} />
      <div className="mb-5 mt-5">
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center" onClick={handleSubmit} >
        {id ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default AddMedication;

import React, { useState } from 'react'


const AddMedication = () => {

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    // image: null
  });

  const [errors, setErrors] = useState({
    name: '',
    date: '',
    time: '',
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' });
  };

  const validateFormData = () => {
    let isValid = true;
    let newErrors = { ...errors };

    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (formData.date === '') {
      newErrors.date = 'Date is required';
      isValid = false;
    }

    if (formData.time === '') {
      newErrors.time = 'Time is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateFormData()) {
      const data = {
        name: formData.name,
        start_date: formData.date,
        time: formData.time,
        // image: formData.image,
        notes: "Take with Water",
        form_type: "oto",
        routing: "oto"
      }
      console.log(data);
      const response = await fetch('http://localhost:8080/panel/medication/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log(result);
      if (response.status === 200) {
        console.log(result);
        // window.location.href = '/dashboard';
      } else {
        console.log(result);
        alert(result.message);
      }
    }

  }

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <label htmlFor="name" className="block mb-2  font-medium text-gray-900 dark:text-white">Name</label>
        <input type="text" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" onChange={handleInputChange} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="date" className="block mb-2  font-medium text-gray-900 dark:text-white">Date</label>
        <input type="date" id="date" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" onChange={handleInputChange} />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="repeat-time" className="block mb-2  font-medium text-gray-900 dark:text-white">Time</label>
        <input type="time" id="time" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" onChange={handleInputChange} />
        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
      </div>

      <div className="mb-5 mt-5">
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>Submit</button>
      </div>
    </form>
  )
}

export default AddMedication
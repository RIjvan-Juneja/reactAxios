import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useFetch from "../customeHooks/useFetch";


const InputField = ({ id, label, type, value, error, onChange, register }) => (
  <div className="mb-2">
    <label htmlFor={id} className="block mb-2 font-medium text-gray-900">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      {...register(id)}
      className={`shadow-sm bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
      onChange={onChange}
    />

    <p className={`text-red-500 text-sm mt-1 ${error ? ' ' : 'invisible'}`}>{(error) ? error : "."}</p>
  </div>
);

// AddMedication Component
const AddMedication = () => {

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    date: yup.date().required('Date is required').min(new Date(), 'Date cannot be in the past'),
    time: yup.string().required('Time is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    routing: yup.string().required('Routing is required'),
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, post } = useFetch();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  }); 

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setValue(id, value);
  };


  const onSubmit = async (data) => {
    console.log("hello");
    // Your submit logic here
    console.log(data);
    try {
      const response = await post(`/panel/medication/api/${id ? 'update/' + id : 'add'}`, data, null, null);
      if (response.status === 200) {
        alert(response.data.status);
      } else {
        alert('Error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  //  ============  for time convert HH:MM:SS to HH:MM  ================= // 
  const convertTimeToHHMM = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    return `${hours}:${minutes}`;
  }

  //  ================ for Update Fetch the previous data =============== //
  // const fetchDataForUpdate = useCallback(async () => {
  //   if (id) {
  //     try {
  //       const response = await post(`/panel/medication/api/fetch/${id}`, null, null, null);
  //       console.log(response);
  //       if (response.status == 200) {
  //         setFormData({
  //           name: response.data.name,
  //           date: response.data.start_date,
  //           time: convertTimeToHHMM(response.data.time),
  //           routing: response.data.recurrence
  //         });
  //       } else {
  //         console.error(response.data);
  //         alert("Error");
  //         navigate("/listmedication")
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       alert('An error occurred while fetching the data. Please try again.');
  //     }
  //   }
  // }, [id]);
  const fetchDataForUpdate = async () => {
    if (id) {
      try {
        const response = await post(`/panel/medication/api/fetch/${id}`, null, null, null);
        console.log(response);
        if (response.status === 200) {
          const { name, start_date, time, recurrence } = response.data;
          setValue('name', name);
          setValue('date', start_date);
          setValue('time', convertTimeToHHMM(time));
          setValue('routing', recurrence);
        } else {
          console.error(response.data);
          alert('Error');
          navigate('/listmedication');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching the data. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchDataForUpdate();
  }, []);

  return (
    <form className="max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
      <InputField id="name" label="Name" type="text" error={errors.name?.message} onChange={handleInputChange} register={register} />
      <InputField id="date" label="Date" type="date" error={errors.date?.message} onChange={handleInputChange} register={register} />
      <InputField id="time" label="Time" type="time" error={errors.time?.message} onChange={handleInputChange} register={register} />

      <div className="mb-5">
        <label htmlFor="routing" className="block mb-2 font-medium text-gray-900">Routing</label>
        <select {...register('routing')} id="routing" onChange={handleInputChange} className={`block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.routing ? 'border-red-500' : 'border-gray-300'}`}>
          <option value="">Choose a Routing</option>
          <option value="oto">One Time Only</option>
          <option value="weekly">Weekly</option>
        </select>
        <p className={`text-red-500 text-sm mt-1 ${errors.routing ? ' ' : 'invisible'}`}> {(errors.routing) ? errors.routing?.message : ". "}</p>
      </div>

      <div className="mb-5 mt-5">
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center " onClick={handleSubmit} >
          {id ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default AddMedication;

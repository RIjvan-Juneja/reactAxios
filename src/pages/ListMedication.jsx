import  { useEffect, useState } from 'react'
import { Trash2, ClipboardPen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListMedication = () => {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API}/panel/medication/api/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });
      const result = await response.json();
      if (response.status === 200) {
        console.log(result);
        setData(result);
      } else {
        setData("error")
        setError("Server is busy. Please try again later.");
        alert(result.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Server is busy. Please try again later.");
    }

  }

  const deleteMedication = async (id) => {
    console.log(id);
    try { 
      const response = await fetch(`${import.meta.env.VITE_APP_API}/panel/medication/api/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
      });
      const result = await response.json();
      if (response.status === 200) {
        setData(data.filter(medication => medication.id !== id));
        alert(result.status);
      } else {
        setError("Failed to delete the medication. Please try again later.");
        alert(result.status);
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      setError("Failed to delete the medication. Please try again later.");
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-16 py-3">
                <span className="sr-only">Image</span>
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                recurrence
              </th>
              <th scope="col" className="px-6 py-3">
                start_date
              </th>
              <th scope="col" className="px-6 py-3">
                end_date
              </th>
              <th scope="col" className="px-6 py-3">
                time
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>

            {(data && data.length <= 0)? (
              <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                <td colSpan={7} className='px-6 py-4 text-center'>No data Found</td>
              </tr>
            ) : (

              data.map((el, i) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={i + 1}>
                  <td className="p-4">
                    <img src={el.image} className="w-16 md:w-32 max-w-full max-h-full" alt="Apple Watch" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {el.name}
                  </td>
                  <td className="px-6 py-4">
                    {el.recurrence}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {el.start_date}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {el.end_date}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {el.time}
                  </td>
                  <td className="px-6 py-4">
                    <button type='button' onClick={()=> { navigate(`/addmedication/${el.id}`) }} className="font-medium ml-2 text-red-600 dark:text-red-500 hover:underline">  <ClipboardPen /></button>
                    <button type='button' onClick={() => deleteMedication(el.id)} className="font-medium ml-2 text-red-600 dark:text-red-500 hover:underline"> <Trash2 /></button>
                  </td>
                </tr>
              ))
            )
            }
          </tbody>
        </table>
      </div>

    </>
  )
}

export default ListMedication
import { useEffect, useState } from 'react'
import {Routes, Route, Link} from 'react-router-dom';
import axios from 'axios';
import './app.css';


function App() {
  const [name, setName] = useState("");

  const [ID, setID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [allData, setAllData] = useState([]);
  const [error, setError] = useState("");

  const [fetchID, setFetchID] = useState(""); // State for fetch ID
  const [specificData, setSpecificData] = useState(null);

  const [updateID, setUpdateID] = useState("");
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateLastName, setUpdateLastName] = useState("");

  const [deleteID, setDeleteID] = useState(""); // State for delete ID


  async function func(event) {
    event.preventDefault();
    if (ID.length !== 8 || isNaN(ID)) {
      setError("ID must be 8 digits long");
      return;
    }
    setError("");
    try {
      const data={ 
        "ID" : ID,
        "rfname": firstName,
        "rlname": lastName,
      }
      await axios.post("http://localhost:3000/", data);
      setName(`${firstName} ${lastName}`); // Update the name state based on the response
      // console.log(response.data);
      // console.log("Name updated to", response.data.data.fname, response.data.data.lname);
    
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Error creating record: " + error.response.data.message);
    }
  }


  async function fetchAllData() {
    try{
      const response = await axios("http://localhost:3000/all");
      setAllData(response.data);
    } catch (error){
      console.log("Error fetching all data:", error.message);
    }
  }

  async function fetchSpecificData() {
    try {
      const response = await axios(`http://localhost:3000/data/${fetchID}`);
      setSpecificData(response.data);
    } catch (error) {
      console.log("Error fetching specific data:", error.message);
      setSpecificData(null);
    }
  }

  async function updateData() {
    try {
      const response = await axios.put(`http://localhost:3000/data/${updateID}`, {
        fname: updateFirstName,
        lname: updateLastName,
      });
      setSpecificData(response.data);
      setError(""); // Clear any previous error
    } catch (error) {
      console.log("Error updating data:", error.message);
      setError("Error updating record: " + error.response?.data?.message || error.message);
    }
  }

  async function deleteData() {
    try {
      await axios.delete(`http://localhost:3000/data/${deleteID}`);
      setError(""); // Clear any previous error
      // Optionally, refresh the list of all data
      fetchAllData();
    } catch (error) {
      console.log("Error deleting data:", error.message);
      setError("Error deleting record: " + (error.response?.data?.message || error.message));
    }
  }

  return (
    <>
    <div class="container">
      <h1>{name ? `Your name is ${name}.` : "Enter your name :"}</h1>
      <form onSubmit={func}>
        <div>
          <label>ID:</label>
          <input type="text" value={ID} onChange={(e) => setID(e.target.value)} maxLength={8}/>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <label>First name: </label>
          <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
        </div>

        <div>
          <label>Last name: </label>
          <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)}/>
        </div>

        <button type='submit'>Submit</button>
      </form>


      <div class="allData">
        <button onClick={fetchAllData}>Fetch All Data</button>
        {allData.length > 0 && (
          <>
            <h2>All Data</h2>
            <textarea value={allData.map(item => `${item.ID} ${item.fname} ${item.lname}`).join('\n')} readOnly rows={10} cols={50} />
          </>
        )}
      </div>
      


      <div class="specificData">
        <input
          type="text"
          value={fetchID}
          onChange={(e) => setFetchID(e.target.value)}
          placeholder="Enter ID to fetch"
        />
        <button onClick={fetchSpecificData}>Fetch Specific Data</button>
      </div>
      {specificData && (
        <div class="inner">
          <h2>Specific Data</h2>
          <p>ID: {specificData.ID}</p>
          <p>First name: {specificData.fname}</p>
          <p>Last name: {specificData.lname}</p>
        </div>
      )}


      <div class="update"><h2>Update Data</h2>
        <div>
          <label>Update ID:</label>
          <input type='text' value={updateID} onChange={(e) => setUpdateID(e.target.value)} placeholder="Enter ID to update"/>
        </div>

        <div>
          <label>Update First Name</label>
          <input type='text' value={updateFirstName} onChange={(e) => setUpdateFirstName(e.target.value)}/>
        </div>

        <div>
          <label>Update Last Name</label>
          <input type='text' value={updateLastName} onChange={(e) => setUpdateLastName(e.target.value)}/>
        </div>
        
        <button onClick={updateData}>Update Data</button>
      </div>



      <div class="delete">
        <h2>Delete Data</h2>
        <div>
          <label>Delete ID:</label>
          <input
            type='text'
            value={deleteID}
            onChange={(e) => setDeleteID(e.target.value)}
            placeholder="Enter ID to delete"
          />
        </div>
        <button onClick={deleteData}>Delete Data</button>
      </div>
      
    </div>
    </>
  );
}

export default App

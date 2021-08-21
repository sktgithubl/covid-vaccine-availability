import { useState, useEffect } from 'react'
import './App.css';

function App() {

  const [data, setData] = useState({
    loading: false,
    data: [],
  })

  const fetchData = async () => {
    setData({
      loading: true,
      data: [],
    })

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;

    const response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=445&date=09-06-2021`);
    const data = await response.json();
    console.log("Data Fetched!");

    let centersFiltered = data.centers.filter((center) => {
      let availableSession = center.sessions.filter((session) => {
        if (session.min_age_limit <= 18) return true;
        return false;
      })
      if (availableSession.length === 0) return false;
      return true;
    })
    data.centers = centersFiltered;
    setData({
      loading: false,
      data: data,
    })
  }

  useEffect(() => {
    const timer = setInterval(() => { fetchData() }, 5000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  if (data.loading === true) {
    return "Loading...";
  }

  if (data.data.length === 0) {
    return "No Data";
  }

  return (
    <div className="App">
      <h1>Welcome to skt's Vaccine Watcher</h1>
      <h2>Centers in Angul</h2>
      {data.data.centers.map((center, idx) => {
        return (
          <div className="" key={idx} style={{ marginBottom: "2rem" }}>
            <p>{center.name}</p>
            {center.sessions.map((session, idx) => {

              let isAvailable = (session.available_capacity > 0);
              if (session.min_age_limit <= 18) {
                return (
                  <div style={{ border: "1px solid black", marginTop: "0.5rem", padding: "1rem" }}
                    className={isAvailable ? "greenBg" : ""} key={idx}>
                    <p>{`Vaccine ${session.vaccine}`}</p>
                    <p>{`Available capacity ${session.available_capacity}`}</p>
                    <p>{`Available capacity dose 1 ${session.available_capacity_dose1}`}</p>
                    <p>{`Available capacity dose 2 ${session.available_capacity_dose2}`}</p>
                  </div>
                );
              }

              return "";
            })}
          </div>
        )
      })}
    </div>
  );
}

export default App;

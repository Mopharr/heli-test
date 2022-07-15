import React, { useState, useEffect } from "react";
import "./App.css";
import { BsSearch, BsHouseDoor } from "react-icons/bs";
import { FiNavigation } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";

const LAUNCHDATA = `
 {
  launchesPast(limit: 10) {
    mission_name
    launch_date_local
    rocket {
      rocket_name
    }
    ships {
      name
      home_port
      image
    }
  }
}
`;

function App() {
  // get data state
  const [launches, setLaunches] = useState([]);
  // search state
  const [search, setSearch] = useState([""]);
  // Filter data state
  const [sendRequest, setSendRequest] = useState(false);

  // active color
  const [tog, setTog] = useState(false);

  // Search Filter
  const filterLaunches = launches.filter((lname) =>
    lname.mission_name.toLowerCase().includes(search.toString().toLowerCase())
  );

  // Filter by name
  const filterName = (e) => {
    const newLaunch = launches
      .sort((a, b) => {
        if (a.mission_name > b.mission_name) {
          return 1;
        } else {
          return -1;
        }
      })
      .map((i) => {
        return i;
      });

    setLaunches(newLaunch);
    setTog(e.target.id);
  };

  // Filter by date
  const filterDate = (e) => {
    const newLaunch = launches
      .sort((a, b) => {
        if (a.launch_date_local < b.launch_date_local) {
          return -1;
        }
        if (a.launch_date_local > b.launch_date_local) {
          return 1;
        }
        return 0;
      })
      .map((i) => {
        return i;
      });

    setLaunches(newLaunch);
    setTog(e.target.id);
  };

  // Filter All
  const setDefault = (e) => {
    setSendRequest(true);
    setTog(e.target.id);
  };

  // Useeffect for filtering data
  useEffect(() => {
    if (sendRequest) {
      fetch("https://api.spacex.land/graphql/", {
        method: "POST",
        headers: { "Content-Type": "Application/Json" },
        body: JSON.stringify({ query: LAUNCHDATA }),
      })
        .then((res) => res.json())
        .then((data) => setLaunches(data.data.launchesPast));
      setSendRequest(false);
    }
  }, [sendRequest]);

  // useEffect for getting data
  useEffect(() => {
    fetch("https://api.spacex.land/graphql/", {
      method: "POST",
      headers: { "Content-Type": "Application/Json" },
      body: JSON.stringify({ query: LAUNCHDATA }),
    })
      .then((res) => res.json())
      .then((data) => setLaunches(data.data.launchesPast));
  }, []);

  return (
    <div className="container">
      <div className="mobile">
        <nav className="top">
          <label>Browse</label>

          <div className="navBar">
            <GiHamburgerMenu className="ham" />
            <img src="/termac.jpeg" alt="" />
          </div>
        </nav>

        <div className="input">
          <BsSearch className="icon" />
          <input
            placeholder="Search by Name"
            type="text"
            name="searchWord"
            value={search}
            onChange={(ev) => {
              setSearch(ev.target.value);
            }}
            autoComplete="off"
          />
        </div>
        <div className="filter">
          <p>Filter By: </p>
          <ul>
            <li
              // className="active"
              onClick={setDefault}
              id="1"
              className={`${tog === "1" ? "active" : "link"}`}
            >
              All
            </li>
            <li
              onClick={filterName}
              id="2"
              className={`${tog === "2" ? "active" : "link"}`}
            >
              Name
            </li>
            <li
              onClick={filterDate}
              id="3"
              className={`${tog === "3" ? "active" : "link"}`}
            >
              Date
            </li>
          </ul>
        </div>
        <main className="data">
          <div className="dataCon">
            <span>December 20</span>
            {filterLaunches.map((launch) => (
              <div key={launch.id} className="cont">
                <img src={launch.ships.map((i) => i.image)} alt="" />
                <div className="note">
                  <h2>{launch.mission_name}</h2>
                  <span>Port: {launch.ships.map((i) => i.name)}</span>;
                  <p>{launch.launch_date_local}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
        <footer>
          <BsHouseDoor className="icon" />
          <FiNavigation className="icon active" />
          <BsHouseDoor className="icon" />
          <AiOutlineUser className="icon" />
        </footer>
      </div>
    </div>
  );
}

export default App;

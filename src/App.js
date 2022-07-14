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
  const [launches, setLaunches] = useState([]);
  const [search, setSearch] = useState([""]);

  const filterName = () => {
    const Name = launches.map((i) => i.mission_name.toLowerCase()).sort();
    setLaunches(Name);
  };
  // const filterSearch = () => {
  //   const filterVal = launches.filter((lname) => {
  //     if (search === "") {
  //       return lname;
  //     } else if (
  //       lname.mission_name
  //         .toLowerCase()
  //         .includes(search.toString().toLowerCase())
  //     ) {
  //       return lname;
  //     }
  //   });
  //   setLaunches(filterVal);
  // };

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
            <li className="active">All</li>
            <li onClick={filterName}>Name</li>
            <li>Date</li>
          </ul>
        </div>
        <main className="data">
          <div className="dataCon">
            <span>December 20</span>
            {launches
              .filter((lname) => {
                if (search === "") {
                  return lname;
                } else if (
                  lname.mission_name
                    .toLowerCase()
                    .includes(search.toString().toLowerCase())
                ) {
                  return lname;
                }
              })
              .map((launch) => (
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

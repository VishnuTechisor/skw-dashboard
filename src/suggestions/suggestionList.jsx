import React, { useEffect, useRef, useState } from 'react'
import Home from '../Home/Home'
import { Link } from 'react-router-dom'
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import "../dataTable.css";
import $ from "jquery";
import { useNavigate } from "react-router-dom";

const api_url = process.env.REACT_APP_API_URL;

const SuggestionList = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [view, setView] = useState(false);
  const [suggestionsData,setSuggestionsData] = useState([]);
  const [profileData, setProfileData] = useState([]);

  // ___________________________________________________user Authenticatin____________________
  useEffect(() => {
    fetch(`${api_url}/getuser`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const userObject = data.find((user) => user._id === sessionStorage.userId);
        // setIsValidUser(userObject.active);
        if (!userObject.active) {
          navigate('/')
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  // _________________________________________________________________
  useEffect(() => {
    const fetchData = async () => {
      // _____________________clients Data _______________________
        const suggestionsDataFethcer = async () => {
            try {
                const response1 = await fetch(`${api_url}/showQuery`);
                if (!response1.ok) {
                    throw new Error(`HTTP eror! Status:${response1.status}`);
                }
                const resData = await response1.json()
                setSuggestionsData(resData);
            } catch (error) {
                console.error("Error fetching data sugestions", error);
            }
        }
        // _____________________ Profiles Data _______________________
        const profilesDataFetcher = async () => {
          try {
            const response3 = await fetch(`${api_url}/getprofiles`);
            if (!response3.ok) {
              throw new Error(`HTTP error! Status:${response3.status}`);
            }
            const resData3 = await response3.json();
            const UserProfileData = resData3.filter(
              (profile) => profile.profileName === sessionStorage.userProfile
            );
            setProfileData(UserProfileData);
            setView(UserProfileData[0].status.suggestion.view);
          } catch (error) {
            console.error("Error fetching profiles data:", error);
          }
        };
        suggestionsDataFethcer();
        profilesDataFetcher();
    };
    fetchData();
}, []);
  // ___________________________________________________________________________
  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        if (tableRef.current) {
          tableRef.current.clear().draw();
        }
        let serialNumber = 1;

        suggestionsData.forEach((queries) => {
          const rowData = {
            serialNumber: serialNumber++,
            _id: queries._id,
            customerName: queries.customerName,
            queryDescription: queries.queryDescription,
            createdAt: new Date(queries.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: new Date(queries.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          };

          tableRef.current.row.add(rowData).draw();
        });
      } catch (error) {
        console.error("Error fetching reviews data");
      }
    };
    if (tableRef.current) {
      tableRef.current.destroy();
    }

    tableRef.current = $("#userTable").DataTable({
      paging: true,
      pageLength: 10,
      searching: true,
      columns: [
        { data: "serialNumber" },
        { data: "customerName" },
        { data: "queryDescription" },
        { data: "createdAt" },
        { data: "updatedAt" }
      ],
    });

    fetchUsersList();
  }, [profileData,suggestionsData]);
  return (
    <div>
      <Home />
      {view && (
        <div className="table-button-container">
          <div className="user-table-container">
            <table id="userTable" className="display" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th> S.No </th>
                  <th> Customer Name </th>
                  <th> Query Description </th>
                  <th>CreatedAt</th>
                  <th>UpdatedAt</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </div>
        </div>
      )}
      {!view && (
        <div className="user-table-container">
          <img src="/undraw_Page_not_found_.png" style={{ width: "60%", height: "50%", paddingLeft: "100px" }}></img>
        </div>
      )}
    </div>
  )
}

export default SuggestionList
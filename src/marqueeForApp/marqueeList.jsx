import React, { useEffect, useRef, useState } from 'react'
import Home from '../Home/Home'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import "../dataTable.css";
import { useGlobalContext } from '../LoginPage/GlobalContext';

const api_url = process.env.REACT_APP_API_URL;

const MarqueeList = () => {
  // const navigate = useNavigate();

  // const { couponId, setCouponId } = useGlobalContext();

  // const onEditClick = (_id) => {
  //     console.log("Edit click");
  //     setCouponId(_id);
  //     console.log("Edit click",couponId);
  //     navigate("/editCoupon");
  //   };

  const [view, setView] = useState(false);
  const [create, setCreate] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [marqueeData, setMarqueeData] = useState([]);
  const tableRef = useRef(null);
  // _________________________________________________________________
  useEffect(() => {
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
        setView(UserProfileData[0].status.review.view);
        setCreate(UserProfileData[0].status.review.create);
      } catch (error) {
        console.error("Error fetching profiles data:", error);
      }
    };

    profilesDataFetcher();
  }, []);
  // _________________________________________________________________

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        fetch(`${api_url}/showMarqueeForDashboard`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setMarqueeData(data);
            console.log("Data received from the server:", data);
          })
          .catch((error) => console.error("Error fetching data:", error));

        if (tableRef.current) {
          tableRef.current.clear().draw();
        }
        let serialNumber = 1;

        // Add rows to the DataTable
        marqueeData.forEach((marquee) => {
          const rowData = {
            serialNumber: serialNumber++, // Increment the serial number
            _id: marquee._id,
            marqueeDescription: marquee.marqueeDescription,
            createdBy: marquee.createdBy,
            // updatedBy: marquee.updatedBy,
            createdAt: new Date(marquee.createdAt).toLocaleString(),
            // updatedAt: new Date(marquee.updatedAt).toLocaleString()   
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
        { data: "marqueeDescription" },
        { data: "createdBy" },
        //   { data: "updatedBy" },
        { data: "createdAt" },
        //   { data: "updatedAt" },    
      ]
    });
    fetchUsersList();
  }, [profileData]);
  return (
    <div>
      <Home />
      {view && (
        <div className="table-button-container">
          {create && (
            <div className="niveshartha-btn-container">
              <Link to="/addMarquee">
                <button className="niveshartha_btn_add">Add Marquee</button>
              </Link>
            </div>
          )}
          <div className="user-table-container">
            <table id="userTable" className="display" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Marquee Description</th>
                  <th>CreatedBy</th>
                  {/* <th>UpdatedBy</th> */}
                  <th>CreatedAt</th>
                  {/* <th>UpdatedAt</th> */}
                  {/* <th>Edit</th> */}
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

export default MarqueeList
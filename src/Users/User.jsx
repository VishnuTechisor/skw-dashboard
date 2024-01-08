import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import "../dataTable.css";
import Home from "../Home/Home";
import { useGlobalContext } from "../LoginPage/GlobalContext";
import { ClientContext } from "../ClientList/clientContext.jsx/ClientContext"

const api_url = process.env.REACT_APP_API_URL;

function User() {
  const userTableRef = useRef(null);
  const navigate = useNavigate();
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);
  const [userData, setUserData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const { userId, setUserId } = useGlobalContext();
  // const { profilesData } = useContext(ClientContext);
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
    profilesDataFetcher();
  }, []);
  // ____________________________________________________________________________________________
  // useEffect(() => {
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
      setView(UserProfileData[0].status.user.view);
      setUpdate(UserProfileData[0].status.user.edit);
      setCreate(UserProfileData[0].status.user.create);
    } catch (error) {
      console.error("Error fetching profiles data:", error);
    }
  };

  // profilesDataFetcher();
  // }, []);
  // _________________________________________________________________________
  const onEditClick = (_id) => {
    setUserId(_id);
    navigate("/edituser");
  };
  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        fetch(`${api_url}/getuser`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setUserData(data);
            console.log("Data received from the server:", data);
          })
          .catch((error) => console.error("Error fetching data:", error));
        if (userTableRef.current) {
          userTableRef.current.clear().draw();
        }
        let serialNumber = 1;
        userData.forEach((product) => {
          const rowData = {
            serialNumber: serialNumber++,
            _id: product._id,
            name: product.name,
            email: product.email,
            mobileNumber: product.mobileNumber, // Corrected the key to 'phone'
            userName: product.userName,
            password: product.password,
            profile: product.profile,
            active: product.active ? "On" : "Off",
            createdAt: new Date(product.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            // updatedAt: product.updatedAt,
          };
          userTableRef.current.row.add(rowData).draw();
        });
      } catch (error) {
        console.error("Error fetching user data");
      }
    };

    if (userTableRef.current) {
      userTableRef.current.destroy();
    }

    const columns = [
      { data: "serialNumber" },
      { data: "name" },
      { data: "email" },
      { data: "mobileNumber" },
      { data: "userName" },
      { data: "password" },
      { data: "profile" },
      { data: "active" },
      { data: "createdAt" },
      // { data: 'updatedAt' },
      {
        data: null,
        render: (data, type, row) =>
          '<button class="btn btn-success">Edit</button>',
      },
    ];

    userTableRef.current = $("#userTable").DataTable({
      paging: true,
      pageLength: 10,
      searching: true,
      fixedHeader: true,
      columns: columns,
      rowCallback: function (row, data) {
        const editButton = $('<button class="btn btn-success">Edit</button>');
        editButton.on("click", () => update ? onEditClick(data._id) : alert("You dont have access to this, Contact Admin!!"));
        $("td:last-child", row).html(editButton);
      },
    });
    fetchUsersList();
  }, [update, profileData]);

  return (
    <div>
      <Home />
      {view && (
        <div className="table-button-container">
          {create && (
            <div className="niveshartha-btn-container">
              <Link to="/adduser">
                <button className="niveshartha_btn_add">Add User</button>
              </Link>
            </div>
          )}
          <div className="user-table-container">
            <table id="userTable" className="display" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Profile</th>
                  <th>Status</th>
                  <th>Created At</th>
                  {/* <th>Updated At</th> */}
                  <th>Edit</th>
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
  );
}

export default User;

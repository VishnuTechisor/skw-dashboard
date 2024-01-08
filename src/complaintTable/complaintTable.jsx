
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Home from '../Home/Home'
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import "../dataTable.css";
import { useGlobalContext } from '../LoginPage/GlobalContext';

const api_url = process.env.REACT_APP_API_URL;

const ComplaintTable = () => {
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [comTableData, setComTableData] = useState([]);
  const navigate = useNavigate();
  const { complaintRowId, setComplaintRowId } = useGlobalContext();

  const onEditClick = (_id) => {
    console.log("Edit click");
    setComplaintRowId(_id);
    console.log("Edit click", complaintRowId);
    navigate("/editComplaintRow");
  };

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
      setView(UserProfileData[0].status.complaintTable.view);
      setUpdate(UserProfileData[0].status.complaintTable.edit);
      setCreate(UserProfileData[0].status.complaintTable.create);
    } catch (error) {
      console.error("Error fetching profiles data:", error);
    }
  };

  // profilesDataFetcher();
  // }, []);
  // _________________________________________________________________

  const tableRef = useRef(null);

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        fetch(`${api_url}/showComplaintRow`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setComTableData(data);
            console.log("Data received from the server:", data);
          })
          .catch((error) => console.error("Error fetching data:", error));

        if (tableRef.current) {
          tableRef.current.clear().draw();
        }

        let serialNumber = 1;

        // Add rows to the DataTable
        comTableData.newComplaintRow.forEach((complaintTable) => {
          const rowData = {
            serialNumber: serialNumber++, // Increment the serial number
            _id: complaintTable._id,
            ReceivedFrom: complaintTable.ReceivedFrom,
            CarriedFromPrevMonth: complaintTable.CarriedFromPrevMonth,
            Received: complaintTable.Received,
            Resolved: complaintTable.Resolved,
            Pending: complaintTable.Pending,
            createdBy: complaintTable.createdBy,
            updatedBy: complaintTable.updatedBy,
            createdAt: new Date(complaintTable.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            updatedAt: new Date(complaintTable.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
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
        { data: "ReceivedFrom" },
        { data: "CarriedFromPrevMonth" },
        { data: "Received" },
        { data: "Resolved" },
        { data: "Pending" },
        { data: "createdBy" },

        { data: "updatedBy" },
        { data: "createdAt" },
        { data: "updatedAt" },
        {
          data: null,
          render: (data, type, row) =>
            '<button class="btn btn-success">Edit</button>',
        },
      ],
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
              <Link to="/addcomplaintRow">
                <button className="niveshartha_btn_add">Add Row</button>
              </Link>
            </div>
          )}
          <div className="user-table-container">
            <table id="userTable" className="display" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Received From</th>
                  <th>Carried Forward From Prev Month</th>
                  <th>Received</th>
                  <th>Resolved</th>
                  <th>Pending</th>
                  <th>Created By</th>
                  <th>Updated By</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </div>
        </div>
      )}
      {!view && (
        <div className="user-table-container">
          <img src="/undraw_Page_not_found_.png" style={{ width: "60%", height: "50%",paddingLeft:"100px" }}></img>
        </div>
        )}
    </div >
  )
}

export default ComplaintTable
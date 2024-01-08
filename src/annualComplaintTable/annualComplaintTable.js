import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Home from "../Home/Home";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../LoginPage/GlobalContext";

const api_url = process.env.REACT_APP_API_URL;


const AnnualComplaintTable = () => {

  const navigate = useNavigate()

  const { annualComplaintRowId, setAnnualComplaintRowId } = useGlobalContext();

  const [annualCompaintData, setAnnualComplaintData] = useState([]);

  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);

  const [profileData, setProfileData] = useState([]);

  const onEditClick = (_id) => {
    console.log("Edit click");
    setAnnualComplaintRowId(_id);
    // console.log("Edit click",annualComplaintRowId);
    navigate("/editAnnualComplaintRow");
  };

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
      setView(UserProfileData[0].status.annualComplaintTable.view);
      setUpdate(UserProfileData[0].status.annualComplaintTable.edit);
      setCreate(UserProfileData[0].status.annualComplaintTable.create);
    } catch (error) {
      console.error("Error fetching profiles data:", error);
    }
  };


  const getDateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  
  useEffect(() => {
    fetch(`${api_url}/showAnnualComplaintRow`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      setAnnualComplaintData(data.newAnnualComplaintRow);
      console.log("Data received from the server:", data);
    })
    .catch((error) => console.error("Error fetching data:", error));
  }, [update, profileData]);

  

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "ReceivedFrom", //access nested data with dot notation
        header: "Received From",
        size: 10,

      },
      {
        accessorKey: "CarriedFromPrevMonth", //normal accessorKey
        header: "Carried Forward From Prev Year",
        size: 200,
      },
      {
        accessorKey: "Received",
        header: "Received",
        size: 10,
      },
      {
        accessorKey: "Resolved",
        header: "Resolved",
        size: 10,
      },
      {
        accessorKey: "Pending",
        header: "Pending",
        size: 10,
      },
      {
        accessorKey: "createdBy",
        header: "Created By",
        size: 10,
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        size: 10,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 20,
        accessorFn: (row) => getDateFormat(row.createdAt),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 20,
        accessorFn: (row) => getDateFormat(row.createdAt),
      },
      {
        accessorKey: "Action",
        header: "Action",
        size: 10,
        // You can create a custom function to render an edit button
        accessorFn: (rowData) => (
          <button
            className="edit-button"
            onClick={() => update ? onEditClick(rowData._id) : alert("You dont have acces to this, Contact Admin!!")}
          >
            Edit
          </button>
        ),
      },
    ],
    [annualCompaintData]
  );

  const table = useMaterialReactTable({
    columns,
    data: annualCompaintData, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    // initialState: { e: false },
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    paginationDisplayMode: "pages",
    muiTablePaperProps: {
      elevation: 0,
    },
    globalFilterFn: "contains",
    muiTableHeadCellProps: {
      align: 'center',
    },
    muiTableBodyCellProps: {
      align: 'center',
    },
  });


  return (
    <div>
      <Home />
      {view && (
        <div>
          <div className="table-button-container">
            {create && (
              <div className="niveshartha-btn-container">
                <Link to="/addAnnualComplaintRow">
                  <button className="niveshartha_btn_add">Add Row</button>
                </Link>
              </div>
            )}
            <div className="user-table-container">
              <MaterialReactTable table={table} />
            </div>
          </div>
        </div>
      )}
      {!view && (
        <div className="user-table-container">
          <img
            src="/undraw_Page_not_found_.png"
            style={{ width: "60%", height: "50%", paddingLeft: "100px" }}
          ></img>
        </div>
      )}
    </div>
  );
};

export default AnnualComplaintTable;

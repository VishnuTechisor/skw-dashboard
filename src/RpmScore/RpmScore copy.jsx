import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Home from "../Home/Home";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../LoginPage/GlobalContext";

const api_url = process.env.REACT_APP_API_URL;


const RpmScoreData = () => {

  const navigate = useNavigate()

  const { rpmScoreId,setRpmScoreId } = useGlobalContext();

  const [rpmScore, setRpmScore] = useState([]);

  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);
const [downloadScore,setDownloadScore]=useState(false)
  const [profileData, setProfileData] = useState([]);

  const onEditClick = (_id) => {
    console.log("Edit click");
    setRpmScoreId(_id);
     console.log("Edit click",rpmScoreId);
    
  };

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
      // setUpdate(UserProfileData[0].status.annualComplaintTable.edit);
      // setCreate(UserProfileData[0].status.annualComplaintTable.create);
    } catch (error) {
      console.error("Error fetching profiles data:", error);
    }
  };
console.log(profileData,'kjavjirjvjjviuor')

  const getDateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/showRpmScore");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRpmScore(data);
        console.log("Data received from the server:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [update, profileData]);
 
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Name",
        size: 10,

      },
    
      {
        accessorKey: "email", //normal accessorKey
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "rpmScore", //normal accessorKey
        header: "RPM Score",
        size: 200,
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
            onClick={() => onEditClick(rowData._id)}
          >
            Download
          </button>
        ),
      },
 
    ],
    [profileData]
  );

  const table = useMaterialReactTable({
    columns,
    data: rpmScore, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
  profilesDataFetcher();

  return (
    <div>
      <Home />
      {view && (
        <div>
          <div className="table-button-container">
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

export default RpmScoreData;

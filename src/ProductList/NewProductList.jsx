import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import "../dataTable.css";
import Home from "../Home/Home";
import { useGlobalContext } from "../LoginPage/GlobalContext";
import { ClientContext } from "../ClientList/clientContext.jsx/ClientContext";

const api_url = process.env.REACT_APP_API_URL;

function NewProductList() {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState([]);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);
  const [productData, setProductData] = useState([]);
  const { productListId, setProductListId } = useGlobalContext();
  const { profilesData } = useContext(ClientContext);

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
  // ____________________________________________________________________________________________
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
        // setProfileData(UserProfileData);
        setView(UserProfileData[0].status.product.view);
        setUpdate(UserProfileData[0].status.product.edit);
        setCreate(UserProfileData[0].status.product.create);
      } catch (error) {
        console.error("Error fetching profiles data:", error);
      }
    };
    profilesDataFetcher();
  }, [profilesData]);
  // ___________________________________________________________________________________
  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const response = await fetch(`${api_url}/newProductList`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProductData(data);
        console.log("Data received from the server:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsersList();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.destroy();
    }

    // if (productData.length > 0) {
      tableRef.current = $("#userTable").DataTable({
        paging: true,
        pageLength: 10,
        searching: true,
        fixedHeader: true,
        columns: [
          { data: "serialNumber" },
          { data: "productName" },
          { data: "productType" },
          { data: "createdAt" },
          {
            data: null,
            render: function (data, type, row) {
              return '<button class="btn btn-success">Edit</button>';
            },
          },
        ],
        rowCallback: function (row, data) {
          const editButton = $('<button class="btn btn-success">Edit</button>');
          editButton.on("click", () => update ? onEditClick(data._id) : alert("You dont have access please consult Admin!!"));
          $("td:last-child", row).html(editButton);
        },
      });

      if (tableRef.current) {
        tableRef.current.clear().draw();
      }

      let serialNumber = 1;
      productData.forEach((product) => {
        const rowData = {
          serialNumber: serialNumber++,
          _id: product._id,
          productName: product.productName,
          productType: product.productType,
          createdAt: new Date(product.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        };
        tableRef.current.row.add(rowData).draw();
      });
    // }
  }, [productData, update, profilesData]);

  const onEditClick = (_id) => {
    setProductListId(_id);
    console.log("Edit click");
    navigate("/editnewproductlist");
  };

  return (
    <div>
      <Home />
      <div className="table-button-container">
        {view && (
          <div>
            {create && (
              <div className="niveshartha-btn-container">
                <Link to="/newProduct">
                  <button className="niveshartha_btn_add">Add ProductList</button>
                </Link>
              </div>
            )}
            <div className="user-table-container">
              <table id="userTable" className="display" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Product Name</th>
                    <th>productType</th>
                    <th>CreatedAt</th>
                    <th>Action 1</th>
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
      </div>
    </div>
  );
}

export default NewProductList;

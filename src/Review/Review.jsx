import React, { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.css";
import "../dataTable.css";
import Home from "../Home/Home";
import ReviewPopup from "./ReviewPopup";
import { ClientContext } from "../ClientList/clientContext.jsx/ClientContext"
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
const api_url = process.env.REACT_APP_API_URL;

function Review() {
  const { reviewsData } = useContext(ClientContext);
  const tableRef = useRef(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [view, setView] = useState(false);
  const [update, setUpdate] = useState(false);
  const [create, setCreate] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState();
  const [currentReviewId, setCurrentReviewId] = useState();
  const [profileData, setProfileData] = useState([]);
  const [rData, setRdata] = useState([]);

  const togglePopup = () => setPopupOpen(!isPopupOpen);
  const handleEditClick = (rowData) => {
    console.log(rowData);
    setSelectedApproval(rowData.approvalValue);
    setCurrentReviewId(rowData._id);
    togglePopup();
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
      setView(UserProfileData[0].status.review.view);
      setUpdate(UserProfileData[0].status.review.edit);
      setCreate(UserProfileData[0].status.review.create);
    } catch (error) {
      console.error("Error fetching profiles data:", error);
    }
  };

  // profilesDataFetcher();
  // }, []);
  // _________________________________________________________________
  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        fetch(`${api_url}/showreviews`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setRdata(data);
            console.log("Data received from the server:", data);
          })
          .catch((error) => console.error("Error fetching data:", error));

        if (tableRef.current) {
          tableRef.current.clear().draw();
        }
        let serialNumber = 1;

        rData.forEach((review) => {
          const rowData = {
            serialNumber: serialNumber++,
            _id: review._id,
            Name: review.customerName,
            Review: review.reviewDescription,
            approvalValue: review.approvalValue,
            createdAt: new Date(review.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
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
        { data: "Name" },
        { data: "Review" },
        { data: "approvalValue" },
        { data: "createdAt" },
        {
          data: null,
          render: function (data, type, row) {
            return '<button class="btn btn-success">Action</button>';
          },
        },
      ],
      rowCallback: function (row, data) {
        const editButton = $(
          '<button class="btn btn-success">Action</button>'
        );
        editButton.on("click", () => update ? handleEditClick(data, row.productName) : alert("You dont have access to this, Contact Admin!!"));
        $("td:last-child", row).html(editButton);
      },
    });

    fetchUsersList();
  }, [update, profileData]);

  const [status, setStatus] = useState('');
  const navigate = useNavigate()

  const HandleStatus = (e) => {
    const value = e.target.value
    setStatus(value)
    console.log(value)
  }
  useEffect(() => {
    console.log(status)
  }, [status])

  const handlePopupConfirm = async () => {
    try {
      //  data submission logic here
      const data = new FormData(document.querySelector('#actionForm'));
      let url = `${api_url}/updateReview/${currentReviewId}`;

      const payload = {
        approvalValue: data.get('approvalValue'),
      };
      console.log(payload)

      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Product added successfully!!');
      if (responseData) {
        console.log('responseData', responseData);
        // navigate("/reviews")
        tableRef.current.clear().draw();
        fetch(`${api_url}/showreviews`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Data received from the server:", data);

            let serialNumber = 1;

            data.forEach((review) => {
              const rowData = {
                serialNumber: serialNumber++,
                _id: review._id,
                Name: review.customerName,
                Review: review.reviewDescription,
                approvalValue: review.approvalValue,
                createdAt: new Date(review.createdAt).toLocaleString(),
              };
              tableRef.current.row.add(rowData).draw();
            });
          })
          .catch((error) => console.error("Error fetching data:", error));

        // Close the popup
        togglePopup();
      }
      // navigate('/reviews')
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <div>
      <Home />
      {view && (
        <div>
          <div className="table-button-container">
            {create && (
              <div className="niveshartha-btn-container">
                <Link to="/addreview">
                  <button className="niveshartha_btn_add">Add Review</button>
                </Link>
              </div>
            )}
            <div className="user-table-container">
              <table id="userTable" className="display" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Review</th>
                    {/* <th>Rating</th> */}
                    <th>Approval</th>
                    <th>CreatedAt</th>
                    <th>Action</th>
                    {/* <th>Action 2</th> */}
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
            {/* <ReviewPopup
          isOpen={isPopupOpen}
          toggle={togglePopup}
          onClose={togglePopup}
          newapprovalValue={selectedApproval}
          reviewIdValue={currentReviewId}
        /> */}
          </div>
          <Modal isOpen={isPopupOpen} toggle={togglePopup}>
            <ModalHeader>Review Action</ModalHeader>
            <ModalBody>
              <Form id='actionForm'>
                <Row>
                  <Col md={8}>
                    <FormGroup>
                      <Label for="exampleCity">
                        Action
                      </Label>
                      <Input
                        id="exampleSelect"
                        name="approvalValue"
                        type="select"
                        onChange={HandleStatus}
                      >
                        <option selected disabled value="">
                          --Select--
                        </option>
                        <option>
                          Approved
                        </option>
                        <option>
                          Not Approved
                        </option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
            <ModalFooter>
              <button className='btn btn-success' onClick={handlePopupConfirm} >
                Submit
              </button>
              <button className='btn btn-danger' onClick={togglePopup} >
                Close
              </button>
            </ModalFooter>
          </Modal>
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
export default Review;
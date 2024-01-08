import React, { useEffect, useState } from "react";
import Home from "../Home/Home";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { useNavigate } from "react-router-dom";
const api_url = process.env.REACT_APP_API_URL;

function SendNotifications() {
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");
  const navigate = useNavigate();
  const [view, setView] = useState(false);
  const [create, setCreate] = useState(false);
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
      setView(UserProfileData[0].status.notification.view);
      setCreate(UserProfileData[0].status.notification.create);
    } catch (error) {
      console.error("Error fetching profiles data:", error);
    }
  };

  // profilesDataFetcher();
  // }, []);
  // _________________________________________________________________
  const handleSendNotifications = async () => {
    try {
      const response = await fetch(`${api_url}/sendnotifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: notificationTitle,
          body: notificationContent,
        }),
      });

      const data = await response.json();
      console.log(data);
      navigate("/sendnotifications");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Home />
      {view && (
        <div className="form-container">
          <div className="form-align">
            {create && (
              <Form encType="multipart/form-data">
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="exampleSelect">Notifications Title</Label>
                      <Input
                        id="exampleSelect"
                        placeholder="Enter notification title.."
                        name="customerName"
                        type="text"
                        required="true"
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                      ></Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="exampleCity">Content</Label>
                      <textarea
                        className="form-control"
                        placeholder="Enter notification content.."
                        id="floatingTextarea2"
                        name="reviewDescription"
                        rows={4}
                        value={notificationContent}
                        onChange={(e) => setNotificationContent(e.target.value)}
                      ></textarea>
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={12} className="d-flex justify-content-center">
                    {create && (
                      <button
                        onClick={handleSendNotifications}
                        className="btn btn-success"
                        type="submit"
                        style={{
                          backgroundColor: "#259D90",
                          border: "1px solid lightgray",
                        }}
                      >
                        Send Notification
                      </button>
                    )}
                    <br />
                    <p>{ }</p>
                  </Col>
                </Row>
              </Form>
            )}
            {!create && (
              <img src="/undraw_Page_not_found_.png" style={{ width: "80%", height: "80%" }}></img>
            )}
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

export default SendNotifications;

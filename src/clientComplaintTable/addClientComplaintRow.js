import React, { useEffect, useState } from 'react'
import Home from '../Home/Home'
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { useNavigate } from 'react-router-dom'

const api_url = process.env.REACT_APP_API_URL;

const AddClientComplaintRow = () => {
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    const [adminName, setAdminName] = useState(() =>
        sessionStorage.getItem("displayName"));

    // useEffect(()=>{
    //     setAdminName(() => sessionStorage.getItem("displayName"));
    // },[])

    const handlegoback = () => {
        navigate("/ClientComplaintRow");
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url = `${api_url}/addClientComplaintRow`;
            const data = new FormData(e.currentTarget);
            const payload = {
                ReceivedFrom: data.get("receivedFrom"),
                PendingAtTheEndOfMonth: data.get("PendingATEOM"),
                Received: data.get("received"),
                createdBy: adminName,
                updatedBy: data.get(""),
            };

            console.log("payload", payload);

            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData) {
                setMessage("Data submitted sucessfully");
                navigate("/ClientComplaintRow");
                console.log("responseData", responseData);
            }
            console.log("Complaint added successfully!!");
        } catch (error) {
            setMessage("Failed to submit data");
            console.error("Error", error);
        }
    };

    return (
        <div>
            <Home />
            <div className="form-container">
                <div className="form-align">
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="examplePassword">Received From</Label>
                                    <Input
                                        placeholder=" Enter here"
                                        type="text"
                                        name="receivedFrom"
                                        required='true'
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="examplePassword">Pending At The End Of Month</Label>
                                    <Input
                                        placeholder=" Enter here"
                                        type="text"
                                        name="PendingATEOM"
                                        required='true'
                                        max={100}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="examplePassword"> Received </Label>
                                    <Input
                                        placeholder=" Enter here"
                                        type="text"
                                        name="received"
                                        required='true'
                                    />
                                </FormGroup>
                            </Col>

                        </Row>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <Label for="examplePassword"> Created By </Label>
                                    <Input
                                        placeholder=" Enter here"
                                        type="text"
                                        name="createdBy"
                                        required='true'
                                        value={adminName}
                                        disabled
                                    />
                                </FormGroup>
                            </Col>

                        </Row>
                        <br />
                        <Row>
                            <Col md={4}></Col>
                            <Col md={2}>
                                <button
                                    className="btn btn-primary"
                                    type="btn"
                                    style={{ backgroundColor: '#259D90', border: '1px solid lightgray' }}
                                    onClick={handlegoback}
                                >
                                    Go Back
                                </button>
                            </Col>
                            <Col md={2} className="d-flex justify-content-center">
                                <button
                                    className="btn btn-success"
                                    type="submit"
                                    style={{
                                        backgroundColor: "#259D90",
                                        border: "1px solid lightgray",
                                    }}
                                >
                                    Submit
                                </button>
                                <br />
                            </Col>
                            <Col md={4}></Col>
                        </Row>
                        <Col md={4}>

                            <p>{message}</p>
                        </Col>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default AddClientComplaintRow
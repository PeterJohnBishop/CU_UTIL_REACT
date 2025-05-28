import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import axios from "axios";

const Authentication = ({ successState, errorState }) => (

  <Container fluid >
    {successState ? (
      <h1>Success</h1>
    ) : errorState ? (
      <h1>{errorState}</h1>
    ) : (
      <h1>Loading...</h1>
    )}
  </Container>

);

const AuthenticationContainer = () => {

  const baseURL = "http://localhost:4000/clickup";
  const [accessCode, setAccessCode] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const saveAccessCode = () => {

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      setAccessCode(code);
    }

  };

  const getAuthToken = async () => {
    
      const resp = await axios.post(`${baseURL}/getAuthToken`, {
        accessCode: accessCode,
      })
      .then(function (response) {
        response.
        console.log(response);
        const token = response.data.response.access_token;
        localStorage.setItem("token", `Bearer ${token}`); 
        setSuccess(true);
      })
      .catch(function (error) {
        console.log(error);
        setError(error.response?.data?.message || error.message || "An error occurred");
      });
   
  };

  useEffect(() => {

    if (!accessCode) {
      saveAccessCode();
    }

    if (accessCode) {
      getAuthToken();
    }

  }, [accessCode]); 

  return <Authentication successState={success} errorState={error} />;
};

export default AuthenticationContainer;

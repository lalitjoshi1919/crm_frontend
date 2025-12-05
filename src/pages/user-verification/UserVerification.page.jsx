import React, { useEffect, useState } from "react";
import { Spinner, Alert, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { userRegistrationVerification } from "../../api/userApi";

export const UserVerification = () => {
  const { _id, email } = useParams();
  const [state, setState] = useState({
    status: "init", // init, loading, success, error
    message: "",
    debugInfo: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        setState({
          status: "loading",
          message: "Verifying your account...",
          debugInfo: { _id, email, time: new Date().toISOString() }
        });

        if (!_id || !email) {
          throw new Error("Invalid verification link - missing parameters");
        }

        const res = await userRegistrationVerification(_id, email);

        setState({
          status: "success",
          message: res.message || "Account verified successfully!",
          debugInfo: res
        });

        setTimeout(() => navigate("/"), 3000);

      } catch (error) {
        setState({
          status: "error",
          message: error.message || "Verification failed.",
          debugInfo: {
            error: error.toString(),
            _id,
            email,
            time: new Date().toISOString()
          }
        });
      }
    };

    verify();
  }, [_id, email, navigate]);

  return (
    <div className="verification-container">
      {state.status === "loading" && (
        <div className="verification-loading">
          <Spinner animation="border" />
          <p>{state.message}</p>
        </div>
      )}

      {state.status === "success" && (
        <Alert variant="success">
          <h4>Verification Successful!</h4>
          <p>{state.message}</p>
          <p>Redirecting to login page...</p>
        </Alert>
      )}

      {state.status === "error" && (
        <Alert variant="danger">
          <h4>Verification Failed</h4>
          <p>{state.message}</p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          <div className="mt-3 debug-info">
            <small>Debug info: {JSON.stringify(state.debugInfo)}</small>
          </div>
        </Alert>
      )}
    </div>
  );
};

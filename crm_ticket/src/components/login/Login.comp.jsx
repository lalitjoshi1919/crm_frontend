import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { loginPending, loginSuccess, loginFail } from "./loginSlice";
import { userLogin } from "../../api/userApi";
import { getUserProfile } from "../../pages/dashboard/userAction";

export const LoginForm = ({ formSwitcher }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();

  const { isLoading, isAuth, error } = useSelector(state => state.login);
  let { from } = location.state || { from: { pathname: "/" } };

  // Only run this effect once on mount to prevent infinite loop
  useEffect(() => {
    if (sessionStorage.getItem("accessJWT")) {
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnChange = e => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleOnSubmit = async e => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Fill up all the form!");
    }

    dispatch(loginPending());

    try {
      const isAuth = await userLogin({ email, password });

      if (isAuth.status === "error") {
        return dispatch(loginFail(isAuth.message));
      }

      dispatch(loginSuccess());
      dispatch(getUserProfile());
      navigate("/dashboard");
    } catch (error) {
      // Robust backend error handling
      const backendMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed!";
      dispatch(loginFail(backendMsg));
    }
  };

  return (
    <Container className="p-0">
      <div className="login-header">
        <div className="login-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form autoComplete="off" onSubmit={handleOnSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter your email"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            onChange={handleOnChange}
            value={password}
            placeholder="Enter your password"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading} className="w-100">
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </Form>

      <div className="form-footer">
        <div className="mb-3">
          <a href="/password-reset">Forgot your password?</a>
        </div>
        <div>
          Don't have an account? <a href="/registration">Create one now</a>
        </div>
      </div>
    </Container>
  );
};

LoginForm.propTypes = {
  formSwitcher: PropTypes.func.isRequired,
};

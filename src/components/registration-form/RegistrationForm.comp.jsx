import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { newUserRegistration } from "./userRegAction";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  name: "",
  phone: "",
  email: "",
  company: "",
  address: "",
  password: "",
  confirmPass: "",
};
const passVerificationError = {
  isLenthy: false,
  hasUpper: false,
  hasLower: false,
  hasNumber: false,
  hasSpclChr: false,
  confirmPass: false,
};

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const [newUser, setNewUser] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passVerificationError);

  const { isLoading, status, message } = useSelector(
    (state) => state.registration
  );

  useEffect(() => {}, [newUser]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setNewUser({ ...newUser, [name]: value });

    if (name === "password") {
      const isLenthy = value.length > 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpclChr = /[@,#,$,%,&]/.test(value);

      setPasswordError({
        ...passwordError,
        isLenthy,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpclChr,
      });
    }

    if (name === "confirmPass") {
      setPasswordError({
        ...passwordError,
        confirmPass: newUser.password === value,
      });
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    // console.log(newUser);
    const { name, phone, email, company, address, password } = newUser;

    const newRegistration = {
      name,
      phone,
      email,
      company,
      address,
      password,
    };
    dispatch(newUserRegistration(newRegistration));
  };

  return (
    <Container className="p-0">
      <div className="registration-header">
        <div className="registration-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1>Create Account</h1>
        <p>Join us and start managing your tickets</p>
      </div>

      {message && (
        <Alert variant={status === "success" ? "success" : "danger"}>
          {message}
        </Alert>
      )}

      <Form onSubmit={handleOnSubmit} autoComplete="off">
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleOnChange}
                placeholder="Enter your full name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={newUser.phone}
                onChange={handleOnChange}
                placeholder="Enter your phone number"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={newUser.company}
                onChange={handleOnChange}
                placeholder="Enter your company name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleOnChange}
                placeholder="Enter your full address"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleOnChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPass"
                value={newUser.confirmPass}
                onChange={handleOnChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                required
              />
            </Form.Group>

            {!passwordError.confirmPass && newUser.confirmPass && (
              <Alert variant="danger" className="mb-3">
                Passwords don't match!
              </Alert>
            )}

            <div className="password-requirements">
              <strong className="mb-2 d-block">Password Requirements:</strong>
              <ul>
                <li className={passwordError.isLenthy ? "text-success" : "text-danger"}>
                  Minimum 8 characters
                </li>
                <li className={passwordError.hasUpper ? "text-success" : "text-danger"}>
                  At least one uppercase letter
                </li>
                <li className={passwordError.hasLower ? "text-success" : "text-danger"}>
                  At least one lowercase letter
                </li>
                <li className={passwordError.hasNumber ? "text-success" : "text-danger"}>
                  At least one number
                </li>
                <li className={passwordError.hasSpclChr ? "text-success" : "text-danger"}>
                  At least one special character (@ # $ % &)
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={Object.values(passwordError).includes(false) || isLoading}
              className="w-100"
            >
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </Form>

          <div className="form-footer">
            <div>
              Already have an account? <a href="/">Sign in here</a>
            </div>
          </div>
    </Container>
  );
};

export default RegistrationForm;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "./passwordAction";

import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Spinner,
	Alert,
} from "react-bootstrap";

const initialState = {
	pin: "",
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

const UpdatePasswordForm = () => {
	const dispatch = useDispatch();

	const [newPassword, setNewPassword] = useState(initialState);
	const [passwordError, setPasswordError] = useState(passVerificationError);

	const { isLoading, status, message, email } = useSelector(
		state => state.password
	);

	const handleOnChange = e => {
		const { name, value } = e.target;

		setNewPassword({ ...newPassword, [name]: value });

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
				confirmPass: newPassword.password === value,
			});
		}
	};

	const handleOnSubmit = e => {
		e.preventDefault();
		// console.log(newUser);

		const { pin, password } = newPassword;

		const newPassObj = {
			pin,
			newPassword: password,
			email,
		};
		dispatch(updatePassword(newPassObj));
	};

	return (
		<Container className="p-0">
			<div className="login-header">
				<div className="login-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h1>Update Password</h1>
				<p>Enter your OTP and create a new password</p>
			</div>

			{message && (
				<Alert variant={status === "success" ? "success" : "danger"}>
					{message}
				</Alert>
			)}

			<Form onSubmit={handleOnSubmit} autoComplete="off">
				<Form.Group className="mb-3">
					<Form.Label>Verification Code (OTP)</Form.Label>
					<Form.Control
						type="text"
						name="pin"
						value={newPassword.pin}
						onChange={handleOnChange}
						placeholder="Enter 6-digit OTP"
						maxLength="6"
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>New Password</Form.Label>
					<Form.Control
						type="password"
						name="password"
						value={newPassword.password}
						onChange={handleOnChange}
						placeholder="Create a strong password"
						autoComplete="new-password"
						required
					/>
				</Form.Group>

				<Form.Group className="mb-3">
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type="password"
						name="confirmPass"
						value={newPassword.confirmPass}
						onChange={handleOnChange}
						placeholder="Confirm your password"
						autoComplete="new-password"
						required
					/>
				</Form.Group>

				{!passwordError.confirmPass && newPassword.confirmPass && (
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
							Updating...
						</>
					) : (
						'Update Password'
					)}
				</Button>
			</Form>
		</Container>
	);
};

export default UpdatePasswordForm;
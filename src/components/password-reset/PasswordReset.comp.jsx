import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendPasswordResetOtp } from "./passwordAction";

import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Alert,
	Spinner,
} from "react-bootstrap";

export const ResetPassword = () => {
	const dispatch = useDispatch();

	const [email, setEmail] = useState("");

	const { isLoading, status, message } = useSelector(state => state.password);

	const handleOnResetSubmit = e => {
		e.preventDefault();

		dispatch(sendPasswordResetOtp(email));
	};

	const handleOnChange = e => {
		const { value } = e.target;
		setEmail(value);
	};

	return (
		<Container className="p-0">
			<div className="login-header">
				<div className="login-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
					</svg>
				</div>
				<h1>Reset Password</h1>
				<p>Enter your email to receive a reset code</p>
			</div>

			{message && (
				<Alert variant={status === "success" ? "success" : "danger"}>
					{message}
				</Alert>
			)}

			<Form autoComplete="off" onSubmit={handleOnResetSubmit}>
				<Form.Group className="mb-4">
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type="email"
						name="email"
						value={email}
						onChange={handleOnChange}
						placeholder="Enter your email address"
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
							Sending...
						</>
					) : (
						'Send Reset Code'
					)}
				</Button>
			</Form>

			<div className="form-footer">
				<div>
					Remember your password? <a href="/">Back to Login</a>
				</div>
			</div>
		</Container>
	);
};

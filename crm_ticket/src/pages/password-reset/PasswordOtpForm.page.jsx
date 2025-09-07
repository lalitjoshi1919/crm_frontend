import React from "react";
import { useSelector } from "react-redux";

import { ResetPassword } from "../../components/password-reset/PasswordReset.comp";
import UpdatePasswordForm from "../../components/password-reset/UpdatePasswordForm.comp";

import "./passwordOtpForm.style.css";

export const PasswordOtpForm = () => {
  const { showUpdatePassForm } = useSelector(state => state.password);

  return (
    <div className="entry-page custom-bg">
      <div className="form-box custom-card">
        {showUpdatePassForm ? <UpdatePasswordForm /> : <ResetPassword />}
        <div className="text-center">
          <a href="/" className="custom-link">Login Now</a>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import RegistrationForm from "../../components/registration-form/RegistrationForm.comp";
import "./registration.style.css";

export const Registration = () => {
  return (
    <div className="registration-page custom-bg">
      <div className="mt-5">
        <div className="form-box custom-card">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

import React from "react";
import RegistrationForm from "../../components/registration-form/RegistrationForm.comp";
import "./registration.style.css";

export const Registration = () => {
  return (
    <div className="registration-page bg-info">
      <div className="mt-5">
        <div className="form-box bg-light p-4 rounded shadow">
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
};

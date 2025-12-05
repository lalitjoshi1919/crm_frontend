import React from "react";
import RegistrationForm from "../../components/registration-form/RegistrationForm.comp";
import "./registration.style.css";

export const Registration = () => {
  return (
    <div className="registration-page">
      <div className="registration-card">
        <RegistrationForm />
      </div>
    </div>
  );
};

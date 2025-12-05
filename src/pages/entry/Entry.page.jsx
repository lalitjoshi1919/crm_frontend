import React, { useState } from "react";
import { LoginForm } from "../../components/login/Login.comp";
import { ResetPassword } from "../../components/password-reset/PasswordReset.comp";
import "./entry.style.css";

export const Entry = () => {
  const [frmLoad, setFrmLoad] = useState("login");

  const handleOnResetSubmit = e => {
    e.preventDefault();
  };

  const formSwitcher = frmType => {
    setFrmLoad(frmType);
  };

  return (
    <div className="entry-page custom-bg">
      <div className="form-box custom-card">
        {frmLoad === "login" && <LoginForm formSwitcher={formSwitcher} />}
        {frmLoad === "rest" && (
          <ResetPassword
            handleOnResetSubmit={handleOnResetSubmit}
            formSwitcher={formSwitcher}
          />
        )}
      </div>
    </div>
  );
};

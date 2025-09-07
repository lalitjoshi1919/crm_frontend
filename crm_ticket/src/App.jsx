import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import "./styles/global.css";
import { Header } from "./layout/partials/Header.comp";

import { PrivateRoute } from "./components/private-route/PrivateRoute.comp";
import { Dashboard } from "./pages/dashboard/Dashboard.page";
import { UserVerification } from "./pages/user-verification/UserVerification.page";
import { Entry } from "./pages/entry/Entry.page";
import { PasswordOtpForm } from "./pages/password-reset/PasswordOtpForm.page";
import { Registration } from "./pages/registration/Registration.page";
import { AddTicket } from "./pages/new-ticket/AddTicket.page";
import { TicketLists } from "./pages/ticket-list/TicketLists.page";
import { Ticket } from "./pages/ticket/Ticket.page";

function App() {
  const location = useLocation();

  // Define routes where Header should NOT be shown
  const noHeaderRoutes = ["/", "/registration", "/password-reset"];
  const hideHeader = noHeaderRoutes.includes(location.pathname) || location.pathname.startsWith("/verification");

  return (
    <div className="App">
      {!hideHeader && <Header />} {/* Conditionally render Header */}
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/password-reset" element={<PasswordOtpForm />} />
        <Route path="/verification/:_id/:email" element={<UserVerification />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-ticket"
          element={
            <PrivateRoute>
              <AddTicket />
            </PrivateRoute>
          }
        />
        <Route
          path="/ticket/:tId"
          element={
            <PrivateRoute>
              <Ticket />
            </PrivateRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <PrivateRoute>
              <TicketLists />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<h1>404 Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;

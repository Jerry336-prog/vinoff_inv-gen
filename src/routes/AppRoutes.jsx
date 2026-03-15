import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Error404 from "../pages/misc/Error404";
import Unauthorized from "../pages/misc/Unauthorised";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/Forgotpassword";
import ResetPassword from "../pages/auth/Resetpassword";

import Dashboard from "../pages/dashboard/Dashboard";

import InvoiceItemRow from "../components/invoice/InvoiceItemrow";
import InvoiceList from "../pages/invoices/InvoiceList";
import CreateInvoice from "../pages/invoices/InvoiceCreate";
import InvoiceEdit from "../pages/invoices/InvoiceEdit";
import InvoiceView from "../pages/invoices/InvoiceView";
import InvoicePublic from "../pages/invoices/InvoicePublic";

import CustomerList from "../pages/customers/CustomerList";
import CustomerCreate from "../pages/customers/CustomerCreate";
import CustomerDetails from "../pages/customers/CustomerDetails";
import CustomerEdit from "../pages/customers/CustomerEdit";

import Landing from "../pages/landing/Landingpage";
import ProtectedRoute from "../pages/protectionroute/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpass" element={<ForgotPassword />} />
        <Route path="/resetpass" element={<ResetPassword />} />
        <Route path="/invoicepublic/:id" element={<InvoicePublic />} />
        <Route path="/error404" element={<Error404 />} />
        <Route path="/unauthorised" element={<Unauthorized />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoicerow"
          element={
            <ProtectedRoute>
              <InvoiceItemRow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoicelist"
          element={
            <ProtectedRoute>
              <InvoiceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoicecreate"
          element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoiceedit/:id"
          element={
            <ProtectedRoute>
              <InvoiceEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoiceview/:id"
          element={
            <ProtectedRoute>
              <InvoiceView />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/customerlist"
          element={
            <ProtectedRoute>
              <CustomerList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customercreate"
          element={
            <ProtectedRoute>
              <CustomerCreate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customerdetail/:id"
          element={
            <ProtectedRoute>
              <CustomerDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customeredit/:id"
          element={
            <ProtectedRoute>
              <CustomerEdit />
            </ProtectedRoute>
          }
        /> */}

        {/* FALLBACK */}
        <Route path="*" element={<Error404 />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
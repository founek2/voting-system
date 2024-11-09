import React, { Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import HomePage from "../Pages/HomePage";
import OAuthCallback from "../Pages/OAuthCallback";
import LayoutAdmin from "../Components/LayoutAdmin";
import Layout from "../Components/Layout";
import AuthGuard from "../Components/AuthGuard";
import ElectionPage from "../Pages/ElectionPage";
import ElectionEditPage from "../Pages/ElectionEditPage";
import ElectionCreatePage from "../Pages/ElectionCreatePage";
import PositionPage from "../Pages/PositionPage";
import PositionCreatePage from "../Pages/PositionCreatePage";
import PositionEditPage from "../Pages/PositionEditPage";
import DashboardPage from "../Pages/DashboardPage";

const SuspenseTrigger = () => {
  throw new Promise(() => {});
};

export default function MyRoutes() {
  return (
    <Routes>
      {/* <Route path="/registration" element={<Registration />} /> */}
      <Route path="/auth" element={<AuthGuard />}>
        <Route path="/auth/admin" element={<LayoutAdmin />}>
          <Route
            path="/auth/admin/elections/create"
            element={<ElectionCreatePage />}
          />
          <Route
            path="/auth/admin/elections/:id"
            element={<ElectionEditPage />}
          />
          <Route
            path="/auth/admin/positions/create"
            element={<PositionCreatePage />}
          />
          <Route
            path="/auth/admin/positions/:id"
            element={<PositionEditPage />}
          />
          <Route path="/auth/admin" element={<DashboardPage />} />
          <Route path="/auth/admin/positions" element={<PositionPage />} />
          <Route path="/auth/admin/elections" element={<ElectionPage />} />
        </Route>
      </Route>

      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/" element={<Layout />}>
        <Route path="" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

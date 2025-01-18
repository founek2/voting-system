import React, { Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import PublicHomePage from "../Pages/PublicHomePage";
import OAuthCallback from "../Pages/OAuthCallback";
import Layout from "../Components/Layout";
import AuthGuard from "../Components/AuthGuard";
import ElectionPage from "../Pages/ElectionPage";
import ElectionEditPage from "../Pages/ElectionEditPage";
import ElectionCreatePage from "../Pages/ElectionCreatePage";
import PositionPage from "../Pages/PositionPage";
import PositionCreatePage from "../Pages/PositionCreatePage";
import PositionEditPage from "../Pages/PositionEditPage";
import DashboardPage from "../Pages/DashboardPage";
import DashboardUserPage from "../Pages/DashboardUserPage";
import LayoutAuth from "../Components/LayoutAuth";
import CandidateCreatePage from "../Pages/CandidateCreatePage";
import CandidateEditPage from "../Pages/CandidateEditPage";
import VotePage from "../Pages/VotePage";
import ReportPage from "../Pages/ReportPage";
import ResolutionPage from "../Pages/ResolutionPage";
import ReportCreatePage from "../Pages/ReportCreatePage";
import ResolutionCreatePage from "../Pages/ResolutionCreatePage";
import ReportEditPage from "../Pages/ReportEditPage";
import ResolutionEditPage from "../Pages/ResolutionEditPage";
import PublicReportPage from "../Pages/PublicReportPage";
import PublicResolutionPage from "../Pages/PublicResolutionPage";
import ElectionVotesPage from "../Pages/ElectionVotesPage";

const SuspenseTrigger = () => {
  throw new Promise(() => {});
};

export default function MyRoutes() {
  return (
    <Routes>
      {/* <Route path="/registration" element={<Registration />} /> */}
      <Route path="/auth" element={<AuthGuard />}>
        <Route path="/auth/admin" element={<LayoutAuth />}>
          <Route
            path="/auth/admin/elections/create"
            element={<ElectionCreatePage />}
          />
          <Route
            path="/auth/admin/elections/:id"
            element={<ElectionEditPage />}
          />
          <Route
            path="/auth/admin/elections/:id/votes"
            element={<ElectionVotesPage />}
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
          <Route
            path="/auth/admin/resolutions/create"
            element={<ResolutionCreatePage />}
          />
          <Route
            path="/auth/admin/resolutions/:id"
            element={<ResolutionEditPage />}
          />
          <Route path="/auth/admin/resolutions" element={<ResolutionPage />} />
          <Route
            path="/auth/admin/reports/create"
            element={<ReportCreatePage />}
          />
          <Route path="/auth/admin/reports/:id" element={<ReportEditPage />} />
          <Route path="/auth/admin/reports" element={<ReportPage />} />
        </Route>
        <Route path="/auth/user" element={<LayoutAuth />}>
          <Route
            path="/auth/user/elections/:electionId/candidates/create"
            element={<CandidateCreatePage />}
          />
          <Route
            path="/auth/user/candidates/:id"
            element={<CandidateEditPage />}
          />
          <Route path="/auth/user/vote" element={<VotePage />} />
          <Route path="/auth/user" element={<DashboardUserPage />} />
        </Route>
      </Route>

      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/" element={<Layout />}>
        <Route path="/reports" element={<PublicReportPage />} />
        <Route path="/resolutions" element={<PublicResolutionPage />} />
        <Route path="" element={<PublicHomePage />} />
      </Route>
    </Routes>
  );
}

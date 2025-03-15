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
import ElectionResultPage from "../Pages/ElectionResultPage";
import ElectionCandidatesPage from "../Pages/ElectionCandidatesPage";
import BoardMemeberPage from "../Pages/BoardMemeberPage";
import BoardMemberCreatePage from "../Pages/BoardMemberCreatePage";
import BoardMemberEditPage from "../Pages/BoardMemberEditPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PublicHomePage />,
      },
      {
        path: "reports",
        element: <PublicReportPage />,
      },
      {
        path: "resolutions",
        element: <PublicResolutionPage />,
      },
    ],
  },
  {
    path: "/oauth/callback",
    element: <OAuthCallback />,
  },
  {
    path: "/auth",
    element: <AuthGuard />,
    // loader: rootLoader,
    children: [
      {
        path: "admin",
        element: <LayoutAuth />,
        // loader: teamLoader,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "elections/create",
            element: <ElectionCreatePage />,
          },
          {
            path: "elections/:id",
            element: <ElectionEditPage />,
          },
          {
            path: "elections/:id/votes",
            element: <ElectionVotesPage />,
          },
          {
            path: "elections/:id/result",
            element: <ElectionResultPage />,
          },
          {
            path: "elections/:id/candidates",
            element: <ElectionCandidatesPage />,
          },
          {
            path: "positions/create",
            element: <PositionCreatePage />,
          },
          {
            path: "positions/:id",
            element: <PositionEditPage />,
          },
          {
            path: "positions",
            element: <PositionPage />,
          },
          {
            path: "elections",
            element: <ElectionPage />,
          },
          {
            path: "resolutions/create",
            element: <ResolutionCreatePage />,
          },
          {
            path: "resolutions/:id",
            element: <ResolutionEditPage />,
          },
          {
            path: "resolutions",
            element: <ResolutionPage />,
          },
          {
            path: "reports/create",
            element: <ReportCreatePage />,
          },
          {
            path: "reports/:id",
            element: <ReportEditPage />,
          },
          {
            path: "reports",
            element: <ReportPage />,
          },
          {
            path: "candidates/:id",
            element: <CandidateEditPage />,
          },
          {
            path: "borad/create",
            element: <BoardMemberCreatePage />,
          },
          {
            path: "borad/:id",
            element: <BoardMemberEditPage />,
          },
          {
            path: "borad",
            element: <BoardMemeberPage />,
          },
        ],
      },
      {
        path: "user",
        element: <LayoutAuth />,
        children: [
          { index: true, element: <DashboardUserPage /> },
          {
            path: "vote",
            element: <VotePage />,
          },
          {
            path: "candidates/:id",
            element: <CandidateEditPage />,
          },
          {
            path: "elections/:electionId/candidates/create",
            element: <CandidateCreatePage />,
          },
        ],
      },
    ],
  },
]);

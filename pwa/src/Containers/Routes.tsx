import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "../Components/AuthGuard";
import Layout from "../Components/Layout";
import BoardMemberCreatePage from "../Pages/BoardMemberCreatePage";
import BoardMemberEditPage from "../Pages/BoardMemberEditPage";
import BoardMemeberPage from "../Pages/BoardMemeberPage";
import CandidateCreatePage from "../Pages/CandidateCreatePage";
import CandidateEditPage from "../Pages/CandidateEditPage";
// import DashboardPage from "../Pages/DashboardPage";
import DashboardUserPage from "../Pages/DashboardUserPage";
// import ElectionCandidatesPage from "../Pages/ElectionCandidatesPage";
// import ElectionCreatePage from "../Pages/ElectionCreatePage";
// import ElectionEditPage from "../Pages/ElectionEditPage";
import ElectionPage from "../Pages/ElectionPage";
// import ElectionResultPage from "../Pages/ElectionResultPage";
// import ElectionVotesPage from "../Pages/ElectionVotesPage";
import OAuthCallback from "../Pages/OAuthCallback";
// import PositionCreatePage from "../Pages/PositionCreatePage";
import PositionEditPage from "../Pages/PositionEditPage";
import PositionPage from "../Pages/PositionPage";
import PublicHomePage from "../Pages/PublicHomePage";
import PublicReportPage from "../Pages/PublicReportPage";
import PublicResolutionPage from "../Pages/PublicResolutionPage";
import ReportCreatePage from "../Pages/ReportCreatePage";
import ReportEditPage from "../Pages/ReportEditPage";
import ReportPage from "../Pages/ReportPage";
import ResolutionCreatePage from "../Pages/ResolutionCreatePage";
import ResolutionEditPage from "../Pages/ResolutionEditPage";
import ResolutionPage from "../Pages/ResolutionPage";
import VotePage from "../Pages/VotePage";
import Loader from "../Components/Loader";

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
        lazy: () =>
          import(/* webpackChunkName: "admin" */ "../Components/LayoutAuth"),
        children: [
          {
            index: true,
            lazy: () =>
              import(/* webpackChunkName: "admin" */ "../Pages/DashboardPage"),
          },
          {
            path: "elections/create",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ElectionCreatePage"
              ),
          },
          {
            path: "elections/:id",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ElectionEditPage"
              ),
          },
          {
            path: "elections/:id/votes",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ElectionVotesPage"
              ),
          },
          {
            path: "elections/:id/result",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ElectionResultPage"
              ),
          },
          {
            path: "elections/:id/candidates",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ElectionCandidatesPage"
              ),
          },
          {
            path: "positions/create",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/PositionCreatePage"
              ),
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
            path: "board/create",
            element: <BoardMemberCreatePage />,
          },
          {
            path: "board/:id",
            element: <BoardMemberEditPage />,
          },
          {
            path: "board",
            element: <BoardMemeberPage />,
          },
        ],
      },
      {
        path: "user",
        lazy: () => import("../Components/LayoutAuth"),
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

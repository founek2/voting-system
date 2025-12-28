import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "../Components/AuthGuard";
import Layout from "../Components/Layout";
import OAuthCallback from "../Pages/OAuthCallback";
import PublicHomePage from "../Pages/PublicHomePage";
import PublicReportPage from "../Pages/PublicReportPage";
import PublicResolutionPage from "../Pages/PublicResolutionPage";
import { SignOutPage } from "../Pages/SignOutPage";

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
      {
        path: "signOut",
        element: <SignOutPage />
      }
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
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/PositionEditPage"
              ),
          },
          {
            path: "positions",
            lazy: () =>
              import(/* webpackChunkName: "admin" */ "../Pages/PositionPage"),
          },
          {
            path: "elections",
            lazy: () =>
              import(/* webpackChunkName: "admin" */ "../Pages/ElectionPage"),
          },
          {
            path: "resolutions/create",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ResolutionCreatePage"
              ),
          },
          {
            path: "resolutions/:id",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ResolutionEditPage"
              ),
          },
          {
            path: "resolutions",
            lazy: () =>
              import(/* webpackChunkName: "admin" */ "../Pages/ResolutionPage"),
          },
          {
            path: "reports/create",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/ReportCreatePage"
              ),
          },
          {
            path: "reports/:id",
            lazy: () =>
              import(/* webpackChunkName: "admin" */ "../Pages/ReportEditPage"),
          },
          {
            path: "reports",
            lazy: () =>
              import(/* webpackChunkName: "admin" */ "../Pages/ReportPage"),
          },
          {
            path: "candidates/:id",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/CandidateEditPage"
              ),
          },
          {
            path: "board/create",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/BoardMemberCreatePage"
              ),
          },
          {
            path: "board/:id",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/BoardMemberEditPage"
              ),
          },
          {
            path: "board",
            lazy: () =>
              import(
                /* webpackChunkName: "admin" */ "../Pages/BoardMemeberPage"
              ),
          },
        ],
      },
      {
        path: "user",
        lazy: () => import("../Components/LayoutAuth"),
        children: [
          {
            index: true,
            lazy: () =>
              import(
                /* webpackChunkName: "user" */ "../Pages/DashboardUserPage"
              ),
          },
          {
            path: "vote",
            lazy: () =>
              import(/* webpackChunkName: "user" */ "../Pages/VotePage"),
          },
          {
            path: "candidates/:id",
            lazy: () =>
              import(
                /* webpackChunkName: "user" */ "../Pages/CandidateEditPage"
              ),
          },
          {
            path: "elections/:electionId/candidates/create",
            lazy: () =>
              import(
                /* webpackChunkName: "user" */ "../Pages/CandidateCreatePage"
              ),
          },
        ],
      },
    ],
  },
]);

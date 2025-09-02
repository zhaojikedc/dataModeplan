import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { RootLayout } from './modules/layout/RootLayout'
import { LandingPage } from './modules/landing/LandingPage'
import { AssessmentPage } from './modules/assessment/AssessmentPage'
import { PlanPage } from './modules/plan/PlanPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'assessment', element: <AssessmentPage /> },
      { path: 'plan', element: <PlanPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


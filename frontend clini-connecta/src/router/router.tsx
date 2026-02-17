import Layout from "@/layout/Layout";

import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";

import Login from "@/pages/Login";
import HomePage from "@/pages/Homepage";
import AllDoctors from "@/pages/AllDoctors";
import DoctorAvailability from "@/pages/DoctorAvailability";
import Signup from "@/pages/Signup";
import CompleteProfile from "@/pages/CompleteProfile";
import Appointment from "@/pages/Appointment";
import Profile from "@/pages/Profile";
import ClinicDetail from "@/pages/ClinicDetail";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: routes.home,
        element: <HomePage />,
      },
      {
        path: routes.doctors,
        element: <AllDoctors />,
      },
      {
        path: routes.availability,
        element: <DoctorAvailability />,
      },
      {
        path: routes.login,
        element: <Login />,
      },
      {
        path: routes.register,
        element: <Signup />,
      },
      {
        path: routes.completeProfile,
        element: <CompleteProfile />,
      },
      {
        path: routes.appointments,
        element: <Appointment />,
      },
      {
        path: routes.profile,
        element: <Profile />,
      },
      {
        path: routes.clinic,
        element: <ClinicDetail />,
      },
    ],
  },
]);

export default router;

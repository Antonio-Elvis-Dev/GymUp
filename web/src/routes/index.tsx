import { createBrowserRouter } from "react-router-dom";

import { Dashboard } from "@/pages/Dashboard";
import { Gyms } from "@/pages/Gyms";
import { Profile } from "@/pages/Profile";
import Index from "@/pages/Index";
import { Login } from "@/pages/Login";
import { PrivateRoutes } from "./private-routes";

const routes = [
  {
    // errorElement:<Error/>
    children: [{ path: "/sign-in", element: <Login /> }],
  },

  {
    path: "/",
    element: (
      <PrivateRoutes>
        <Index />
      </PrivateRoutes>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/gyms", element: <Gyms /> },
      { path: "/profile", element: <Profile /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

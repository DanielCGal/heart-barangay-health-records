import { createBrowserRouter, Outlet } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { AuthProvider } from "../context/AuthContext";

/**
 * RootLayout wraps every route with AuthProvider so that all route
 * components (LoginPage, Dashboard, …) have access to useAuth().
 *
 * In React Router data-mode (createBrowserRouter) context providers
 * placed *outside* RouterProvider do NOT propagate into the render tree —
 * they must live *inside* the router via a root layout like this.
 */
function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: "/",          Component: LoginPage },
      { path: "/dashboard", Component: Dashboard },
    ],
  },
]);

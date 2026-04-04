import { RouterProvider } from "react-router";
import { router } from "./routes";

// AuthProvider is now inside the router tree (see routes.tsx → RootLayout).
export default function App() {
  return <RouterProvider router={router} />;
}
import React from "react";
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Create from "./components/Create";
import Details from "./components/Details";
import { RootLayout } from "./layouts/root-layout";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create",
        element: <Create />,
      },
      {
        path: "/details/:id",
        element: <Details />,
      },
    ],
  },
]);

export default function App() {
  //   return (
  //     <Routes>
  //       <Route
  //         element={<RootLayout />}
  //         children={[
  //           <Route path="/" element={<Home />} />,
  //           <Route
  //             path="/create"
  //             element={() => {
  //               return <h1>Create</h1>;
  //             }}
  //           />,
  //           <Route path="/details/:id" element={<Details />} />,
  //         ]}
  //       ></Route>
  //     </Routes>
  //   );

  return <RouterProvider router={router} />;
}

import "./App.css";

import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import EventPage from "./components/EventPage";
import EventHub from "./components/EventHub";
import ContentFeed from "./components/ContentFeed";
import UserProfile from "./components/UserProfile"

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <BlogPage />
  },
  {
    path: '/profile',
    element: <UserProfile />,
  },
  {
    path: '/eventhub',
    element: <EventHub />,
  },
  {
    path: '/contentFeed',
    element: <ContentFeed />,
  },
  { /* dinamiği bununla yapacağız */
    path: '/event/:eventid',
    element: <EventPage />
  },
  { /* değişecek */
    path: '/settings',
    element: <EventPage />
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    <Navbar></Navbar>
    </div>
  );
}

export default App;
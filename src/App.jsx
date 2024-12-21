import "./App.css";
import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import EventPage from "./components/EventPage";
import EventHub from "./components/EventHub";
import ContentFeed from "./components/ContentFeed";
import UserProfile from "./components/UserProfile";
import SavedLikedPosts from "./components/SavedLikedPosts";
import SearchPage from "./components/SearchPage";
import SettingsPage from "./components/SettingsPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Create a root layout component that includes the Navbar
const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [  // These are the child routes that will render in the Outlet
      {
        path: '/',
        element: <BlogPage />
      },
      {
        path: '/profile',
        element: <UserProfile />
      },
      {
        path: '/eventhub',
        element: <EventHub />
      },
      {
        path: '/contentFeed',
        element: <ContentFeed />
      },
      {
        path: '/event/:eventid',
        element: <EventPage />
      },
      {
        path: '/settings',
        element: <SettingsPage />
      },
      {
        path: '/savedliked',
        element: <SavedLikedPosts />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
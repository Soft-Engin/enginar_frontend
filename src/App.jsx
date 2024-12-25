import "./App.css";
import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import RecipePage from "./components/RecipePage";
import EventPage from "./components/EventPage";
import EventHub from "./components/EventHub";
import ContentFeed from "./components/ContentFeed";
import UserProfile from "./components/UserProfile";
import SavedLikedPosts from "./components/SavedLikedPosts";
import SearchPage from "./components/SearchPage";
import SettingsPage from "./components/SettingsPage";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import RecipeCreator from "./components/CreateRecipe";


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
        element: <ContentFeed />
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
        path: '/blog',
        element: <BlogPage />
      },
      {
        path: '/recipe',
        element: <RecipePage />
      },
      {
        path: '/search',
        element: <SearchPage />
      },
      {
        path: '/event',
        element: <EventPage />
      },
      {
        path: '/settings',
        element: <SettingsPage />
      },
      {
        path: '/savedliked',
        element: <SavedLikedPosts />
      },
      {
        path: '/createRecipe',
        element: <RecipeCreator />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
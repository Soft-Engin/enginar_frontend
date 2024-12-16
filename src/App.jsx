import "./App.css";

import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import EventPage from "./components/EventPage";
import ContentFeed from "./components/ContentFeed";
import EventHub from "./components/EventHub";
import RecipeCreator from "./components/CreateRecipe"

function App() {
  return (
    <div>
    <Navbar></Navbar>
    <RecipeCreator />
    </div>
  );
}

export default App;

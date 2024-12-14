import "./App.css";

import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import EventPage from "./components/EventPage";
import ContentFeed from "./components/ContentFeed";

function App() {
  return (
    <div>
    <Navbar></Navbar>
    <BlogPage />
    </div>
  );
}

export default App;

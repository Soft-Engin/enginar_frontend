import "./App.css";

import Navbar from "./components/Navbar";
import RecommendedUsers from "./components/RecommendedUsers";
import UpcomingEvents from "./components/UpcomingEvents";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <div>
    <Navbar></Navbar>
    <UserProfile/>
    <RecommendedUsers></RecommendedUsers>
    <UpcomingEvents></UpcomingEvents>
    </div>
  );
}

export default App;

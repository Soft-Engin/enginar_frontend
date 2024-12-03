import "./App.css";

import Navbar from "./components/Navbar";
import EventCompressed from "./components/EventCompressed";
import Box from "@mui/material/Box";

function App() {
  return (
    <div>
    <Navbar></Navbar>
    <Box display="flex" justifyContent="center" alignItems="center" height="90vh" >
        <EventCompressed />
    </Box>
    </div>
  );
}

export default App;

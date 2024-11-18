import "./App.css";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
    <Navbar></Navbar>
      <Stack spacing={2} direction="row" justifyContent={"center"}>
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
    </div>
  );
}

export default App;

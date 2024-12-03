import * as React from "react";
import EventCompressed from "./EventCompressed";
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";

function generate(element) {
  return [0, 1, 2, 3, 4, 5].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function EventHub() {
  return (
    <Grid container spacing={4} sx={{ pt: 3, pb: 5, pl: 20, pr: 20 }}>
      <Grid item size={12} sx={{ pl: 5 }}>
        <Button variant="contained" style={{ backgroundColor: "#4B9023", borderRadius: 20, width: "200px", height: "50px", textTransform: "none", marginRight: 25 }}>
        <Typography variant="h5" >
          City: Istanbul
        </Typography>
        </Button>
        <Button variant="contained" style={{ backgroundColor: "#4B9023", borderRadius: 20, width: "100px", height: "50px", textTransform: "none" }}>
        <Typography variant="h5" >
          Date
        </Typography>
        </Button>
      </Grid>
      {generate(<EventCompressed />).map((event, index) => (
        <Grid item size={6} key={index} display="flex" justifyContent="center" alignItems="center">
          {event}
        </Grid>
      ))}
    </Grid>
  );
}
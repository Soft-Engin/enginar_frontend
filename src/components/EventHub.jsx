import * as React from "react";
import EventCompressed from "./EventCompressed";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
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
    <Grid
      container
      rowSpacing={4}
      columnSpacing={2.5}
      sx={{ pt: 3, pb: 5, pl: 12, pr: 12 }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item size={12} display="flex" justifyContent="center">
        <Button
          variant="contained"
          style={{
            backgroundColor: "#4B9023",
            borderRadius: 20,
            width: "200px",
            height: "50px",
            textTransform: "none",
            marginRight: 25,
          }}
        >
          <Typography variant="h5" noWrap>
            City: Istanbul
          </Typography>
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: "#4B9023",
            borderRadius: 20,
            width: "100px",
            height: "50px",
            textTransform: "none",
          }}
        >
          <Typography variant="h5" noWrap>
            Date
          </Typography>
        </Button>
      </Grid>
      {generate(<EventCompressed />).map((event, index) => (
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={6}
          xl={6}
          key={index}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: { xs: 500, sm: 500, md: 600, lg: 490, xl: 630 } }}
        >
          {event}
        </Grid>
      ))}
    </Grid>
  );
}

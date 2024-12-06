import * as React from "react";
import RecipeMini from "./RecipeMini";
import Grid from '@mui/material/Grid2';

function generate(element) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function SavedPosts() {
  return (
    <Grid container spacing={4} sx={{ pt: 9, pb: 5, pl: 20, pr: 20 }}>
      {generate(<RecipeMini />).map((recipe, index) => (
        <Grid item size={4} key={index} display="flex" justifyContent="center" alignItems="center">
          {recipe}
        </Grid>
      ))}
    </Grid>
  )
}
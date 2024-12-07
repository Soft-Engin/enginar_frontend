import * as React from "react";
import RecipeMini from "./RecipeMini";
import BlogMini from "./BlogMini";
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function generate(element) {
  return [0, 1, 2, 3, 4, 5, 6, 7].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SavedLikedPosts() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ '& .MuiTabs-indicator': { backgroundColor: '#4B9023' }}} >
          <Tab label="Recipes" sx={{ '&.Mui-selected': { color: '#4B9023' } }} {...a11yProps(0)} />
          <Tab label="Blogs" sx={{ '&.Mui-selected': { color: '#4B9023' } }} {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid container spacing={4} sx={{ pt: 2, pb: 5, pl: 20, pr: 20 }}>
          {generate(<RecipeMini />).map((recipe, index) => (
            <Grid item size={4} key={index} display="flex" justifyContent="center" alignItems="center">
              {recipe}
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid container spacing={4} sx={{ pt: 2, pb: 5, pl: 20, pr: 20 }}>
          {generate(<BlogMini />).map((blog, index) => (
            <Grid item size={4} key={index} display="flex" justifyContent="center" alignItems="center">
              {blog}
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>
    </Box>
  )
}
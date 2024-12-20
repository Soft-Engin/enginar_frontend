import * as React from "react";
import RecipeMini from "./RecipeMini";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function generate(element) {
  return [0, 1, 2, 3, 4, 5, 6].map((value) =>
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SearchedRecipes() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="Search Tabs"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#4B9023" } }}
        >
          <Tab
            label="Popular Recipes"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(0)}
          />
          <Tab
            label="Most Recent"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        {generate(<RecipeMini />).map((recipe, index) => (
          <Box key={index} sx={{ width: 550, mb: 2 }}>
            {recipe}
          </Box>
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {generate(<RecipeMini />).map((recipe, index) => (
          <Box key={index} sx={{ width: 550, mb: 2 }}>
            {recipe}
          </Box>
        ))}
      </CustomTabPanel>
    </Box>
  );
}

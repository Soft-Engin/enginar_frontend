import * as React from "react";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PopularRecipesTab from "./PopularRecipesTab";
import PopularBlogsTab from "./PopularBlogsTab";
import FollowingTab from "./FollowingTab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{display: "flex", justifyContent: "center"}}
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

export default function ContentFeed() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box
      sx={{
        width: "50vw",
        margin: "0 auto",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="Feed Tabs"
          variant="fullWidth"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#4B9023" } }}
        >
          <Tab
            label="Popular Recipes"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(0)}
          />
          <Tab
            label="Popular Blogs"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(1)}
          />
          <Tab
            label="Following"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <PopularRecipesTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PopularBlogsTab />
      </CustomTabPanel>
       <CustomTabPanel value={value} index={2}>
        <FollowingTab />
      </CustomTabPanel>
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
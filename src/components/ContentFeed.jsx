import React, { useState } from "react";
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
      data-testid={`tabpanel-${index}`}
      style={{ 
        display: "flex", 
        justifyContent: "center",
        visibility: value === index ? 'visible' : 'hidden'
      }}
      {...other}
    >
      <Box>{children}</Box>
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

  const [userLogged] = useState(localStorage.getItem("userLogged") === "true");

  return (
    <Box data-testid="content-feed" sx={{ margin: "0 auto" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="Feed Tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#4B9023",
            },
            "& .MuiTab-root": {
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              padding: "12px 20px",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#4B9023",
            },
            "& .MuiTab-root:hover": {
              color: "#66c72e",
            },
          }}
        >
          <Tab
            label="Popular Recipes"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(0)}
            data-testid="tab-popular-recipes"
          />
          <Tab
            label="Popular Blogs"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(1)}
            data-testid="tab-popular-blogs"
          />
          {userLogged && (
            <Tab
              label="Following"
              sx={{ "&.Mui-selected": { color: "#4B9023" } }}
              {...a11yProps(2)}
              data-testid="tab-following"
            />
          )}
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <div data-testid="tabpanel-content-popular-recipes">
          <PopularRecipesTab />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div data-testid="tabpanel-content-popular-blogs">
          <PopularBlogsTab />
        </div>
      </CustomTabPanel>
      {userLogged && (
        <CustomTabPanel value={value} index={2}>
          <div data-testid="tabpanel-content-following">
            <FollowingTab />
          </div>
        </CustomTabPanel>
      )}
      <RecommendedUsers data-testid="recommended-users" />
      <UpcomingEvents data-testid="upcoming-events" />
    </Box>
  );
}

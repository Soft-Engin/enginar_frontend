import React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  borderRadius: 15,
  backgroundColor: theme.palette.common.white,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  width: "100%",
  maxWidth: "600px",
  alignItems: "center",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "black",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: "black",
  backgroundColor: "#A5E072",
  "&:before": {
    borderColor: alpha(theme.palette.common.white, 0.7),
  },
  "&:after": {
    borderColor: theme.palette.common.white,
  },
  "& .MuiSelect-icon": {
    color: "black",
  },
  "& .MuiSelect-select": {
    padding: theme.spacing(1),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  borderRadius: "8px",
  height: "30px",
  minWidth: "95px",
  marginRight: 10,
  fontSize: "0.95rem",
}));

const MenuProps = {
  PaperProps: {
    style: {
      backgroundColor: "#A5E072",
      color: "black",
      borderRadius: "0 0 8px 8px",
      marginTop: -6,
      minWidth: "95px",
      boxShadow: "none",
      paddingLeft: 3.5,
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(0.4, 2),
  fontSize: "0.95rem",
}));

export default function SearchBar() {
  const [searchType, setSearchType] = React.useState("user");
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();

  const selectOptions = [
    { value: "user", label: "Users" },
    { value: "blog", label: "Blogs" },
    { value: "recipe", label: "Recipes" },
  ];

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      navigate(`/search?type=${searchType}&query=${searchQuery}`);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <StyledSelect
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          variant="standard"
          disableUnderline
          MenuProps={MenuProps}
        >
          {selectOptions.map((option) => {
            const isSelected = option.value == searchType;
            return (
              <StyledMenuItem
                key={option.value}
                value={option.value}
                sx={{ display: isSelected ? "none" : "block" }}
              >
                {option.label}
              </StyledMenuItem>
            );
          })}
        </StyledSelect>
      </Search>
    </Box>
  );
}

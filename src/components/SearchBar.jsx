import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  width: '100%',
  maxWidth: '600px',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: 'inherit',
  backgroundColor: 'transparent',
  '&:before': {
    borderColor: alpha(theme.palette.common.white, 0.7),
  },
  '&:after': {
    borderColor: theme.palette.common.white,
  },
  '& .MuiSelect-icon': {
    color: alpha(theme.palette.common.white, 0.7),
  },
  '& .MuiSelect-select': {
    padding: theme.spacing(1),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export default function SearchBar() {
  const [searchType, setSearchType] = React.useState('user');

  const handleKeyDown = (event) => {
    if (event.key == 'Enter') {
      window.location.href = `/search?type=${searchType}`;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onKeyDown={handleKeyDown}
        />
        <StyledSelect
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          variant="standard"
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="user">Users</MenuItem>
          <MenuItem value="blog">Blogs</MenuItem>
          <MenuItem value="recipe">Recipes</MenuItem>
        </StyledSelect>
      </Search>
    </Box>
  );
}

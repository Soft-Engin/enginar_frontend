import {
  Typography,
  Box,
  Avatar,
  Button
} from "@mui/material";
import { styled } from "@mui/material/styles";

const SharedButton = styled(Button)(({ theme }) => ({
  border: "#888888",
  borderStyle: "solid",
  borderWidth: "2px",
  height: "30px",
  minWidth: "90px",
  borderRadius: "20px",
}));

const FollowButton = styled(SharedButton)(({ theme }) => ({
  color: "#453E3E",
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  },
  textTransform: "none",
  fontWeight: "bold",
  variant: "subtitle1"
}));

export default function UserListItem() {
  return(
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 5, boxShadow: 2, py: 0.8, px: 2, outline: "1.5px solid #C0C0C0" }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: 38, height: 38, marginRight: 0.7 }}/>
        <Typography variant="body1" component="div" color="text.secondary" noWrap>
          <b>Kusanagi Nene</b>
        </Typography>
      </Box>
      <FollowButton variant="contained">
        Follow
      </FollowButton>
    </Box>
  )
}
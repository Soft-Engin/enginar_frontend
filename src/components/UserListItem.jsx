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
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 3, boxShadow: 3, py: 1, px: 2, mb: 1 }}>
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
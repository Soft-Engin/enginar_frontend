import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";


const SharedButton = styled(Button)(({ theme }) => ({
  border: "black",
  borderStyle: "solid",
  borderWidth: "1px",
  height: "30px",
}));

const SignupButton = styled(SharedButton)(({ theme }) => ({
  color: "#F5F5F5",
  backgroundColor: "#266C20",
  "&:hover": {
    backgroundColor: "#266C20",
  },
}));

const LoginButton = styled(SharedButton)(({ theme }) => ({
  color: "#303030",
  backgroundColor: "#F1F1F1",
  "&:hover": {
    backgroundColor: "#F7F7F7",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  color: "#F5F5F5",
  backgroundColor: "#4B9023",
  "&:hover": {
    backgroundColor: "#4B9023",
  },
  width: "92%",
  height: "50px",
  borderRadius: "25px",
  fontSize: "20px",
  fontWeight: "bold",
}));

export default function AuthPopup() {
  const [open, setOpen] = React.useState(false);
  const [isSignup, setIsSignup] = React.useState(true);

  const handleClickOpen = (signup = true) => {
    setIsSignup(signup);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSwitchToLogin = () => {
    setIsSignup(false);
  };

  const handleSwitchToSignup = () => {
    setIsSignup(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    handleClose();
  };

  return (
    <React.Fragment>
      <Stack
        spacing={2}
        direction="row"
        justifyContent={"center"}
        sx={{ position: "absolute", right: 14 }}
      >
        <LoginButton variant="contained" onClick={() => handleClickOpen(false)}>
          Log In
        </LoginButton>
        <SignupButton variant="contained" onClick={() => handleClickOpen(true)}>
          Sign Up
        </SignupButton>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"xs"}
        PaperProps={{
          sx: { borderRadius: "16px", backgroundColor: "#C8EFA5" },
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle fontSize={52} fontWeight={"bold"}>
          {isSignup ? "Sign Up" : "Log In"}
        </DialogTitle>
        <DialogContent>
          {isSignup ? (
            <>
              <TextField
                required
                margin="dense"
                id="username"
                name="username"
                placeholder="Username"
                type="text"
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: "#FFFFFF", borderRadius: "5px" }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                required
                margin="dense"
                id="email"
                name="email"
                placeholder="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: "#FFFFFF", borderRadius: "5px" }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </>
          ) : (
            <TextField
              required
              margin="dense"
              id="identifier"
              name="identifier"
              placeholder="Username or Email"
              type="text"
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#FFFFFF", borderRadius: "5px" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          <TextField
            required
            margin="dense"
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ backgroundColor: "#FFFFFF", borderRadius: "5px" }}
            slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                },
              }}
          />

          {isSignup && (
            <TextField
              required
              margin="dense"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#FFFFFF", borderRadius: "5px" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}

          {!isSignup && (
            <Typography noWrap component="div" color="#535353">
              <Link
                onClick={() => console.log("Forgot Password")}
                color="#4B9023"
                underline="hover"
                sx={{ cursor: "pointer", position: "absolute", right: "6%" }}
              >
                Forgot password?
              </Link>
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <SubmitButton type="submit">
            {isSignup ? "Sign Up" : "Log In"}
          </SubmitButton>
          <Typography noWrap component="div" color="#535353">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              onClick={isSignup ? handleSwitchToLogin : handleSwitchToSignup}
              color="#4B9023"
              underline="hover"
              sx={{ cursor: "pointer" }}
            >
              {isSignup ? "Hop back in!" : "Sign up today!"}
            </Link>
          </Typography>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

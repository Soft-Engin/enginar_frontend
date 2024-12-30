import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

export function LoadingErrorDisplay({
  loading,
  error,
  loadingMore,
  errorMore,
}) {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    if (error.split(" ")[error.split(" ").length - 1] === "404") {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography>No Content Found</Typography>
        </Box>
      );
    } else {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography color="error">Error: {error}</Typography>
        </Box>
      );
    }
  }

  if (loadingMore) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (errorMore) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <Typography color="error">Error: {errorMore}</Typography>
      </Box>
    );
  }

  return null; 
}

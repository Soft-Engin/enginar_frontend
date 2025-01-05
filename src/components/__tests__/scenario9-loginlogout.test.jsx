import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../Navbar";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8090";

describe("User Journey - Login and Logout", () => {
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location;
    window.location = {
      ...originalLocation,
      reload: vi.fn(),
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test("should allow user to login (bypass UI)", async () => {
    localStorage.removeItem("userLogged");

    // Initial render
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // First verify the navbar is loaded
    await waitFor(() => {
      expect(screen.getByTestId("navbar-container")).toBeInTheDocument();
    });

    // Find the button to open the auth popup
    const openLoginButton = screen.getByTestId("open-login-dialog-button");
    expect(openLoginButton).toBeVisible();

    // Click on the auth popup to show the login form
    fireEvent.click(openLoginButton);

    // Wait for the dialog to be visible
    await waitFor(() => {
      expect(screen.getByTestId("auth-dialog")).toBeInTheDocument();
      expect(screen.getByTestId("auth-dialog")).toBeVisible();
    });

    // Set userLogged to true in localStorage
    localStorage.setItem("userLogged", "true");

    // Re-render the component after setting localStorage
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Verify the user avatar is displayed
    await waitFor(() => {
      expect(screen.getByTestId("user-avatar-button")).toBeInTheDocument();
      expect(screen.getByTestId("user-avatar-button")).toBeVisible();
    });
  });

  test("should allow user to logout (bypass UI)", async () => {
    localStorage.setItem("userLogged", "true");
    // Initial render
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // First verify the navbar is loaded
    await waitFor(() => {
      expect(screen.getByTestId("navbar-container")).toBeInTheDocument();
    });

    // Set userLogged to false in localStorage to simulate logout
    localStorage.setItem("userLogged", "false");

    // Re-render the component
    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Verify we're logged out by checking for "open-login-dialog-button"
    await waitFor(() => {
      expect(
        screen.getByTestId("open-login-dialog-button")
      ).toBeInTheDocument();
      expect(screen.getByTestId("open-login-dialog-button")).toBeVisible();
    });
  });
});

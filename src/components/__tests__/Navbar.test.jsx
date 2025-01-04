/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import axios from "axios";
import Navbar from "../Navbar";

// --- Mock axios to avoid real calls
vi.mock("axios");

// --- Mock AuthPopup so it returns null when user is logged in
vi.mock("../AuthPopup", () => ({
  __esModule: true,
  default: (props) => {
    if (localStorage.getItem("userLogged") === "true") {
      return null; // if user is logged, no AuthPopup
    }
    return (
      <div data-testid="mock-auth-popup">
        AuthPopup Mock -
        <button onClick={() => props.setUserLogged(true)}>Log in user</button>
      </div>
    );
  },
}));

// Mock other children if desired
vi.mock("../SearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-search-bar">SearchBar Mock</div>,
}));

// Example:
vi.mock("../PostPopup", () => ({
  __esModule: true,
  default: ({ open, handleClose }) =>
    open ? (
      <div data-testid="mock-post-popup">
        PostPopup is open
        <button onClick={handleClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("../EventPopup", () => ({
  __esModule: true,
  default: ({ open, handleClose }) =>
    open ? (
      <div data-testid="mock-event-popup">
        EventPopup is open
        <button onClick={handleClose}>Close</button>
      </div>
    ) : null,
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Reset all mocks
    vi.resetAllMocks();
  });

  const renderNavbar = (props = {}) => {
    // If you want to simulate user being logged in:
    // localStorage.setItem("userLogged", "true");
    return render(
      <MemoryRouter>
        <Navbar {...props} />
      </MemoryRouter>
    );
  };

  it("renders Navbar with AuthPopup if user is not logged in", () => {
    // userLogged = false by default
    renderNavbar();

    expect(screen.getByTestId("navbar-container")).toBeInTheDocument();
    expect(screen.getByTestId("navbar-appbar")).toBeInTheDocument();

    // Because user is not logged, we see the mock-auth-popup
    expect(screen.getByTestId("mock-auth-popup")).toBeInTheDocument();

    // Should not see user avatar
    const avatarButton = screen.queryByTestId("user-avatar-button");
    expect(avatarButton).not.toBeInTheDocument();
  });

  it("renders user avatar if user is logged in", async () => {
    // Set up logged in state
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({ userId: "123" }));

    // Mock responses for user data and profile picture
    axios.get.mockImplementation((url) => {
      if (url === '/api/v1/users/me') {
        return Promise.resolve({
          status: 200,
          data: {
            userId: "123",
            firstName: "John",
            lastName: "Doe"
          }
        });
      }
      if (url === '/api/v1/users/123/profile-picture') {
        return Promise.resolve({
          status: 200,
          data: new Blob(['profile-pic'])
        });
      }
      return Promise.resolve({ status: 200, data: {} });
    });

    renderNavbar();

    // Wait for the user avatar to appear
    await waitFor(() => {
      expect(screen.getByTestId("user-avatar-button")).toBeInTheDocument();
    });

    // Verify AuthPopup is not shown
    expect(screen.queryByTestId("mock-auth-popup")).not.toBeInTheDocument();

    // Verify API calls were made with correct URLs
    const getCalls = axios.get.mock.calls;
    expect(getCalls.some(call => call[0] === '/api/v1/users/me')).toBe(true);
    expect(getCalls.some(call => 
      call[0] === '/api/v1/users/123/profile-picture' && 
      call[1]?.responseType === 'blob'
    )).toBe(true);
  });

  it("toggles the drawer open/close when clicking the menu icon", () => {
    renderNavbar();

    const drawerButton = screen.getByTestId("navbar-drawer-button");
    const drawer = screen.getByTestId("navbar-drawer");

    // Initially: we expect the drawer to be closed
    // Usually you'd check its style or classes, but let's rely on existence of MUI classes or dimension
    expect(drawer).toHaveClass("MuiDrawer-root"); // We can do more robust checks

    // Click the drawer button to open
    fireEvent.click(drawerButton);
    // We can't easily check open/closed dimension in the test, but we might rely on something else
    // e.g. if the Drawer has a class that indicates "open"

    // You could do something like:
    // expect(drawer.querySelector('.MuiDrawer-paper')).toHaveStyle('width: 300px');
    // But that depends on your styling approach.
  });

  it("opens user menu when avatar is clicked (user logged in)", async () => {
    // Set up logged in state
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({ userId: "123" }));

    // Mock responses for user data and profile picture
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/v1/users/me')) {
        return Promise.resolve({
          status: 200,
          data: {
            userId: "123",
            firstName: "John",
            lastName: "Doe"
          }
        });
      }
      if (url.includes('/profile-picture')) {
        return Promise.resolve({
          status: 200,
          data: new Blob(['profile-pic'])
        });
      }
      return Promise.resolve({ status: 200, data: {} });
    });

    renderNavbar();

    // Wait for the avatar to appear
    await waitFor(() => {
      expect(screen.getByTestId("user-avatar-button")).toBeInTheDocument();
    });

    // Click avatar and verify menu appears
    const avatarButton = screen.getByTestId("user-avatar-button");
    fireEvent.click(avatarButton);

    // Verify menu is shown
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });

  it("opens/closes speed dial", () => {
    // Set user as logged in to see SpeedDial
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({
      userId: "123",
      roleName: "User"
    }));

    renderNavbar();

    // SpeedDial should be present
    const speedDial = screen.getByTestId("navbar-speed-dial");
    expect(speedDial).toBeInTheDocument();

    // Click to open
    const mainButton = screen.getByRole("button", { name: "SpeedDial tooltip example" });
    fireEvent.click(mainButton);

    // Verify actions are visible
    expect(screen.getByTestId("speed-dial-blog")).toBeInTheDocument();
    expect(screen.getByTestId("speed-dial-event")).toBeInTheDocument();
    expect(screen.getByTestId("speed-dial-recipe")).toBeInTheDocument();
  });

  it("opens PostPopup when speed dial Post is clicked", () => {
    // Set user as logged in to see SpeedDial
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({
      userId: "123",
      roleName: "User"
    }));

    renderNavbar();

    // Wait for SpeedDial to appear and click it
    const speedDial = screen.getByTestId("navbar-speed-dial");
    
    // Click the main SpeedDial button to open it
    const mainButton = screen.getByRole("button", { name: "SpeedDial tooltip example" });
    fireEvent.click(mainButton);

    // Find and click the Blog action
    const postAction = screen.getByTestId("speed-dial-blog");
    fireEvent.click(postAction);

    // Check if PostPopup opened
    expect(screen.getByTestId("mock-post-popup")).toBeInTheDocument();
  });

  it("opens EventPopup when speed dial Event is clicked", async () => {
    // Set user as logged in to see SpeedDial
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({
      userId: "123",
      roleName: "User"
    }));

    renderNavbar();

    // Wait for SpeedDial to appear
    const speedDial = screen.getByTestId("navbar-speed-dial");
    
    // Click the main SpeedDial button to open it
    const mainButton = screen.getByRole("button", { name: "SpeedDial tooltip example" });
    fireEvent.click(mainButton);

    // Now find the Event action by its data-testid and click it
    const eventAction = screen.getByTestId("speed-dial-event");
    fireEvent.click(eventAction);

    // Check if EventPopup opened
    expect(screen.getByTestId("mock-event-popup")).toBeInTheDocument();
  });

  it("triggers login from AuthPopup mock", () => {
    renderNavbar();

    // We have "mock-auth-popup"
    const loginButton = screen.getByText("Log in user");
    fireEvent.click(loginButton);

    // After logging in, user avatar should appear
    expect(screen.queryByTestId("mock-auth-popup")).not.toBeInTheDocument();
    expect(screen.getByTestId("user-avatar-button")).toBeInTheDocument();
  });
});

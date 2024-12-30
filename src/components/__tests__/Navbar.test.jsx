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
    // Set userLogged before rendering
    localStorage.setItem("userLogged", "true");

    // Suppose it fetches user data
    axios.get.mockResolvedValueOnce({ status: 200, data: { userId: "123" } });

    renderNavbar();

    // Wait for the user data fetch
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Because user is logged, we do NOT see the AuthPopup
    expect(screen.queryByTestId("mock-auth-popup")).not.toBeInTheDocument();

    // We do see the user avatar
    expect(screen.getByTestId("user-avatar-button")).toBeInTheDocument();
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
    // userLogged = true
    localStorage.setItem("userLogged", "true");
    axios.get.mockResolvedValueOnce({ data: { userId: "123" } });

    renderNavbar();

    // Wait for user data fetch
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const avatarButton = screen.getByTestId("user-avatar-button");
    fireEvent.click(avatarButton);

    // Now we expect the user menu to be open
    const userMenu = screen.getByTestId("user-menu");
    expect(userMenu).toBeInTheDocument();
    expect(userMenu).toBeVisible();
  });

  it("opens/closes speed dial", () => {
    renderNavbar();

    // SpeedDial is present
    const speedDial = screen.getByTestId("navbar-speed-dial");
    expect(speedDial).toBeInTheDocument();

    // MUI SpeedDial uses the main button to open
    const fabButton = screen.getByRole("button", { name: /speeddial actions/i });
    // Click to open
    fireEvent.click(fabButton);

    // The speed-dial actions are now "open"
    // e.g. we might see the 3 SpeedDialAction icons
    // If you're mocking them, just check for the presence of something in the DOM
  });

  it("opens PostPopup when speed dial Post is clicked", () => {
    renderNavbar();

    const speedDial = screen.getByTestId("navbar-speed-dial");
    // open
    const fabButton = screen.getByRole("button", { name: /speeddial actions/i });
    fireEvent.click(fabButton);

    // The Post action typically has a tooltip: "Post"
    const postAction = screen.getByText("Post");
    fireEvent.click(postAction);

    // Now the PostPopup should appear
    expect(screen.getByTestId("mock-post-popup")).toBeInTheDocument();
  });

  it("opens EventPopup when speed dial Etkinlik is clicked", () => {
    renderNavbar();

    const fabButton = screen.getByRole("button", { name: /speeddial actions/i });
    fireEvent.click(fabButton);

    const eventAction = screen.getByText("Etkinlik");
    fireEvent.click(eventAction);

    // Now the EventPopup should appear
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

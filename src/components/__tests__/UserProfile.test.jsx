/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import UserProfile from "../UserProfile"; // Adjust path as needed
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("axios");

describe("UserProfile Component", () => {
  // A helper to render <UserProfile /> in a Router context
  const renderUserProfile = (route = "/profile?id=abc123") => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          {/* 
            If your route is something like "/profile", 
            adapt the path accordingly
          */}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    // Mock localStorage userData if needed
    // localStorage.setItem("userData", JSON.stringify({ userId: "xyz456" }));
  });

  it("shows loading spinner while fetching user data", () => {
    // We haven't resolved axios yet
    renderUserProfile();

    // We expect the loading spinner to appear
    expect(screen.getByTestId("user-profile-loading")).toBeInTheDocument();
  });

  it("shows error state if fetching user data fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch user"));

    renderUserProfile("/profile?id=abc123");

    // Wait for the error screen
    await waitFor(() =>
      expect(screen.getByTestId("user-profile-error")).toBeInTheDocument()
    );
    expect(screen.getByText(/Error: Failed to fetch user/i)).toBeInTheDocument();
  });

  it("renders user profile details after successful fetch", async () => {
    // 1) Mock GET /api/v1/users/abc123
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        userId: "abc123",
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        bio: "Hello from John",
      },
    });
    // 2) Mock GET /api/v1/users/abc123/profile-picture
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["img"]) });
    // 3) Mock GET /api/v1/users/abc123/banner
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["banner"]) });
    // 4) Mock GET /api/v1/users/abc123/followers
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 12 } });
    // 5) Mock GET /api/v1/users/abc123/following
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 5 } });

    renderUserProfile();

    // Wait for data
    await waitFor(() =>
      expect(screen.queryByTestId("user-profile-loading")).not.toBeInTheDocument()
    );

    // Check user info
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("johndoe")).toBeInTheDocument();
    expect(screen.getByText("Hello from John")).toBeInTheDocument();
    // Check follower/following counts
    expect(screen.getByText("5 Following")).toBeInTheDocument();
    expect(screen.getByText("12 Followers")).toBeInTheDocument();
  });

  it("displays follow/unfollow buttons if not own profile and toggles follow state", async () => {
    // Suppose the logged-in user is "xyz456"
    localStorage.setItem("userData", JSON.stringify({ userId: "xyz456" }));

    // 1) Mock GET /api/v1/users/abc123
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        userId: "abc123",
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        bio: "Hello from John",
      },
    });
    // 2) profile pic
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["img"]) });
    // 3) banner
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["banner"]) });
    // 4) GET /api/v1/users/abc123/followers
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 12 } });
    // 5) GET /api/v1/users/abc123/following
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 5 } });
    // 6) GET /api/v1/users/xyz456/following => check if we are following "abc123" or not
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { items: [] }, // not following initially
    });

    renderUserProfile();

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );

    // We see the "Follow" button (because we are not following)
    const followButton = screen.getByRole("button", { name: /Follow/i });
    expect(followButton).toBeInTheDocument();

    // Now mock the POST /api/v1/users/follow to succeed
    axios.post.mockResolvedValueOnce({ status: 200 });
    fireEvent.click(followButton);

    // We'll wait for the button to change to "Unfollow"
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Unfollow/i })).toBeInTheDocument()
    );
  });

  it("does not display follow button if the profile belongs to the logged-in user", async () => {
    // If userId in localStorage matches "abc123", that means it's their own profile
    localStorage.setItem("userData", JSON.stringify({ userId: "abc123" }));

    // Chain the calls
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        userId: "abc123",
        firstName: "John",
        lastName: "Doe",
        userName: "johndoe",
        bio: "Hello from John",
      },
    });
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["img"]) }); // pic
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["banner"]) });
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 12 } }); // followers
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 5 } }); // following

    renderUserProfile();

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /follow/i })).not.toBeInTheDocument();
    });
  });

  it("shows edit profile in menu if it's own profile", async () => {
    localStorage.setItem("userData", JSON.stringify({ userId: "abc123" }));

    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { userId: "abc123", firstName: "John" },
    });
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["pp"]) }); // profile pic
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["banner"]) });
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 2 } }); // followers
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 3 } }); // following

    renderUserProfile();

    await waitFor(() => screen.getByText("John"));

    // Click the "..." menu
    const menuButton = screen.getByTestId("profile-menu-button");
    fireEvent.click(menuButton);

    // "Edit Profile" should appear if it's our own profile
    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();
  });

  it("does not show edit profile if it's someone else's profile", async () => {
    localStorage.setItem("userData", JSON.stringify({ userId: "xyz999" }));

    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { userId: "abc123", firstName: "Jane" },
    });
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["pp"]) }); // pic
    axios.get.mockResolvedValueOnce({ status: 200, data: new Blob(["banner"]) });
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 1 } }); // followers
    axios.get.mockResolvedValueOnce({ status: 200, data: { totalCount: 4 } }); // following

    renderUserProfile();

    await waitFor(() => screen.getByText("Jane"));

    // Click the "..." menu
    const menuButton = screen.getByTestId("profile-menu-button");
    fireEvent.click(menuButton);

    // We do not see "Edit Profile"
    expect(screen.queryByText(/Edit Profile/i)).not.toBeInTheDocument();
  });

  it("can switch tabs (Blogs, Events, Recipes)", async () => {
    // For brevity, we won't detail the entire fetch chain
    axios.get.mockResolvedValue({ status: 200, data: { userId: "abc123" } });
    axios.get.mockResolvedValue({ status: 200, data: new Blob(["pp"]) });
    axios.get.mockResolvedValue({ status: 200, data: new Blob(["banner"]) });
    axios.get.mockResolvedValue({ status: 200, data: { totalCount: 1 } });
    axios.get.mockResolvedValue({ status: 200, data: { totalCount: 2 } });

    renderUserProfile();

    await waitFor(() => screen.getByTestId("user-profile-container"));

    // Tab is presumably at index=0 (Blogs)
    expect(screen.getByText("Blogs")).toBeInTheDocument();

    // Find the tab with label "Events"
    const eventsTab = screen.getByRole("tab", { name: /Events/i });
    fireEvent.click(eventsTab);

    // We can check if the "UserEventsTab" content is visible
    // For instance, if that tab component has some text "No events found" or something
    await waitFor(() => {
      expect(screen.getByText("UserEventsTab")).toBeInTheDocument(); 
      // If your actual "UserEventsTab" text is different, adapt accordingly.
    });

    // Switch to "Recipes" tab
    const recipesTab = screen.getByRole("tab", { name: /Recipes/i });
    fireEvent.click(recipesTab);
    await waitFor(() => {
      expect(screen.getByText("UserRecipesTab")).toBeInTheDocument();
    });
  });
});


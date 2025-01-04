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
vi.mock("../UserBlogsTab", () => ({
  default: () => <div>Blog 1</div>
}));

vi.mock("../UserEventsTab", () => ({
  default: () => <div>Event 1</div>
}));

vi.mock("../UserRecipesTab", () => ({
  default: () => <div>Recipe 1</div>
}));

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
    let followingCount = 5;
    let followersCount = 12;

    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/v1/users/abc123') && !url.includes('followers') && !url.includes('following')) {
        return Promise.resolve({
          status: 200,
          data: {
            userId: "abc123",
            firstName: "John",
            lastName: "Doe",
            userName: "johndoe",
            bio: "Hello from John",
          },
        });
      }
      if (url.includes('/profile-picture')) {
        return Promise.resolve({ status: 200, data: new Blob(["img"]) });
      }
      if (url.includes('/banner')) {
        return Promise.resolve({ status: 200, data: new Blob(["banner"]) });
      }
      if (url.includes('/followers')) {
        return Promise.resolve({ 
          status: 200, 
          data: { totalCount: followersCount } 
        });
      }
      if (url.includes('/following')) {
        return Promise.resolve({ 
          status: 200, 
          data: { 
            items: [],
            totalCount: followingCount 
          } 
        });
      }
      return Promise.reject(new Error('Unhandled URL in test'));
    });

    renderUserProfile();

    // Wait for data and verify initial state
    await waitFor(() => {
      expect(screen.queryByTestId("user-profile-loading")).not.toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("johndoe")).toBeInTheDocument();
      expect(screen.getByText("Hello from John")).toBeInTheDocument();
    });

    // Check follower/following counts
    expect(screen.getByTestId("following-count")).toHaveTextContent(`${followingCount} Following`);
    expect(screen.getByTestId("followers-count")).toHaveTextContent(`${followersCount} Followers`);
  });

  it("displays follow/unfollow buttons if not own profile and toggles follow state", async () => {
    // Set both userLogged and userData in localStorage
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({ 
      userId: "xyz456",
      roleName: "User"
    }));

    let followerCount = 12;

    // Mock API responses handling URL patterns
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/v1/users/abc123') && !url.includes('followers') && !url.includes('following')) {
        return Promise.resolve({
          status: 200,
          data: {
            userId: "abc123",
            firstName: "John",
            lastName: "Doe",
            userName: "johndoe",
            bio: "Hello from John",
          },
        });
      }
      if (url.includes('/profile-picture')) {
        return Promise.resolve({ status: 200, data: new Blob(["img"]) });
      }
      if (url.includes('/banner')) {
        return Promise.resolve({ status: 200, data: new Blob(["banner"]) });
      }
      if (url.includes('/followers')) {
        return Promise.resolve({ 
          status: 200, 
          data: { totalCount: followerCount } 
        });
      }
      if (url.includes('/following')) {
        if (url.includes('xyz456/following')) {
          return Promise.resolve({
            status: 200,
            data: { items: [], totalCount: 0 }
          });
        }
        return Promise.resolve({ status: 200, data: { totalCount: 5 } });
      }
      return Promise.reject(new Error('Unhandled URL in test'));
    });

    // Mock the follow API call before rendering
    axios.post.mockImplementation((url) => {
      if (url.includes('/api/v1/users/follow')) {
        followerCount = 13; // Update the count that will be returned by subsequent GET calls
        return Promise.resolve({ status: 200 });
      }
      return Promise.reject(new Error('Unexpected POST request'));
    });

    renderUserProfile();

    // Wait for loading to complete and content to be visible
    await waitFor(() => {
      expect(screen.queryByTestId("user-profile-loading")).not.toBeInTheDocument();
    });

    // Now look for the Follow button using data-testid
    const followButton = screen.getByTestId("follow-button");
    
    // Click the Follow button
    fireEvent.click(followButton);

    // Wait for the state updates and UI changes
    await waitFor(() => {
      expect(screen.getByTestId("unfollow-button")).toBeInTheDocument();
      expect(screen.getByTestId("followers-count")).toHaveTextContent("13 Followers");
    });
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
    // Set logged-in user as regular user viewing someone else's profile
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({ 
      userId: "xyz999",
      roleName: "User" // Important: specify as regular user
    }));

    // Mock the API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/v1/users/abc123')) {
        return Promise.resolve({
          status: 200,
          data: { 
            userId: "abc123", 
            firstName: "Jane",
            lastName: "Doe"
          },
        });
      }
      if (url.includes('/profile-picture')) {
        return Promise.resolve({ status: 404 }); // No profile pic
      }
      if (url.includes('/banner')) {
        return Promise.resolve({ status: 404 }); // No banner
      }
      if (url.includes('/followers')) {
        return Promise.resolve({ status: 200, data: { totalCount: 1 } });
      }
      if (url.includes('/following')) {
        return Promise.resolve({ 
          status: 200, 
          data: { 
            items: [],
            totalCount: 4 
          } 
        });
      }
      return Promise.reject(new Error('Unhandled URL in test'));
    });

    renderUserProfile();

    await waitFor(() => screen.getByText("Jane Doe"));

    // Verify menu button is not present
    expect(screen.queryByTestId("profile-menu-button")).not.toBeInTheDocument();
  });

  it("can switch tabs (Blogs, Events, Recipes)", async () => {
    // Mock user profile data
    axios.get.mockImplementation((url) => {
      if (url.includes('/users/abc123')) {
        return Promise.resolve({ 
          status: 200, 
          data: { userId: "abc123", firstName: "John" } 
        });
      }
      if (url.includes('/profile-picture')) {
        return Promise.resolve({ status: 200, data: new Blob(["pp"]) });
      }
      if (url.includes('/banner')) {
        return Promise.resolve({ status: 200, data: new Blob(["banner"]) });
      }
      if (url.includes('/followers')) {
        return Promise.resolve({ status: 200, data: { totalCount: 1 } });
      }
      if (url.includes('/following')) {
        return Promise.resolve({ 
          status: 200, 
          data: { 
            items: [],  // Initialize as empty array
            totalCount: 2 
          } 
        });
      }
    });

    renderUserProfile();

    await waitFor(() => screen.getByTestId("user-profile-container"));

    // Test tab switching
    // Verify initial tab (Blogs)
    expect(screen.getByText("Blog 1")).toBeInTheDocument();

    // Switch to Events tab
    const eventsTab = screen.getByRole("tab", { name: /Events/i });
    fireEvent.click(eventsTab);
    expect(screen.getByText("Event 1")).toBeInTheDocument();

    // Switch to Recipes tab
    const recipesTab = screen.getByRole("tab", { name: /Recipes/i });
    fireEvent.click(recipesTab);
    expect(screen.getByText("Recipe 1")).toBeInTheDocument();
  });
});


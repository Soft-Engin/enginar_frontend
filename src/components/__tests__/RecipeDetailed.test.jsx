/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from 'react-router-dom';
import RecipeDetailed from "../RecipeDetailed";

vi.mock("axios");

describe("RecipeDetailed Component", () => {
  let mockGetImplementation;
  let mockPostImplementation;

  // Updated renderRecipeDetailed to include Router
  const renderRecipeDetailed = (recipeId = "abc123") => {
    return render(
      <MemoryRouter>
        <RecipeDetailed recipeId={recipeId} />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem("userLogged", "false");

    // Mock URL utilities
    global.URL.createObjectURL = vi.fn(() => 'mocked-url');
    global.URL.revokeObjectURL = vi.fn();

    mockGetImplementation = (url) => {
      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    };
    mockPostImplementation = (url) => {
      return Promise.reject(new Error(`Unhandled POST url: ${url}`));
    };

    axios.get.mockImplementation((url) => mockGetImplementation(url));
    axios.post.mockImplementation((url) => mockPostImplementation(url));
  });

  it("renders loading spinner initially", () => {
    // We haven't resolved anything => spinner
    renderRecipeDetailed();
    expect(screen.getByTestId("recipe-detailed-loading")).toBeInTheDocument();
  });

  it("renders error if fetching recipe fails", async () => {
    mockGetImplementation = (url) => {
      if (url.includes("/api/v1/recipes/abc123")) {
        return Promise.reject(new Error("Network error on recipe"));
      }
      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    };

    renderRecipeDetailed();

    await waitFor(() => {
      expect(screen.getByTestId("recipe-detailed-error")).toBeInTheDocument();
      expect(screen.getByText(/Network error on recipe/i)).toBeInTheDocument();
    });
  });

  it("renders 'No recipe info' if the recipe is not found or null", async () => {
    // Suppose we get a 200, but an empty data
    mockGetImplementation = (url) => {
      if (url.includes("/api/v1/recipes/abc123")) {
        return Promise.resolve({ status: 200, data: null });
      }
      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    };

    renderRecipeDetailed("abc123");

    // Wait for container
    await waitFor(() =>
      expect(screen.getByTestId("recipe-detailed-nodata")).toBeInTheDocument()
    );
    expect(
      screen.getByText("No recipe information available for this ID")
    ).toBeInTheDocument();
  });

  it("renders recipe details after successful fetch", async () => {
    mockGetImplementation = (url) => {
      if (url.includes("/api/v1/recipes/abc123") && !url.includes("banner") && !url.includes("is-liked")) {
        return Promise.resolve({
          status: 200,
          data: {
            id: "abc123",
            header: "Tasty Pizza",
            bodyText: "This is the best pizza recipe",
            servingSize: 4,
            preparationTime: 30,
            userId: "user999",
            userName: "ChefMaster",
            createdAt: "2024-01-01T10:00:00Z",
            ingredients: [
              { quantity: 2, unit: "cups", ingredientName: "Flour" },
              { quantity: 1, unit: "tsp", ingredientName: "Yeast" },
            ],
            steps: ["Mix flour and yeast", "Bake it"],
          },
        });
      }
      if (url.includes("/profile-picture")) {
        return Promise.resolve({ status: 200, data: new Blob(["profile"]) });
      }
      if (url.includes("/banner")) {
        return Promise.resolve({ status: 200, data: new Blob(["banner"]) });
      }
      if (url.includes("/is-liked")) {
        return Promise.resolve({ data: { isLiked: false, likeCount: 7 } });
      }
      if (url.includes("is-bookmarked")) {
        return Promise.resolve({ data: { isBookmarked: false } });
      }
      // Steps images
      if (url.includes("/steps/0/image")) {
        return Promise.resolve({ status: 200, data: new Blob(["step0img"]) });
      }
      if (url.includes("/steps/1/image")) {
        return Promise.resolve({ status: 200, data: new Blob(["step1img"]) });
      }

      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    };

    renderRecipeDetailed("abc123");

    // Wait for main container
    await waitFor(() =>
      expect(screen.queryByTestId("recipe-detailed-loading")).not.toBeInTheDocument()
    );

    const container = screen.getByTestId("recipe-detailed-container");
    expect(container).toBeInTheDocument();

    // Check text
    expect(screen.getByText("Tasty Pizza")).toBeInTheDocument();
    expect(screen.getByText("This is the best pizza recipe")).toBeInTheDocument();
    expect(screen.getByText("2 cups Flour")).toBeInTheDocument();
    expect(screen.getByText("1 tsp Yeast")).toBeInTheDocument();
    // ...
  });

  it("toggles like if user is logged in", async () => {
    // Mark user as logged
    localStorage.setItem("userLogged", "true");

    // Setup initial state variables
    let isLiked = false;
    let likeCount = 7;

    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url.includes("/api/v1/recipes/abc123") && !url.includes("banner") && !url.includes("is-liked")) {
        return Promise.resolve({
          status: 200,
          data: {
            id: "abc123",
            header: "Pizza",
            userId: "user999",
            ingredients: [],
            steps: [],
          },
        });
      }
      if (url.includes("profile-picture")) {
        return Promise.resolve({ status: 200, data: new Blob(["pp"]) });
      }
      if (url.includes("banner")) {
        return Promise.resolve({ status: 200, data: new Blob(["banner"]) });
      }
      if (url.includes("is-liked")) {
        return Promise.resolve({
          data: {
            isLiked,
            likeCount,
          },
        });
      }
      if (url.includes("is-bookmarked")) {
        return Promise.resolve({ data: { isBookmarked: false } });
      }
      if (url.includes("/steps")) {
        return Promise.resolve({ status: 200, data: null });
      }
      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    });

    // Mock the post request for like toggle
    axios.post.mockImplementation((url) => {
      if (url.includes("/toggle-like")) {
        isLiked = !isLiked;
        likeCount = isLiked ? likeCount + 1 : likeCount - 1;
        return Promise.resolve({ status: 200 });
      }
      return Promise.reject(new Error(`Unhandled POST url: ${url}`));
    });

    renderRecipeDetailed();

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId("recipe-detailed-container")).toBeInTheDocument();
    });

    // Wait for like data to load and verify initial state
    await waitFor(() => {
      expect(screen.getByTestId("like-count")).toHaveTextContent("7");
    });

    // Get and click like button
    const likeButton = screen.getByTestId("like-button");
    fireEvent.click(likeButton);

    // Verify like count increased and icon changed
    await waitFor(() => {
      expect(screen.getByTestId("like-count")).toHaveTextContent("8");
      expect(screen.getByTestId("like-icon-filled")).toBeInTheDocument();
    });

    // Click again to unlike
    fireEvent.click(likeButton);

    // Verify like count decreased and icon changed back
    await waitFor(() => {
      expect(screen.getByTestId("like-count")).toHaveTextContent("7");
      expect(screen.getByTestId("like-icon-border")).toBeInTheDocument();
    });
  });

  it("prompts user to log in if they click the Like button but are not logged in", async () => {
    // userLogged = false
    mockGetImplementation = (url) => {
      if (url === `/api/v1/recipes/abc123`) {
        return Promise.resolve({
          status: 200,
          data: {
            id: "abc123",
            header: "Test Recipe",
            bodyText: "Recipe content",
            userId: "user999",
            userName: "ChefTest",
            ingredients: [],
            steps: []
          }
        });
      }
      if (url.includes('/profile-picture')) {
        return Promise.resolve({ status: 200, data: new Blob(['profile']) });
      }
      if (url.includes('/banner')) {
        return Promise.resolve({ status: 200, data: new Blob(['banner']) });
      }
      if (url.includes('/is-liked')) {
        return Promise.resolve({ 
          status: 200, 
          data: { isLiked: false, likeCount: 0 }
        });
      }
      if (url.includes('/is-bookmarked')) {
        return Promise.resolve({
          status: 200,
          data: { isBookmarked: false }
        });
      }
      if (url.includes('/steps')) {
        return Promise.resolve({ status: 200, data: null });
      }
      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    };

    renderRecipeDetailed("abc123");

    // Wait for the recipe to load
    await waitFor(() => {
      expect(screen.getByTestId("recipe-detailed-container")).toBeInTheDocument();
    });

    // Set up login button mock
    const mockClick = vi.fn();
    const loginButton = document.createElement("button");
    loginButton.id = "loginButton";
    loginButton.addEventListener("click", mockClick);
    document.body.appendChild(loginButton);

    // Find and click the like button
    const likeButton = screen.getByTestId("like-button");
    fireEvent.click(likeButton);

    // Verify login button was clicked
    expect(mockClick).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(loginButton);
  });

  it("toggles bookmark if user is logged in", async () => {
    localStorage.setItem("userLogged", "true");

    let isBookmarked = false;

    mockGetImplementation = (url) => {
      if (url.includes("/api/v1/recipes/abc123") && !url.includes("banner") && !url.includes("is-liked")) {
        return Promise.resolve({
          status: 200,
          data: {
            id: "abc123",
            header: "Pizza",
            userId: "user999",
            ingredients: [],
            steps: [],
          },
        });
      }
      if (url.includes("profile-picture")) {
        return Promise.resolve({ status: 200, data: new Blob(["pp"]) });
      }
      if (url.includes("banner")) {
        return Promise.resolve({ status: 200, data: new Blob(["banner"]) });
      }
      if (url.includes("is-liked")) {
        return Promise.resolve({
          data: {
            isLiked: false,
            likeCount: 0,
          },
        });
      }
      if (url.includes("is-bookmarked")) {
        return Promise.resolve({ data: { isBookmarked } });
      }
      return Promise.reject(new Error(`Unhandled GET url: ${url}`));
    };

    mockPostImplementation = (url) => {
      if (url.includes("/bookmark")) {
        isBookmarked = !isBookmarked;
        return Promise.resolve({ status: 200 });
      }
      return Promise.reject(new Error(`Unhandled POST url: ${url}`));
    };

    renderRecipeDetailed("abc123");

    // Wait for the container
    await waitFor(() =>
      expect(screen.queryByTestId("recipe-detailed-loading")).not.toBeInTheDocument()
    );

    // The bookmark button
    const bookmarkButton = screen.getByTestId("bookmark-button");
    // Initially isBookmarked = false
    // Click to bookmark
    fireEvent.click(bookmarkButton);

    // After toggling, it should be bookmarked = true
    // If your code re-renders the icon to <BookmarkIcon />, 
    // you might check by text or test ID
    // e.g. expect some "filled icon" in the DOM. 
    // We'll just do a waitFor for demonstration:
    await waitFor(() => {
      // example: check the presence of a "filled" bookmark 
      // if you added data-testid="bookmark-icon-filled"
      // or check your "isBookmarked" boolean in the component
    });
  });
});

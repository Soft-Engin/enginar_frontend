/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContentFeed from "../ContentFeed"; // Adjust the path as needed
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Mock Child Components
vi.mock("../PopularRecipesTab", () => {
  return {
    __esModule: true,
    default: ({ "data-testid": testId }) => (
      <div data-testid={testId || "mock-popular-recipes"}>Mock PopularRecipesTab</div>
    ),
  };
});

vi.mock("../PopularBlogsTab", () => {
  return {
    __esModule: true,
    default: ({ "data-testid": testId }) => (
      <div data-testid={testId || "mock-popular-blogs"}>Mock PopularBlogsTab</div>
    ),
  };
});

vi.mock("../FollowingTab", () => {
  return {
    __esModule: true,
    default: ({ "data-testid": testId }) => (
      <div data-testid={testId || "mock-following"}>Mock FollowingTab</div>
    ),
  };
});

vi.mock("../RecommendedUsers", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-recommended-users">Mock RecommendedUsers</div>,
  };
});

vi.mock("../UpcomingEvents", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-upcoming-events">Mock UpcomingEvents</div>,
  };
});

describe("ContentFeed Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  const renderContentFeed = (initialRoute = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<ContentFeed />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders Popular Recipes and Popular Blogs tabs by default", () => {
    renderContentFeed();

    // Check tabs
    expect(screen.getByTestId("tab-popular-recipes")).toBeInTheDocument();
    expect(screen.getByTestId("tab-popular-blogs")).toBeInTheDocument();

    // "Following" tab should not be present
    expect(screen.queryByTestId("tab-following")).not.toBeInTheDocument();

    // Check that PopularRecipesTab content is visible by default
    const popularRecipesPanel = screen.getByTestId("tabpanel-content-popular-recipes");
    expect(popularRecipesPanel).toBeInTheDocument();
    expect(popularRecipesPanel).toBeVisible();

    // Other tab contents should be hidden
    const popularBlogsPanel = screen.getByTestId("tabpanel-content-popular-blogs");
    expect(popularBlogsPanel).toBeInTheDocument();
    expect(popularBlogsPanel.closest('[hidden]')).toBeInTheDocument();

    // Check RecommendedUsers and UpcomingEvents
    expect(screen.getByTestId("mock-recommended-users")).toBeInTheDocument();
    expect(screen.getByTestId("mock-upcoming-events")).toBeInTheDocument();
  });

  it("renders Following tab when user is logged in", () => {
    // Set userLogged to true
    localStorage.setItem("userLogged", "true");

    renderContentFeed();

    // Check tabs
    expect(screen.getByTestId("tab-popular-recipes")).toBeInTheDocument();
    expect(screen.getByTestId("tab-popular-blogs")).toBeInTheDocument();
    expect(screen.getByTestId("tab-following")).toBeInTheDocument();

    // Check that FollowingTab content is not visible by default
    expect(screen.queryByTestId("tabpanel-content-following")).not.toBeVisible();
  });

  it("switches to Popular Blogs tab when clicked", () => {
    renderContentFeed();

    // Click on Popular Blogs tab
    const popularBlogsTab = screen.getByTestId("tab-popular-blogs");
    fireEvent.click(popularBlogsTab);

    // Check that PopularBlogsTab content is now visible
    expect(screen.getByTestId("tabpanel-content-popular-blogs")).toBeInTheDocument();
    expect(screen.getByText("Mock PopularBlogsTab")).toBeInTheDocument();

    // PopularRecipesTab should now be hidden
    expect(screen.queryByTestId("tabpanel-content-popular-recipes")).not.toBeVisible();
  });

  it("switches to Following tab when clicked and user is logged in", () => {
    // Set userLogged to true
    localStorage.setItem("userLogged", "true");

    renderContentFeed();

    // Click on Following tab
    const followingTab = screen.getByTestId("tab-following");
    fireEvent.click(followingTab);

    // Check that FollowingTab content is now visible
    expect(screen.getByTestId("tabpanel-content-following")).toBeInTheDocument();
    expect(screen.getByText("Mock FollowingTab")).toBeInTheDocument();

    // Other tab contents should now be hidden
    expect(screen.queryByTestId("tabpanel-content-popular-recipes")).not.toBeVisible();
    expect(screen.queryByTestId("tabpanel-content-popular-blogs")).not.toBeVisible();
  });

  it("maintains tab state when user logs in", () => {
    // Initially user is not logged in
    renderContentFeed();

    // "Following" tab should not be present
    expect(screen.queryByTestId("tab-following")).not.toBeInTheDocument();

    // Now, simulate user logging in by updating localStorage and re-rendering
    localStorage.setItem("userLogged", "true");

    // Re-render the component
    renderContentFeed();

    // "Following" tab should now be present
    expect(screen.getByTestId("tab-following")).toBeInTheDocument();
  });

  it("does not render Following tab when user is not logged in", () => {
    // Ensure userLogged is false
    localStorage.setItem("userLogged", "false");

    renderContentFeed();

    // "Following" tab should not be present
    expect(screen.queryByTestId("tab-following")).not.toBeInTheDocument();
  });

  it("renders all sections correctly", () => {
    // Set userLogged to true
    localStorage.setItem("userLogged", "true");

    renderContentFeed();

    // Check tabs
    expect(screen.getByTestId("tab-popular-recipes")).toBeInTheDocument();
    expect(screen.getByTestId("tab-popular-blogs")).toBeInTheDocument();
    expect(screen.getByTestId("tab-following")).toBeInTheDocument();

    // Check tab panels (all should be in document, but only PopularRecipes visible by default)
    expect(screen.getByTestId("tabpanel-content-popular-recipes")).toBeVisible();
    expect(screen.getByTestId("tabpanel-content-popular-blogs")).toBeInTheDocument();
    expect(screen.getByTestId("tabpanel-content-following")).toBeInTheDocument();

    expect(screen.getByText("Mock PopularRecipesTab")).toBeVisible();
    expect(screen.queryByText("Mock PopularBlogsTab")).toBeInTheDocument();
    expect(screen.queryByText("Mock FollowingTab")).toBeInTheDocument();

    // Check RecommendedUsers and UpcomingEvents - update to use mock test IDs
    expect(screen.getByTestId("mock-recommended-users")).toBeInTheDocument();
    expect(screen.getByTestId("mock-recommended-users")).toBeVisible();
    expect(screen.getByTestId("mock-upcoming-events")).toBeInTheDocument();
    expect(screen.getByTestId("mock-upcoming-events")).toBeVisible();
  });
});

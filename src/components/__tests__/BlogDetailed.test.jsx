/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import axios from "axios";
import BlogDetailed from "../BlogDetailed";

// Mocking axios globally in this test file
vi.mock("axios");

describe("BlogDetailed Component", () => {
  // Utility to set localStorage
  const setLocalStorage = (key, value) => {
    window.localStorage.setItem(key, value);
  };

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("renders the loading spinner initially", () => {
    // No need to mock axios because we want to see the initial loading state
    renderWithRouter(<BlogDetailed blogId="123" />);

    // As soon as the component mounts, it should show the spinner
    expect(screen.getByTestId("blog-detailed-loading")).toBeInTheDocument();
  });

  it("renders error message if fetching blog data fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    renderWithRouter(<BlogDetailed blogId="123" />);

    // Wait for the error state
    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-error")).toBeInTheDocument()
    );

    expect(screen.getByText("Error: Network Error")).toBeInTheDocument();
  });

  it("renders 'No blog data available.' if blogData is null", async () => {
    // Suppose the API returns a successful response but with `null` data
    axios.get.mockResolvedValueOnce({ data: null });

    renderWithRouter(<BlogDetailed blogId="123" />);

    // We skip the loading spinner and wait for the final UI
    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-no-data")).toBeInTheDocument()
    );

    expect(screen.getByText("No blog data available.")).toBeInTheDocument();
  });

  it("renders the blog details correctly if data is loaded", async () => {
    const mockBlogData = {
      id: "123",
      userId: "user-abc",
      userName: "John Doe",
      createdAt: "2024-01-01T10:00:00Z", 
      bodyText: "Hello world!",
    };

    // This will be for `/api/v1/blogs/123`
    axios.get.mockResolvedValueOnce({ data: mockBlogData });

    renderWithRouter(<BlogDetailed blogId="123" />);

    // Wait for the loaded content
    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-container")).toBeInTheDocument()
    );

    // Check that the body text is displayed
    expect(screen.getByTestId("blog-body-text")).toHaveTextContent("Hello world!");

    // Check that author name is displayed
    expect(screen.getByTestId("blog-author-username")).toHaveTextContent("John Doe");
  });

  it("does not show banner if no banner is returned", async () => {
    const mockBlogData = {
      id: "123",
      userId: "user-abc",
      userName: "John Doe",
    };
    // 1) Blog data fetch
    axios.get.mockResolvedValueOnce({ data: mockBlogData });
    // 2) Banner fetch (the second call), suppose it fails or returns empty data
    axios.get.mockResolvedValueOnce({ data: null });

    renderWithRouter(<BlogDetailed blogId="123" />);

    // Wait for main container
    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-container")).toBeInTheDocument()
    );
    // Banner container should not exist
    expect(screen.queryByTestId("blog-banner-image")).not.toBeInTheDocument();
  });

  it("shows banner if the API returns banner data", async () => {
    const mockBlogData = {
      id: "123",
      userId: "user-abc",
      userName: "John Doe",
    };

    axios.get
      .mockResolvedValueOnce({ data: mockBlogData }) // for blog data
      .mockResolvedValueOnce({ data: new Blob(["fakeImageData"], { type: "image/png" }) }); // banner image

    renderWithRouter(<BlogDetailed blogId="123" />);

    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-container")).toBeInTheDocument()
    );

    // Banner container should exist
    expect(screen.getByTestId("blog-banner-container")).toBeInTheDocument();
    expect(screen.getByTestId("blog-banner-image")).toBeInTheDocument();
  });

  it("shows no error if banner returns 404", async () => {
    const mockBlogData = { id: "123", userId: "user-abc", userName: "John Doe" };

    axios.get
      .mockResolvedValueOnce({ data: mockBlogData }) // blog data
      .mockRejectedValueOnce({ response: { status: 404 } }); // banner not found

    renderWithRouter(<BlogDetailed blogId="123" />);

    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-container")).toBeInTheDocument()
    );

    // Should not show banner
    expect(screen.queryByTestId("blog-banner-image")).not.toBeInTheDocument();

    // Should not show error either
    expect(screen.queryByTestId("blog-banner-error")).not.toBeInTheDocument();
  });

  it("prompts user to log in if they click the Like button but are not logged in", async () => {
    // userLogged = false
    setLocalStorage("userLogged", "false");

    // blog data
    axios.get.mockResolvedValueOnce({
      data: { id: "123", userId: "user-abc", userName: "John Doe" },
    });

    renderWithRouter(<BlogDetailed blogId="123" />);

    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-container")).toBeInTheDocument()
    );

    // Spy on document.getElementById
    const mockClick = vi.fn();
    const fakeLoginButton = document.createElement("button");
    fakeLoginButton.id = "loginButton";
    fakeLoginButton.addEventListener("click", mockClick);
    document.body.appendChild(fakeLoginButton);

    // Click the like button
    fireEvent.click(screen.getByTestId("like-button"));

    // Expect it calls the login button's click
    expect(mockClick).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(fakeLoginButton);
  });

  it("toggles like if user is logged in", async () => {
    localStorage.setItem("userLogged", "true");
  
    axios.get
      // #1 blog data
      .mockResolvedValueOnce({
        data: { id: "123", userId: "user-abc", userName: "John Doe" },
      })
      // #2 banner
      .mockResolvedValueOnce({ data: null }) // or a Blob if you want
      // #3 isLiked
      .mockResolvedValueOnce({ data: { isLiked: false, likeCount: 5 } })
      // #4 isBookmarked
      .mockResolvedValueOnce({ data: { isBookmarked: false } });
  
    axios.post.mockResolvedValue({}); // for toggling like
  
    renderWithRouter(<BlogDetailed blogId="123" />);
  
    // Wait for container
    await waitFor(() =>
      expect(screen.getByTestId("blog-detailed-container")).toBeInTheDocument()
    );
  
    // Wait for isLiked to set count=5
    await waitFor(() =>
      expect(screen.getByTestId("like-count")).toHaveTextContent("5")
    );
  
    // Confirm border icon is there
    expect(screen.getByTestId("like-icon-border")).toBeInTheDocument();
  
    // Click to like
    fireEvent.click(screen.getByTestId("like-button"));
  
    // Now it becomes filled, count=6
    expect(screen.getByTestId("like-icon-filled")).toBeInTheDocument();
    expect(screen.getByTestId("like-count")).toHaveTextContent("6");
  });
  

  
  

  it("reverts the like count if toggle request fails", async () => {
    setLocalStorage("userLogged", "true");

    // 1) blog data
    axios.get.mockResolvedValueOnce({
      data: { id: "123", userId: "user-abc", userName: "John Doe" },
    });
    // 2) is-liked call
    axios.get.mockResolvedValueOnce({
      data: { isLiked: false, likeCount: 5 },
    });

    renderWithRouter(<BlogDetailed blogId="123" />);

    await waitFor(() => screen.getByTestId("blog-detailed-container"));

    // At start: 5, and border icon
    expect(screen.getByTestId("like-count")).toHaveTextContent("5");
    expect(screen.getByTestId("like-icon-border")).toBeInTheDocument();

    // Make the toggle call fail
    axios.post.mockRejectedValueOnce(new Error("Toggle failed"));

    // Click to like
    fireEvent.click(screen.getByTestId("like-button"));

    // Immediately shows filled icon and 6
    expect(screen.getByTestId("like-icon-filled")).toBeInTheDocument();
    expect(screen.getByTestId("like-count")).toHaveTextContent("6");

    // Because it failed, it should revert
    await waitFor(() =>
      expect(screen.getByTestId("like-icon-border")).toBeInTheDocument()
    );
    expect(screen.getByTestId("like-count")).toHaveTextContent("5");
  });

  it("toggles bookmark if user is logged in", async () => {
    setLocalStorage("userLogged", "true");

    // 1) blog data
    axios.get.mockResolvedValueOnce({
      data: { id: "555", userId: "user-abc", userName: "Jane Doe" },
    });
    // 2) isBookmarked call
    axios.get.mockResolvedValueOnce({
      data: { isBookmarked: false },
    });

    renderWithRouter(<BlogDetailed blogId="555" />);

    await waitFor(() => screen.getByTestId("blog-detailed-container"));

    expect(screen.getByTestId("bookmark-icon-border")).toBeInTheDocument();

    // Mock the bookmark toggle request
    axios.post.mockResolvedValueOnce({ data: {} });
    fireEvent.click(screen.getByTestId("bookmark-button"));

    // Immediately shows filled icon
    expect(screen.getByTestId("bookmark-icon-filled")).toBeInTheDocument();
  });

  it("prompts user to log in if they click the Bookmark button but are not logged in", async () => {
    setLocalStorage("userLogged", "false");

    axios.get.mockResolvedValueOnce({
      data: { id: "555", userId: "user-abc", userName: "Jane Doe" },
    });

    renderWithRouter(<BlogDetailed blogId="555" />);

    await waitFor(() => screen.getByTestId("blog-detailed-container"));

    // Spy on document.getElementById
    const mockClick = vi.fn();
    const fakeLoginButton = document.createElement("button");
    fakeLoginButton.id = "loginButton";
    fakeLoginButton.addEventListener("click", mockClick);
    document.body.appendChild(fakeLoginButton);

    // Click the bookmark button
    fireEvent.click(screen.getByTestId("bookmark-button"));
    expect(mockClick).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(fakeLoginButton);
  });
});

/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import UserBlogsTab from "../UserBlogsTab"; // adjust the path
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("axios");

describe("UserBlogsTab component", () => {
  let mockGet;

  // Helper function to render the component with a certain route, e.g. /profile?id=abc123
  const renderUserBlogsTab = (route = "/profile?id=abc123") => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/profile" element={<UserBlogsTab />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = axios.get;

    // Mock URL methods more thoroughly
    global.URL.createObjectURL = vi.fn(() => "mocked-url");
    global.URL.revokeObjectURL = vi.fn();

    mockGet.mockImplementation((url, { params }) => {
      return Promise.reject(new Error(`No mock for ${url}?pageNumber=${params?.pageNumber}`));
    });

    // Add ResizeObserver mock if needed
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Ensure scroll behavior is properly mocked
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1600, writable: true });
  });

  it("shows loading spinner initially", async () => {
    // Not resolving the request => spinner
    renderUserBlogsTab();

    // We see the container
    expect(screen.getByTestId("user-blogs-tab-container")).toBeInTheDocument();
    // The spinner or something from LoadingErrorDisplay => check if "loading" is visible
    // Possibly check "loading" logic in <LoadingErrorDisplay>
    // e.g. you might see a CircularProgress or text
  });

  it("shows error if fetching user blogs fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network Error"));

    renderUserBlogsTab("/profile?id=abc123");

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/Network Error/)).toBeInTheDocument();
    });

    // Verify blogs stack is empty
    const blogsStack = screen.getByTestId("blogs-stack");
    expect(blogsStack).toBeInTheDocument();
    expect(blogsStack.children.length).toBe(0);
  });

  it("renders blogs after successful fetch", async () => {
    // Suppose the user is "abc123", pageNumber=1
    mockGet.mockImplementation((url, { params }) => {
      if (url.includes("/api/v1/users/abc123/blogs") && params.pageNumber === 1) {
        return Promise.resolve({
          status: 200,
          data: {
            items: [
              { id: "blog1", title: "First blog" },
              { id: "blog2", title: "Second blog" },
            ],
            totalCount: 2,
          },
        });
      }
      return Promise.reject(new Error("Unhandled"));
    });

    renderUserBlogsTab("/profile?id=abc123");

    // Wait for the blogs to appear
    await waitFor(() => {
      // We see no loading spinner or error
      expect(screen.queryByText("Network Error")).not.toBeInTheDocument();
      // Check the blogs
      expect(screen.getByTestId("blog-mini-blog1")).toBeInTheDocument();
      expect(screen.getByTestId("blog-mini-blog2")).toBeInTheDocument();
    });
  });

  it("handles empty blog scenario", async () => {
    mockGet.mockImplementation((url, { params }) => {
      if (url.includes("/api/v1/users/abc123/blogs") && params.pageNumber === 1) {
        return Promise.resolve({
          status: 200,
          data: {
            items: [],
            totalCount: 0,
          },
        });
      }
      return Promise.reject(new Error("Unhandled"));
    });

    renderUserBlogsTab("/profile?id=abc123");

    // Wait for the blogs stack to appear and be empty
    await waitFor(() => {
      const blogsStack = screen.getByTestId("blogs-stack");
      expect(blogsStack).toBeInTheDocument();
      expect(blogsStack.children.length).toBe(0);
    });
  });

  /* nuh uh, you cant mock scrolling
     not that i know of anyway..
  it("loads more blogs on scroll", async () => {
    const mockBlog = (id) => ({
      id,
      title: `Blog ${id}`,
      bodyText: `Content for blog ${id}`,
      userId: "user123",
      userName: "TestUser",
      createdAt: "2024-01-01T10:00:00Z",
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isBookmarked: false
    });

    // Create 12 blogs (more than pageSize of 10) to test pagination
    const firstPageBlogs = Array.from({ length: 10 }, (_, i) => mockBlog(`blog${i + 1}`));
    const secondPageBlogs = Array.from({ length: 2 }, (_, i) => mockBlog(`blog${i + 11}`));

    mockGet.mockImplementation((url, config = {}) => {
      const params = config.params || {};

      if (url.includes("/api/v1/users/abc123/blogs")) {
        if (params.pageNumber === 1) {
          return Promise.resolve({
            status: 200,
            data: {
              items: firstPageBlogs,
              totalCount: 12, // Total of 12 blogs
            },
          });
        }
        if (params.pageNumber === 2) {
          return Promise.resolve({
            status: 200,
            data: {
              items: secondPageBlogs,
              totalCount: 12,
            },
          });
        }
      }

      // Return empty Blob for all image requests
      if (url.includes("/profile-picture") || url.includes("/banner")) {
        return Promise.resolve({ 
          status: 200, 
          data: new Blob([''], { type: 'image/jpeg' }) 
        });
      }

      // Return defaults for other API calls
      if (url.includes("/like-count")) return Promise.resolve({ data: { likeCount: 0 } });
      if (url.includes("/comments")) return Promise.resolve({ data: { totalCount: 0 } });
      if (url.includes("/is-liked")) return Promise.resolve({ data: { isLiked: false } });
      if (url.includes("/is-bookmarked")) return Promise.resolve({ data: { isBookmarked: false } });

      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });
  
    renderUserBlogsTab("/profile?id=abc123");
  
    // Wait for the first page of blogs (10 blogs)
    await waitFor(() => {
      expect(screen.getByTestId("blog-mini-blog1")).toBeInTheDocument();
      expect(screen.getByTestId("blog-mini-blog10")).toBeInTheDocument();
    });

    // Simulate scroll near bottom
    window.scrollY = 1700;  // Update scrollY
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 2000 });
    Object.defineProperty(window, "innerHeight", { value: 300 });
    
    // Fire scroll event
    fireEvent.scroll(window);

    // Wait for blogs from second page
    await waitFor(() => {
      expect(screen.getByTestId("blog-mini-blog11")).toBeInTheDocument();
      expect(screen.getByTestId("blog-mini-blog12")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
  */
  
});


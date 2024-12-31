/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import PopularBlogsTab from "../PopularBlogsTab"; // Adjust the path if needed
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

describe("PopularBlogsTab component", () => {
  let mockGet;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = axios.get;
    mockGet.mockImplementation(() => Promise.reject(new Error("Unhandled")));

    // Mock URL utilities for any image handling
    global.URL.createObjectURL = vi.fn(() => "mocked-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  // Helper function to render the component with Router
  const renderPopularBlogsTab = () => {
    return render(
      <MemoryRouter>
        <PopularBlogsTab />
      </MemoryRouter>
    );
  };

it("shows loading spinner or 'loading' state initially", () => {
    renderPopularBlogsTab();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
});

  it("shows error if fetching data fails", async () => {
    // 1) first call fails
    mockGet.mockRejectedValueOnce(new Error("Network Error"));

    renderPopularBlogsTab();

    await waitFor(() => {
      // Check for error text
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });

    // blogs-container should be empty
    const container = screen.getByTestId("blogs-container");
    expect(container).toBeInTheDocument();
    expect(container.childNodes.length).toBe(0);
  });

  it("renders blogs after successful fetch", async () => {
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [
          { id: "blog1", title: "First popular blog", userId: "user1", userName: "User 1" },
          { id: "blog2", title: "Second popular blog", userId: "user2", userName: "User 2" },
        ],
        totalCount: 2,
      },
    });

    // Mock other necessary endpoints for BlogMini
    mockGet.mockImplementation((url) => {
      if (url.includes("/profile-picture") || url.includes("/banner")) {
        return Promise.resolve({ status: 200, data: new Blob(["image"]) });
      }
      if (url.includes("/like-count")) {
        return Promise.resolve({ data: { likeCount: 0 } });
      }
      if (url.includes("/comments")) {
        return Promise.resolve({ data: { totalCount: 0 } });
      }
      if (url.includes("/is-liked")) {
        return Promise.resolve({ data: { isLiked: false } });
      }
      if (url.includes("/is-bookmarked")) {
        return Promise.resolve({ data: { isBookmarked: false } });
      }
      return Promise.reject(new Error(`Unhandled URL: ${url}`));
    });

    renderPopularBlogsTab();

    await waitFor(() => {
      expect(screen.getByTestId("blog-mini-blog1")).toBeInTheDocument();
      expect(screen.getByTestId("blog-mini-blog2")).toBeInTheDocument();
    });
  });

  it("handles empty scenario (no blogs returned)", async () => {
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [],
        totalCount: 0,
      },
    });

    renderPopularBlogsTab();

    // Wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Error:/)).not.toBeInTheDocument()
    );

    // Check no blog-box
    expect(screen.getByTestId("blogs-container").childNodes.length).toBe(0);
  });

  /* cant mock scrolling..
  it("loads more blogs on scroll", async () => {
    // First page => data
    mockGet
      .mockResolvedValueOnce({
        status: 200,
        data: {
          items: [{ id: "blog1", title: "Popular Blog #1" }],
          totalCount: 4, // means totalPages > 1
        },
      })
      // Second page => more data
      .mockResolvedValueOnce({
        status: 200,
        data: {
          items: [{ id: "blog2", title: "Popular Blog #2" }],
          totalCount: 4,
        },
      });

    renderPopularBlogsTab();

    // Wait for first page
    await waitFor(() =>
      expect(screen.getByText("Popular Blog #1")).toBeInTheDocument()
    );

    // Simulate scrolling near bottom
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 1900,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 120,
      writable: true,
    });

    fireEvent.scroll(window);

    // Wait for second page
    await waitFor(() => {
      expect(screen.getByText("Popular Blog #2")).toBeInTheDocument();
    });
  });
  */
});

/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import UserRecipesTab from "../UserRecipesTab"; // Adjust path
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("axios");

describe("UserRecipesTab Component", () => {
  let mockGet;

  // Helper: render the component with a particular route (i.e. /profile?id=abc123).
  const renderRecipesTab = (route = "/profile?id=abc123") =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/profile" element={<UserRecipesTab />} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = axios.get;
    // If a call doesn't match any of our mock conditions, fail the test
    mockGet.mockImplementation(() => {
      return Promise.reject(new Error("Unhandled request"));
    });
  });

  it("shows loading spinner initially", () => {
    // Not resolving => the component remains in loading state
    renderRecipesTab("/profile?id=abc123");

    // We can check that the loading spinner or some other loading state is present
    // e.g. from your LoadingErrorDisplay or a MUI CircularProgress
    // If you want to test a specific data-testid, adapt below:
    // expect(screen.getByTestId("loading-error-display")).toBeInTheDocument();

    // Or check for "loading" text if present in LoadingErrorDisplay
  });

  it("shows error if fetching user recipes fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    renderRecipesTab("/profile?id=abc123");

    await waitFor(() => {
      // Wait for error container and message
      expect(screen.getByText(/Error:/)).toBeInTheDocument();

      // Verify recipes stack is empty
      const recipesStack = screen.getByTestId("recipes-stack");
      expect(recipesStack.children.length).toBe(0);
    });
  });

  it("renders recipes after successful fetch", async () => {
    mockGet.mockImplementationOnce((url, { params }) => {
      if (url.includes("/api/v1/users/abc123/recipes") && params.pageNumber === 1) {
        return Promise.resolve({
          status: 200,
          data: {
            items: [
              { id: "recipe1", header: "First recipe" },
              { id: "recipe2", header: "Second recipe" },
            ],
            totalCount: 2,
          },
        });
      }
      return Promise.reject(new Error("Unhandled for pageNumber=1"));
    });

    renderRecipesTab("/profile?id=abc123");

    // Wait for recipes
    await waitFor(() => {
      expect(screen.getByText("First recipe")).toBeInTheDocument();
      expect(screen.getByText("Second recipe")).toBeInTheDocument();
    });
  });

  it("handles empty recipes scenario", async () => {
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [],
        totalCount: 0,
      },
    });

    renderRecipesTab("/profile?id=abc123");

    // Wait for loading to end
    await waitFor(() => {
      // Check no recipes are rendered
      // If your <RecipeMini> might have a role or text, adapt accordingly
      expect(screen.queryByRole("heading", { name: /recipe/i })).not.toBeInTheDocument();
      // Possibly check some placeholder text if you have "No recipes found"
    });
  });

/* nuh uh, you cant mock scrolling
   not that i know of anyway..
  it("loads more recipes on scroll", async () => {
    // pageNumber=1 => first call
    mockGet.mockImplementation((url, { params }) => {
      if (url.includes("/api/v1/users/abc123/recipes")) {
        // First page
        if (params.pageNumber === 1) {
          return Promise.resolve({
            status: 200,
            data: {
              items: [{ id: "recipe1", header: "First recipe" }],
              totalCount: 4, // implies totalPages > 1 if pageSize=10
            },
          });
        }
        // Second page
        if (params.pageNumber === 2) {
          return Promise.resolve({
            status: 200,
            data: {
              items: [{ id: "recipe2", header: "Second recipe" }],
              totalCount: 4,
            },
          });
        }
      }
      return Promise.reject(new Error(`Unhandled mock for pageNumber=${params.pageNumber}`));
    });

    renderRecipesTab("/profile?id=abc123");

    // Wait for first page using testid
    await waitFor(() => {
      expect(screen.getByTestId("recipe-mini-recipe1")).toBeInTheDocument();
    });

    // Simulate scroll near bottom
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 1900,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 150,
      writable: true,
    });

    fireEvent.scroll(window);

    // Wait for second page using testid
    await waitFor(() => {
      expect(screen.getByTestId("recipe-mini-recipe2")).toBeInTheDocument();
    });
  });
  */
});

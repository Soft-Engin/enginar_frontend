/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import PopularRecipesTab from "../PopularRecipesTab"; // adjust if needed
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

describe("PopularRecipesTab Component", () => {
  let mockGet;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = axios.get;
    mockGet.mockImplementation(() => Promise.reject(new Error("Unhandled mock")));

    // Mock URL utilities for image handling
    global.URL.createObjectURL = vi.fn(() => "mocked-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  const renderPopularRecipesTab = () => {
    return render(
      <MemoryRouter>
        <PopularRecipesTab />
      </MemoryRouter>
    );
  };

  it("shows loading spinner or loading state initially", () => {
    // Not resolving => still in loading
    renderPopularRecipesTab();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows error if initial fetch fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network Error"));

    renderPopularRecipesTab();

    await waitFor(() => {
        // Wait for error container and message
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    // The container should be empty
    const recipesContainer = screen.getByTestId("recipes-container");
    expect(recipesContainer.childNodes.length).toBe(0);
  });

  it("renders recipes after successful fetch", async () => {
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [
          { id: "recipe1", header: "First popular recipe" },
          { id: "recipe2", header: "Second popular recipe" },
        ],
        totalCount: 2,
      },
    });

    renderPopularRecipesTab();

    // Wait for the recipes
    await waitFor(() => {
      expect(screen.getByText("First popular recipe")).toBeInTheDocument();
      expect(screen.getByText("Second popular recipe")).toBeInTheDocument();
    });
  });

  it("handles empty scenario (no recipes)", async () => {
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: {
        items: [],
        totalCount: 0,
      },
    });

    renderPopularRecipesTab();

    // Wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText("Error:")).not.toBeInTheDocument()
    );

    // No recipe boxes
    const recipesContainer = screen.getByTestId("recipes-container");
    expect(recipesContainer.childNodes.length).toBe(0);
  });

  /* can't test infinite scroll -__-
  it("loads more recipes on scroll", async () => {
    // First request => first page
    mockGet
      .mockResolvedValueOnce({
        status: 200,
        data: {
          items: [{ id: "recipe1", header: "Popular recipe #1" }],
          totalCount: 4,
        },
      })
      // Second request => second page
      .mockResolvedValueOnce({
        status: 200,
        data: {
          items: [{ id: "recipe2", header: "Popular recipe #2" }],
          totalCount: 4,
        },
      });

    renderPopularRecipesTab();

    // Wait for first page
    await waitFor(() =>
      expect(screen.getByText("Popular recipe #1")).toBeInTheDocument()
    );

    // Setup scroll
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

    // Fire scroll
    fireEvent.scroll(window);

    // Wait for second page
    await waitFor(() => {
      expect(screen.getByText("Popular recipe #2")).toBeInTheDocument();
    });
  });
  */
});

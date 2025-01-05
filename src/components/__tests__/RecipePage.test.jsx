/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import RecipePage from "../RecipePage"; // Adjust path if needed

// --- Mock Child Components ---
vi.mock("../RecipeDetailed", () => {
  return {
    __esModule: true,
    default: (props) => (
      <div data-testid="mock-recipe-detailed">
        RecipeDetailed Mock - recipeId={props.recipeId}
      </div>
    ),
  };
});

vi.mock("../CommentSection", () => {
  return {
    __esModule: true,
    default: (props) => (
      <div data-testid="mock-comment-section">
        CommentSection Mock - type={props.type}, contentId={props.contentId}
      </div>
    ),
  };
});

vi.mock("../RecommendedUsers", () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="mock-recommended-users">RecommendedUsers Mock</div>
    ),
  };
});

vi.mock("../UpcomingEvents", () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid="mock-upcoming-events">UpcomingEvents Mock</div>
    ),
  };
});

describe("RecipePage Component", () => {
  const renderRecipePage = (route = "/recipe?id=abc123") => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/recipe" element={<RecipePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders without crashing", () => {
    // Pass full path including /recipe
    renderRecipePage("/recipe?id=123");
    expect(screen.getByTestId("recipe-page")).toBeInTheDocument();
  });

  it("renders the child components with the correct ID from search params", () => {
    const { getByTestId } = renderRecipePage("/recipe?id=xyz789");

    // The main container
    expect(getByTestId("recipe-page")).toBeInTheDocument();

    // The mocked RecipeDetailed
    expect(getByTestId("mock-recipe-detailed")).toBeInTheDocument();
    expect(
      screen.getByText(/RecipeDetailed Mock - recipeId=xyz789/i)
    ).toBeInTheDocument();

    // The mocked CommentSection
    expect(getByTestId("mock-comment-section")).toBeInTheDocument();
    expect(
      screen.getByText("CommentSection Mock - type=recipe, contentId=xyz789")
    ).toBeInTheDocument();

    // The mocked RecommendedUsers
    expect(getByTestId("mock-recommended-users")).toBeInTheDocument();

    // The mocked UpcomingEvents
    expect(getByTestId("mock-upcoming-events")).toBeInTheDocument();
  });

  it("uses default ID if none is provided", () => {
    renderRecipePage("/recipe");

    // The child is still rendered
    expect(screen.getByTestId("mock-recipe-detailed")).toBeInTheDocument();
    // Without query param, recipeId will be empty string
    expect(screen.getByText("RecipeDetailed Mock - recipeId=")).toBeInTheDocument();
    expect(screen.getByText("CommentSection Mock - type=recipe, contentId=")).toBeInTheDocument();
  });
});

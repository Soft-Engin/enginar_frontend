/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecipeCompressed from "../RecipeCompressed"; // Adjust path as needed

describe("RecipeCompressed Component", () => {
  beforeEach(() => {
    // Clear DOM or mocks if necessary
  });

  it("renders properly with the correct title, description, and avatar", () => {
    render(<RecipeCompressed />);

    // Check main container
    const recipeContainer = screen.getByTestId("recipe-compressed");
    expect(recipeContainer).toBeInTheDocument();

    // Check title
    expect(screen.getByTestId("recipe-title")).toHaveTextContent("Enginar Yemeği Tarifim");

    // Check description
    expect(screen.getByTestId("recipe-description")).toHaveTextContent("Lorem ipsum dolor sit amet");

    // Check avatar
    const avatar = screen.getByTestId("recipe-avatar");
    expect(avatar).toHaveAttribute("src", "/pp3.jpeg");

    // Check media
    const media = screen.getByTestId("recipe-media");
    expect(media).toHaveAttribute("src", "https://via.placeholder.com/400x200");
    expect(media).toHaveAttribute("alt", "Enginar Yemeği");
  });

  it("toggles like icon and like count when the like button is clicked", () => {
    render(<RecipeCompressed />);

    // Initial: not liked => 39k
    expect(screen.getByTestId("likes-count")).toHaveTextContent("39k");
    // The icon should be the border version
    expect(screen.queryByTestId("not-liked-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("liked-icon")).not.toBeInTheDocument();

    // Click the like button
    fireEvent.click(screen.getByTestId("like-button"));

    // Now: liked => 40k
    expect(screen.getByTestId("likes-count")).toHaveTextContent("40k");
    expect(screen.queryByTestId("liked-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("not-liked-icon")).not.toBeInTheDocument();
  });

  it("toggles bookmark icon when the bookmark button is clicked", () => {
    render(<RecipeCompressed />);

    // Initially not bookmarked
    expect(screen.queryByTestId("bookmarked-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("not-bookmarked-icon")).toBeInTheDocument();

    // Click to bookmark
    fireEvent.click(screen.getByTestId("bookmark-button"));

    // Now it should show the bookmarked icon
    expect(screen.getByTestId("bookmarked-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("not-bookmarked-icon")).not.toBeInTheDocument();
  });

  it("displays comment and share icons", () => {
    render(<RecipeCompressed />);

    // Comment icon
    expect(screen.getByTestId("comment-button")).toBeInTheDocument();

    // Share icon
    expect(screen.getByTestId("share-button")).toBeInTheDocument();
  });
});

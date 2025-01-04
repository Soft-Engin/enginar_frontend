/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecipeMini from "../RecipeMini"; // Adjust path as needed
import { MemoryRouter, useNavigate } from "react-router-dom";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("RecipeMini Component", () => {
  let mockNavigate;
  let mockGet;
  let mockPost;

  const sampleRecipe = {
    id: "recipe-123",
    userId: "user-456",
    userName: "TestChef",
    createdAt: "2024-01-01T10:00:00Z",
    header: "Sample Recipe",
    bodyText: "This is a sample recipe text.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    // Re-init mocks
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate); // Remove TypeScript cast

    mockGet = axios.get;
    mockPost = axios.post;
    mockGet.mockImplementation(() => Promise.resolve({ data: {} }));
    mockPost.mockImplementation(() => Promise.resolve({ data: {} }));
  });

  const renderRecipeMini = (recipe) => {
    return render(
      <MemoryRouter>
        <RecipeMini recipe={recipe} />
      </MemoryRouter>
    );
  };

  it("renders the recipe data", () => {
    renderRecipeMini(sampleRecipe);

    // The main container
    expect(screen.getByTestId(`recipe-mini-${sampleRecipe.id}`)).toBeInTheDocument();

    // Basic text
    expect(screen.getByTestId("recipe-username")).toHaveTextContent("TestChef");
    expect(screen.getByTestId(`recipe-header-${sampleRecipe.id}`)).toHaveTextContent("Sample Recipe");
    expect(screen.getByTestId("recipe-bodyText")).toHaveTextContent("This is a sample recipe text.");
  });

  it("navigates to /recipe?id=... when main clickable area is clicked", () => {
    renderRecipeMini(sampleRecipe);

    const clickableArea = screen.getByTestId("recipe-mini-clickable");
    fireEvent.click(clickableArea);
    // Expects we call navigate("/recipe?id=recipe-123")
    expect(mockNavigate).toHaveBeenCalledWith("/recipe?id=recipe-123");
  });

  it("toggles like if user is logged in", async () => {
    // userLogged = true
    window.localStorage.setItem("userLogged", "true");

    renderRecipeMini(sampleRecipe);

    // Initially: not liked => likeCount=0
    // The code sets it to 0 if we haven't fetched from axios
    expect(screen.getByTestId("like-count")).toHaveTextContent("0");
    expect(screen.queryByTestId("like-icon-filled")).not.toBeInTheDocument();
    expect(screen.getByTestId("like-icon-border")).toBeInTheDocument();

    // Click like
    fireEvent.click(screen.getByTestId("like-button"));

    // Immediately changes UI => 1
    expect(screen.getByTestId("like-count")).toHaveTextContent("1");
    expect(screen.queryByTestId("like-icon-filled")).toBeInTheDocument();
    expect(screen.queryByTestId("like-icon-border")).not.toBeInTheDocument();
  });

  it("prompts user to log in if user is not logged in and tries to like", async () => {
    window.localStorage.setItem("userLogged", "false");

    renderRecipeMini(sampleRecipe);

    // Attach mock login button
    const mockClick = vi.fn();
    const loginButton = document.createElement("button");
    loginButton.id = "loginButton";
    loginButton.addEventListener("click", mockClick);
    document.body.appendChild(loginButton);

    // Click like
    fireEvent.click(screen.getByTestId("like-button"));
    expect(mockClick).toHaveBeenCalledTimes(1);

    document.body.removeChild(loginButton);
  });

  it("toggles bookmark if user is logged in", async () => {
    window.localStorage.setItem("userLogged", "true");

    renderRecipeMini(sampleRecipe);

    // not bookmarked => see the border version
    expect(screen.queryByTestId("bookmark-icon-filled")).not.toBeInTheDocument();
    expect(screen.getByTestId("bookmark-icon-border")).toBeInTheDocument();

    // Click bookmark
    fireEvent.click(screen.getByTestId("bookmark-button"));

    // Now it should show the filled version
    expect(screen.getByTestId("bookmark-icon-filled")).toBeInTheDocument();
    expect(screen.queryByTestId("bookmark-icon-border")).not.toBeInTheDocument();
  });

  it("prompts user to log in if user is not logged in and tries to bookmark", async () => {
    window.localStorage.setItem("userLogged", "false");

    renderRecipeMini(sampleRecipe);

    // Attach mock login button
    const mockClick = vi.fn();
    const loginButton = document.createElement("button");
    loginButton.id = "loginButton";
    loginButton.addEventListener("click", mockClick);
    document.body.appendChild(loginButton);

    // Click bookmark
    fireEvent.click(screen.getByTestId("bookmark-button"));
    expect(mockClick).toHaveBeenCalledTimes(1);

    document.body.removeChild(loginButton);
  });
});

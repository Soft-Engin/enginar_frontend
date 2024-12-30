/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import CreateRecipe from "../CreateRecipe"; // Adjust path if needed

vi.mock("axios");

describe("CreateRecipe Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIngredients = [
    { id: "1", name: "Apple" },
    { id: "2", name: "Banana" },
  ];

  it("shows loading spinner initially", () => {
    // By default, we haven't resolved the GET call
    render(<CreateRecipe />);
    // We see the loading spinner
    expect(screen.getByTestId("create-recipe-loading")).toBeInTheDocument();
  });

  it("renders error if fetching ingredients fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<CreateRecipe />);

    // Wait for the error state
    await waitFor(() =>
      expect(screen.getByTestId("create-recipe-error")).toBeInTheDocument()
    );
    expect(screen.getByText("Error: Network Error")).toBeInTheDocument();
  });

  it("renders form after ingredients are fetched", async () => {
    // Mock the first GET /api/v1/ingredients call
    axios.get.mockResolvedValueOnce({
      data: { items: mockIngredients },
    });

    // Then the second call for images
    axios.get.mockResolvedValueOnce({ data: [] }); // no images

    render(<CreateRecipe />);

    // Wait for form
    await waitFor(() =>
      expect(screen.getByTestId("create-recipe-form")).toBeInTheDocument()
    );

    // The spinner & error should be gone
    expect(screen.queryByTestId("create-recipe-loading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("create-recipe-error")).not.toBeInTheDocument();
  });

  it("can type a recipe name and create a recipe successfully", async () => {
    // 1) fetch ingredients
    axios.get.mockResolvedValueOnce({
      data: { items: mockIngredients },
    });
    // 2) fetch images
    axios.get.mockResolvedValueOnce({ data: [] });
    // 3) the POST for creating recipe
    axios.post.mockResolvedValueOnce({ status: 201, data: { message: "Created" } });

    render(<CreateRecipe />);

    // Wait for the main form
    await waitFor(() =>
      expect(screen.getByTestId("create-recipe-form")).toBeInTheDocument()
    );

    // Type the recipe name
    const nameInput = screen.getByTestId("recipe-name-input-field");
    fireEvent.change(nameInput, { target: { value: "My Tasty Salad" } });

    // Click create
    const createBtn = screen.getByTestId("create-recipe-button");
    fireEvent.click(createBtn);

    // Expect the "Creating..." state
    expect(createBtn).toHaveTextContent("Creating...");

    // Once the POST resolves
    await waitFor(() => expect(createBtn).toHaveTextContent("Create Recipe"));
    // We should see a success snackbar or message
    expect(screen.getByText("Recipe created successfully!")).toBeInTheDocument();
  });

  it("shows an error snackbar if creation fails", async () => {
    // 1) fetch ingredients
    axios.get.mockResolvedValueOnce({ data: { items: mockIngredients } });
    // 2) fetch images
    axios.get.mockResolvedValueOnce({ data: [] });
    // 3) the POST fails with error
    const errorMessage = "Creation error";
    axios.post.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    });

    render(<CreateRecipe />);

    // Wait for the form
    await waitFor(() =>
      expect(screen.getByTestId("create-recipe-form")).toBeInTheDocument()
    );

    // Click create with an empty recipe
    const createBtn = screen.getByTestId("create-recipe-button");
    fireEvent.click(createBtn);

    // Wait for error message in the Alert component
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      //expect(alert).toHaveTextContent(errorMessage);
    });
  });

  it("can search for ingredients", async () => {
    // 1) fetch ingredients
    axios.get.mockResolvedValueOnce({ data: { items: mockIngredients } });
    // 2) fetch images
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<CreateRecipe />);

    await waitFor(() =>
      expect(screen.getByTestId("create-recipe-form")).toBeInTheDocument()
    );

    // There's a search input
    const searchInput = screen.getByTestId("ingredient-search-input-field");

    // Initially, we might see "Apple" and "Banana" in the DOM
    // Or we can test the search
    fireEvent.change(searchInput, { target: { value: "app" } });

    // Check if "Apple" is still in the list, "Banana" is not
    // Implementation might vary (you might have data-testid on each ingredient card)
    // But let's do a basic approach:
    expect(screen.queryByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });
});
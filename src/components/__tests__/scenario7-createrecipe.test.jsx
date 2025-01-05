import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import CreateRecipe from "../CreateRecipe";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8090";

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("User Journey - Creating a Recipe", () => {
  beforeEach(() => {
    const container = document.createElement("div");
    container.style.height = "800px";
    container.style.overflow = "auto";
    document.body.appendChild(container);
    // Set a default token
    localStorage.setItem("token", "testToken");

    // Set Authorization header for axios
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "token"
    )
      ? `Bearer ${localStorage.getItem("token")}`
      : "";

    render(
      <Router>
        <CreateRecipe />
      </Router>,
      { container }
    );
    // clear mocks
    vi.clearAllMocks();
  });

  test("should navigate away after successful recipe creation for a logged-in user", async () => {
    const navigate = useNavigate();

    // Mock the axios.post to return a resolved promise
    vi.spyOn(axios, "post").mockResolvedValueOnce({ status: 201 });

    // Wait for the create recipe form to be in the document
    await waitFor(() => {
      expect(screen.getByTestId("create-recipe-form")).toBeInTheDocument();
    });

    // Fill in the recipe form
    fireEvent.change(screen.getByTestId("recipe-name-input-field"), {
      target: { value: "My New Recipe" },
    });
    fireEvent.change(screen.getByTestId("description-input"), {
      target: { value: "This is the description of my new recipe." },
    });

    // Simulate typing into the ingredient search
    fireEvent.change(screen.getByTestId("ingredient-search-input-field"), {
      target: { value: "pine" },
    });

    // Wait a short time for the ingredients to load
    await waitFor(
      () => {
        expect(screen.getByText("Pineapples")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Add an ingredient
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    const unitInput = screen.getByPlaceholderText("Unit");
    fireEvent.change(unitInput, { target: { value: "grams" } });

    // Update a step
    fireEvent.change(screen.getByLabelText("Step 1"), {
      target: { value: "Instructions for my new recipe." },
    });

    // Click the submit button
    fireEvent.click(screen.getByTestId("create-recipe-button"));

    // Wait for the navigation to occur, with a timeout to be more robust.
    await waitFor(
      () => {
        expect(navigate).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );

    // Check that navigate is called with the correct path
    expect(navigate).toHaveBeenCalledWith("/recipes");
  });
});

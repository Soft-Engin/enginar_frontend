import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
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

describe("User Journey - Creating an Event", () => {
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location;
    window.location = {
      ...originalLocation,
      reload: () => {},
    };

    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(
      <Router>
        <Navbar />
      </Router>,
      { container }
    );
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test("should allow user to create an event", async () => {
    const navigate = useNavigate();

    // Mock the axios.post to return a resolved promise
    vi.spyOn(axios, "post").mockResolvedValueOnce({ status: 201 });

    setTimeout(async () => {
      // Wait for the speed dial button to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('speed-dial-event')).toBeInTheDocument();
      });

      // Click the speed dial button to open the create event form
      fireEvent.click(screen.getByTestId('speed-dial-event'));

      // Wait for the create event form to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('create-event-form')).toBeInTheDocument();
      });

      // Fill in the event form
      fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'My New Event' } });
      fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'This is the description of my new event.' } });
      fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2025-10-10' } });

      // Click the submit button
      fireEvent.click(screen.getByTestId('submit-event-button'));

      // Wait for the success message to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });

      // Verify the success message content
      expect(screen.getByTestId('success-message')).toHaveTextContent('Event created successfully');

      // Check that navigate is called with the correct path
      expect(navigate).toHaveBeenCalledWith("/events");
    }, 1000); // Adjust the timeout duration as needed
  });
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
        <Navbar />
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

    setTimeout(async () => {
      // Wait for the speed dial button to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('speed-dial-recipe')).toBeInTheDocument();
      });

      // Click the speed dial button to open the create recipe form
      fireEvent.click(screen.getByTestId('speed-dial-recipe'));

      // Wait for the create recipe form to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('create-recipe-form')).toBeInTheDocument();
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
    }, 1000); // Adjust the timeout duration as needed
  });
});

describe("User Journey - Creating a Blog Post", () => {
  beforeEach(() => {
    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(
      <Router>
        <Navbar />
      </Router>,
      { container }
    );
  });

  test("should allow user to create a blog post", async () => {
    const navigate = useNavigate();

    // Mock the axios.post to return a resolved promise
    vi.spyOn(axios, "post").mockResolvedValueOnce({ status: 201 });

    setTimeout(async () => {
      // Wait for the speed dial button to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('speed-dial-blog')).toBeInTheDocument();
      });

      // Click the speed dial button to open the create blog form
      fireEvent.click(screen.getByTestId('speed-dial-blog'));

      // Wait for the create blog form to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('create-blog-form')).toBeInTheDocument();
      });

      // Fill in the blog form
      fireEvent.change(screen.getByTestId('content-input'), { target: { value: 'This is the content of my new blog post.' } });

      // Click the submit button
      fireEvent.click(screen.getByTestId('submit-blog-button'));

      // Wait for the success message to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('success-message')).toBeInTheDocument();
      });

      // Verify the success message content
      expect(screen.getByTestId('success-message')).toHaveTextContent('Blog post created successfully');

      // Check that navigate is called with the correct path
      expect(navigate).toHaveBeenCalledWith("/blogs");
    }, 1000); // Adjust the timeout duration as needed
  });
});

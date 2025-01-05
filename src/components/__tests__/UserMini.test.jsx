/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import UserMini from "../UserMini"; // Adjust the path

vi.mock("axios");

describe("UserMini Component", () => {
  const mockUser = {
    userId: "123",
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    // Add any other required user properties
  };

  // Helper function to render with Router context
  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/followers')) {
        return Promise.resolve({ 
          status: 200, 
          data: { totalCount: 5 } 
        });
      }
      if (url.includes('/following')) {
        return Promise.resolve({ 
          status: 200, 
          data: { 
            items: [],
            totalCount: 3 
          } 
        });
      }
      if (url.includes('/profile-picture') || url.includes('/banner')) {
        return Promise.resolve({
          status: 200,
          data: new Blob([''], { type: 'image/jpeg' })
        });
      }
      return Promise.reject(new Error('Unhandled URL in test'));
    });
  });

  it("renders user info correctly", async () => {
    renderWithRouter(<UserMini user={mockUser} />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Now check all elements by testId
    expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("following-count")).toHaveTextContent("3 Following");
    expect(screen.getByTestId("followers-count")).toHaveTextContent("5 Followers");
    // Follow button is not visible for non-logged in users
    expect(screen.queryByTestId("follow-button")).not.toBeInTheDocument();
  });

  it("opens the menu when menu icon is clicked", async () => {
    // Set user as admin
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({
      userId: "admin123",
      roleName: "Admin"
    }));
    
    renderWithRouter(<UserMini user={mockUser} />);

    // Wait for user info to load
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    });

    // The menu button should be visible for admin
    const menuButton = screen.getByTestId("more-button");
    expect(menuButton).toBeInTheDocument();

    // Click to open menu
    fireEvent.click(menuButton);

    // Now we expect the 'Ban' MenuItem to be visible
    await waitFor(() =>
      expect(screen.getByText("Ban")).toBeInTheDocument()
    );
  });

  it("closes the menu when 'Ban' is clicked", async () => {
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({
      userId: "admin123",
      roleName: "Admin"
    }));
    
    renderWithRouter(<UserMini user={mockUser} />);

    // Wait for user info to load
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    });

    // Open menu
    fireEvent.click(screen.getByTestId("more-button"));

    // Click ban using data-testid
    await screen.findByTestId("ban-menu-item");
    fireEvent.click(screen.getByTestId("ban-menu-item"));

    // Wait for dialog to appear and menu to close
    await waitFor(() => {
      // Menu should be closed
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      // Dialog should be open
      expect(screen.getByTestId("confirm-ban-button")).toBeInTheDocument();
    });

    // Clean up
    fireEvent.click(screen.getByTestId("cancel-ban-button"));
  });

  it("closes the menu when 'Ban' is clicked and Cancel is pressed", async () => {
    // Set user as admin
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({
      userId: "admin123",
      roleName: "Admin"
    }));
    
    renderWithRouter(<UserMini user={mockUser} />);

    // Wait for user info to load
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    });

    // Open menu
    const menuButton = screen.getByTestId("more-button");
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);

    // Wait for and click 'Ban'
    const banItem = await screen.findByText("Ban");
    fireEvent.click(banItem);

    // Wait for dialog to open and click Cancel
    const cancelButton = await screen.findByText("Cancel");
    fireEvent.click(cancelButton);

    // Both dialog and menu should close
    await waitFor(() => {
      expect(screen.queryByText("Ban")).not.toBeInTheDocument();
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });
  });

  it("closes the menu when 'Ban' is clicked and Confirm is pressed", async () => {
    localStorage.setItem("userLogged", "true");
    localStorage.setItem("userData", JSON.stringify({
      userId: "admin123",
      roleName: "Admin"
    }));
    
    // Mock successful ban API call
    axios.delete.mockResolvedValueOnce({ status: 200 });
    
    renderWithRouter(<UserMini user={mockUser} />);

    // Wait for load and open menu
    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("John Doe");
    });
    fireEvent.click(screen.getByTestId("more-button"));

    // Click Ban using role
    const banMenuItem = await screen.findByRole("menuitem", { name: "Ban" });
    fireEvent.click(banMenuItem);

    // Click Confirm Ban using data-testid
    const confirmButton = await screen.findByTestId("confirm-ban-button");
    fireEvent.click(confirmButton);

    // Both dialog and menu should close
    await waitFor(() => {
      expect(screen.queryByTestId("confirm-ban-button")).not.toBeInTheDocument();
      expect(screen.queryByRole("menuitem", { name: "Ban" })).not.toBeInTheDocument();
    });
  });
});

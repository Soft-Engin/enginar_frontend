/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserMini from "../UserMini"; // Adjust the path

describe("UserMini Component", () => {
  it("renders user info correctly", () => {
    render(<UserMini />);

    // Check all elements by testId
    expect(screen.getByTestId("user-name")).toHaveTextContent("Hoshino Ichika");
    expect(screen.getByTestId("follow-button")).toHaveTextContent("Follow");
    expect(screen.getByTestId("following-count")).toHaveTextContent("3 Following");
    expect(screen.getByTestId("followers-count")).toHaveTextContent("5 Followers");
    expect(screen.getByText(/biography biography biography biography/i)).toBeInTheDocument();
  });

  it("opens the menu when menu icon is clicked", async () => {
    render(<UserMini />);

    // The menu is initially hidden
    // In MUI, we can check that 'Ban' is not present
    expect(screen.queryByText("Ban")).not.toBeInTheDocument();

    // Click the icon to open the menu
    const menuButton = screen.getByLabelText("more");
    fireEvent.click(menuButton);

    // Now we expect the 'Ban' MenuItem to be visible
    await waitFor(() =>
      expect(screen.getByText("Ban")).toBeInTheDocument()
    );
  });

  it("closes the menu when 'Ban' is clicked", async () => {
    render(<UserMini />);

    // Open the menu first
    fireEvent.click(screen.getByLabelText("more"));

    // Wait for 'Ban' to appear
    const banItem = await screen.findByText("Ban");
    expect(banItem).toBeInTheDocument();

    // Click 'Ban'
    fireEvent.click(banItem);

    // The menu should close, so 'Ban' should disappear
    await waitFor(() =>
      expect(screen.queryByText("Ban")).not.toBeInTheDocument()
    );
  });
});

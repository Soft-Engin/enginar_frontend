/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import UserListItem from "../UserListItem"; // Adjust the path
import { MemoryRouter, useNavigate } from "react-router-dom";

// Mock axios
vi.mock("axios");

// For navigation tests, we can also mock `useNavigate`
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("UserListItem Component", () => {
  let mockNavigate;
  let mockGet;

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);  // Remove TypeScript casting

    mockGet = axios.get;  // Remove TypeScript casting
    mockGet.mockImplementation(() => Promise.resolve({ data: {} }));
  });

  it("renders user name", () => {
    render(
      <MemoryRouter>
        <UserListItem user={{ userId: "123", userName: "TestUser" }} />
      </MemoryRouter>
    );

    // Check that user name is in the document
    expect(screen.getByText("TestUser")).toBeInTheDocument();
  });

  it("fetches and shows profile picture if available", async () => {
    // Create a more realistic mock blob
    const mockBlob = new Blob(['mock-image'], { type: 'image/jpeg' });
    
    // Mock successful profile picture response
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: mockBlob,
      headers: { 'content-type': 'image/jpeg' }
    });

    // Mock URL.createObjectURL
    const mockUrl = 'blob:mock-url';
    global.URL.createObjectURL = vi.fn(() => mockUrl);
    global.URL.revokeObjectURL = vi.fn();

    render(
      <MemoryRouter>
        <UserListItem user={{ userId: "123", userName: "TestUser" }} />
      </MemoryRouter>
    );

    // Wait for the avatar with image to appear and initials to disappear
    await waitFor(() => {
      expect(screen.queryByTestId("user-avatar-initials")).not.toBeInTheDocument();
      expect(screen.getByTestId("user-avatar-with-image")).toBeInTheDocument();
    });

    // Cleanup
    global.URL.createObjectURL.mockRestore();
    global.URL.revokeObjectURL.mockRestore();
  });

  it("shows placeholder if profile picture fails or returns non-200", async () => {
    mockGet.mockResolvedValueOnce({
      status: 404,
      data: null,
    });

    render(
      <MemoryRouter>
        <UserListItem user={{ userId: "123", userName: "TUser" }} />
      </MemoryRouter>
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("user-avatar-initials")).toBeInTheDocument();
    expect(screen.queryByTestId("user-avatar-with-image")).not.toBeInTheDocument();
  });

  it("handles error from axios gracefully and uses placeholder", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <UserListItem user={{ userId: "456", userName: "AnotherUser" }} />
      </MemoryRouter>
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    // The placeholder is "A"
    expect(screen.getByText("A")).toBeInTheDocument();
    // No image
    expect(screen.queryByTestId("user-avatar-image")).not.toBeInTheDocument();
  });

  it("navigates to profile on click", async () => {
    // No need for a real image fetch
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: null,
    });

    render(
      <MemoryRouter>
        <UserListItem user={{ userId: "999", userName: "ClickMeUser" }} />
      </MemoryRouter>
    );

    const container = screen.getByTestId("user-list-item");
    fireEvent.click(container);

    expect(mockNavigate).toHaveBeenCalledWith("/profile?id=999");
  });
});

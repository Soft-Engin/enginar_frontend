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
    // Mock a successful profile-picture response
    const mockBlob = new Blob(["fakeImageData"], { type: "image/png" });
    mockGet.mockResolvedValueOnce({
      status: 200,
      data: mockBlob,
    });
  
    render(
      <MemoryRouter>
        <UserListItem user={{ userId: "123", userName: "TestUser" }} />
      </MemoryRouter>
    );
  
    // Check placeholder is initially rendered
    expect(screen.getByText("T")).toBeInTheDocument();
  
    // Wait for the profile picture to be fetched and applied
    await waitFor(() => {
      const avatarImage = screen.getByTestId("user-avatar");
    });
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
    // We won't find user-avatar-image, so we rely on text "T" as placeholder
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.queryByTestId("user-avatar-image")).not.toBeInTheDocument();
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

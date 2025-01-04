/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Comment from "../Comment"; // Adjust the path as needed
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

// Mock axios
vi.mock("axios");

// Mock URL.createObjectURL
const mockObjectURL = "blob:mock-url";
window.URL.createObjectURL = vi.fn(() => mockObjectURL);
window.URL.revokeObjectURL = vi.fn();

describe("Comment Component", () => {
  let mockGet;
  let mockDelete;

  const sampleComment = {
    id: "comment-123",
    userId: "user-456",
    userName: "John Doe",
    timestamp: "2024-01-01T12:00:00Z",
    text: "This is a sample comment.",
    imagesCount: 2,
  };

  const sampleCommentWithNoImages = {
    ...sampleComment,
    imagesCount: 0,
  };

  const sampleCommentWithoutProfilePicture = {
    ...sampleComment,
    userId: "user-789",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = axios.get;
    mockDelete = axios.delete;
  });

  const renderComment = (comment, type = "recipe", onDelete = vi.fn(), isOwner = true) => {
    // Clear localStorage first
    window.localStorage.clear();
    
    // Set localStorage with the correct user ID
    window.localStorage.setItem(
      "userData",
      JSON.stringify({ 
        userId: isOwner ? comment.userId : "different-user-id" 
      })
    );

    return render(
      <MemoryRouter>
        <Comment comment={comment} type={type} onDelete={onDelete} />
      </MemoryRouter>
    );
  };

  it("renders comment with profile picture", async () => {
    // Mock API calls
    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleComment.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "John Doe" },
        });
      }
      if (url === `/api/v1/users/${sampleComment.userId}/profile-picture`) {
        return Promise.resolve({
          data: new Blob(), // Mock blob data
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/0`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/1`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      return Promise.reject(new Error("Unhandled GET request"));
    });

    renderComment(sampleComment, "recipe");

    // Wait for profile picture to load
    await waitFor(() => {
      const avatar = screen.getByTestId(`comment-avatar-${sampleComment.id}`);
      expect(avatar).toBeInTheDocument();
    });

    // Check user initials are not displayed
    expect(screen.queryByTestId(`comment-initials-${sampleComment.id}`)).not.toBeInTheDocument();

    // Check username
    expect(screen.getByTestId(`comment-username-${sampleComment.id}`)).toHaveTextContent("John Doe");

    // Check timestamp
    expect(screen.getByTestId(`comment-timestamp-${sampleComment.id}`)).toBeInTheDocument();

    // Check comment text
    expect(screen.getByTestId(`comment-text-${sampleComment.id}`)).toHaveTextContent("This is a sample comment.");

    // Wait for images to load
    await waitFor(() => {
      expect(screen.queryByTestId(`comment-loading-images-${sampleComment.id}`)).not.toBeInTheDocument();
      expect(screen.getByTestId(`comment-images-${sampleComment.id}`)).toBeInTheDocument();
      expect(screen.getAllByAltText(/Comment image/i)).toHaveLength(2);
    });
  });

  it("renders comment with user initials when profile picture is not available", async () => {
    // Mock API calls
    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleCommentWithoutProfilePicture.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "Jane Smith" },
        });
      }
      if (url === `/api/v1/users/${sampleCommentWithoutProfilePicture.userId}/profile-picture`) {
        return Promise.reject({ response: { status: 404 } }); // Simulate 404
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleCommentWithoutProfilePicture.id}/images/0`) {
        return Promise.reject({ response: { status: 404 } });
      }
      return Promise.reject(new Error("Unhandled GET request"));
    });

    renderComment(sampleCommentWithoutProfilePicture, "recipe");

    // Wait for initials to load
    await waitFor(() => {
      const initials = screen.getByTestId(`comment-initials-${sampleCommentWithoutProfilePicture.id}`);
      expect(initials).toBeInTheDocument();
      expect(initials).toHaveTextContent("JS"); // Jane Smith initials
    });

    // Check avatar is not displayed
    expect(screen.queryByTestId(`comment-avatar-${sampleCommentWithoutProfilePicture.id}`)).not.toBeInTheDocument();

    // Check user initials
    expect(screen.getByTestId(`comment-initials-${sampleCommentWithoutProfilePicture.id}`)).toHaveTextContent("JS");
  });

  it("renders comment without images when imagesCount is 0", async () => {
    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleCommentWithNoImages.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "John Doe" },
        });
      }
      if (url === `/api/v1/users/${sampleCommentWithNoImages.userId}/profile-picture`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      return Promise.reject(new Error("Unhandled GET request"));
    });

    renderComment(sampleCommentWithNoImages, "recipe");

    // Wait for profile picture to load
    await waitFor(() => {
      const avatar = screen.getByTestId(`comment-avatar-${sampleCommentWithNoImages.id}`);
      expect(avatar).toBeInTheDocument();
    });


    // Wait for images to finish loading
    await waitFor(() => {
      expect(screen.queryByTestId(`comment-loading-images-${sampleCommentWithNoImages.id}`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`comment-images-${sampleCommentWithNoImages.id}`)).not.toBeInTheDocument();
    });
  });

  it("renders comment images and handles image errors gracefully", async () => {
    // Mock API calls with one image failing
    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleComment.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "John Doe" },
        });
      }
      if (url === `/api/v1/users/${sampleComment.userId}/profile-picture`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/0`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/1`) {
        return Promise.reject({ response: { status: 404 } }); // Simulate image not found
      }
      return Promise.reject(new Error("Unhandled GET request"));
    });

    renderComment(sampleComment, "recipe");

    // Wait for images to load
    await waitFor(() => {
      expect(screen.queryByTestId(`comment-loading-images-${sampleComment.id}`)).not.toBeInTheDocument();
      expect(screen.getByTestId(`comment-images-${sampleComment.id}`)).toBeInTheDocument();
      expect(screen.getAllByAltText(/Comment image/i)).toHaveLength(1); // Only one image should be loaded
    });
  });

  it("renders the More menu and delete option if user is the comment owner", async () => {
    // Mock user as owner
    window.localStorage.setItem("userData", JSON.stringify({ userId: sampleComment.userId }));

    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleComment.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "John Doe" },
        });
      }
      if (url === `/api/v1/users/${sampleComment.userId}/profile-picture`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/0`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/1`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      return Promise.reject(new Error("Unhandled GET request"));
    });

    renderComment(sampleComment, "recipe");

    // Wait for profile picture to load
    await waitFor(() => {
      const avatar = screen.getByTestId(`comment-avatar-${sampleComment.id}`);
      expect(avatar).toBeInTheDocument();
    });

    // Check that More menu button is present
    const menuButton = screen.getByTestId(`comment-menu-button-${sampleComment.id}`);
    expect(menuButton).toBeInTheDocument();

    // Click the menu button
    fireEvent.click(menuButton);

    // Check that the menu is open
    await waitFor(() => {
      const menu = screen.getByTestId(`comment-menu-${sampleComment.id}`);
      expect(menu).toBeInTheDocument();
    });

    // Check that the Delete menu item is present
    const deleteMenuItem = screen.getByTestId(`comment-delete-menuitem-${sampleComment.id}`);
    expect(deleteMenuItem).toBeInTheDocument();
    expect(deleteMenuItem).toHaveTextContent("Delete");
  });

  it("opens and closes the delete confirmation dialog", async () => {
    const mockOnDelete = vi.fn();
    
    // Mock successful delete operation
    mockDelete.mockResolvedValueOnce({ status: 200 });

    // Mock API calls
    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleComment.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "John Doe" },
        });
      }
      if (url === `/api/v1/users/${sampleComment.userId}/profile-picture`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      return Promise.resolve({ data: new Blob() });
    });

    renderComment(sampleComment, "recipe", mockOnDelete, true);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByTestId(`comment-avatar-${sampleComment.id}`)).toBeInTheDocument();
    });

    // Open menu
    fireEvent.click(screen.getByTestId(`comment-menu-button-${sampleComment.id}`));

    // Click delete option
    await waitFor(() => {
      fireEvent.click(screen.getByTestId(`comment-delete-menuitem-${sampleComment.id}`));
    });

    // Confirm deletion
    await waitFor(() => {
      fireEvent.click(screen.getByTestId(`comment-delete-confirm-${sampleComment.id}`));
    });

    // Wait for delete request to complete
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(`/api/v1/recipes/comments/${sampleComment.id}`);
    });
  });

  it("handles deletion failure gracefully", async () => {
    // Mock user as owner
    window.localStorage.setItem("userData", JSON.stringify({ userId: sampleComment.userId }));

    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleComment.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "John Doe" },
        });
      }
      if (url === `/api/v1/users/${sampleComment.userId}/profile-picture`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/0`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      if (url === `/api/v1/${"recipe"}s/comments/${sampleComment.id}/images/1`) {
        return Promise.resolve({
          data: new Blob(),
        });
      }
      return Promise.reject(new Error("Unhandled GET request"));
    });

    const mockOnDelete = vi.fn();

    mockDelete.mockRejectedValueOnce(new Error("Deletion failed"));

    renderComment(sampleComment, "recipe", mockOnDelete);

    // Wait for profile picture to load
    await waitFor(() => {
      const avatar = screen.getByTestId(`comment-avatar-${sampleComment.id}`);
      expect(avatar).toBeInTheDocument();
    });

    // Click the menu button
    const menuButton = screen.getByTestId(`comment-menu-button-${sampleComment.id}`);
    fireEvent.click(menuButton);

    // Wait for the menu to open
    await waitFor(() => {
      expect(screen.getByTestId(`comment-menu-${sampleComment.id}`)).toBeInTheDocument();
    });

    // Click the Delete menu item
    const deleteMenuItem = screen.getByTestId(`comment-delete-menuitem-${sampleComment.id}`);
    fireEvent.click(deleteMenuItem);

    // Check that the dialog opens
    await waitFor(() => {
      expect(screen.getByTestId(`comment-delete-dialog-${sampleComment.id}`)).toBeInTheDocument();
    });

    // Click Confirm Delete
    const confirmButton = screen.getByTestId(`comment-delete-confirm-${sampleComment.id}`);
    fireEvent.click(confirmButton);

    // Mock the delete API call to fail
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(`/api/v1/${"recipe"}s/comments/${sampleComment.id}`);
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    // Optionally, check if an error message is displayed or handled
    // (Not implemented in the component, but you could extend it to show an error)
  });

  it("renders comment without More menu for non-owner", async () => {
    mockGet.mockImplementation((url) => {
      if (url === `/api/v1/users/${sampleComment.userId}`) {
        return Promise.resolve({
          status: 200,
          data: { userName: "John Doe" },
        });
      }
      if (url === `/api/v1/users/${sampleComment.userId}/profile-picture`) {
        return Promise.reject({ response: { status: 404 } });
      }
      return Promise.reject({ response: { status: 404 } });
    });

    // Explicitly render as non-owner
    renderComment(sampleComment, "recipe", vi.fn(), false);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByTestId(`comment-text-${sampleComment.id}`)).toBeInTheDocument();
    });

    // Check basic comment content
    expect(screen.getByTestId(`comment-text-${sampleComment.id}`)).toHaveTextContent(
      sampleComment.text
    );
    expect(screen.getByTestId(`comment-username-${sampleComment.id}`)).toHaveTextContent(
      sampleComment.userName
    );

    // Verify no menu button is present
    const menuButton = screen.queryByTestId(`comment-menu-button-${sampleComment.id}`);
    expect(menuButton).not.toBeInTheDocument();

    // Verify user initials are shown (since profile picture failed to load)
    expect(
      screen.getByTestId(`comment-initials-${sampleComment.id}`)
    ).toBeInTheDocument();
  });
});

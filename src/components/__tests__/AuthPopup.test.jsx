/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthPopup from "../AuthPopup"; // Adjust the path as needed
import axios from "axios";

describe("AuthPopup Component", () => {
  let mockSetUserLogged;
  let mockSetAnchorElUser;

  beforeEach(() => {
    // Mock the props
    mockSetUserLogged = vi.fn();
    mockSetAnchorElUser = vi.fn();

    // Clear mocks between tests
    vi.clearAllMocks();
  });

  const getInputByTestId = (testId) => {
    const field = screen.getByTestId(testId);
    return field.querySelector("input"); // Get the actual <input> inside MUI TextField
  };

  it("renders Login and Sign up buttons on initial load", () => {
    render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);

    const loginButton = screen.getByTestId("open-login-dialog-button");
    const signupButton = screen.getByTestId("open-signup-dialog-button");

    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });

  it("opens the login dialog when 'Log in' is clicked", () => {
    render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);

    const loginButton = screen.getByTestId("open-login-dialog-button");
    fireEvent.click(loginButton);

    // The Dialog title will be "Log In" if it is in login mode
    expect(screen.getByTestId("auth-dialog-title")).toHaveTextContent("Log In");
  });

  it("opens the signup dialog when 'Sign up' is clicked", () => {
    render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);

    const signupButton = screen.getByTestId("open-signup-dialog-button");
    fireEvent.click(signupButton);

    // The Dialog title will be "Sign Up" if it is in signup mode
    expect(screen.getByTestId("auth-dialog-title")).toHaveTextContent("Sign Up");
  });

  it("switches from signup to login when the user clicks the 'Already have an account?' link", () => {
    render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);

    // Open the Signup dialog
    fireEvent.click(screen.getByTestId("open-signup-dialog-button"));
    expect(screen.getByTestId("auth-dialog-title")).toHaveTextContent("Sign Up");

    // Click the 'Already have an account?' link
    const switchLink = screen.getByTestId("switch-mode-link");
    fireEvent.click(switchLink);

    // Now it should switch to "Log In"
    expect(screen.getByTestId("auth-dialog-title")).toHaveTextContent("Log In");
  });

  it("switches from login to signup when the user clicks the 'Don't have an account?' link", () => {
    render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);

    // Open the Login dialog
    fireEvent.click(screen.getByTestId("open-login-dialog-button"));
    expect(screen.getByTestId("auth-dialog-title")).toHaveTextContent("Log In");

    // Click the "Don't have an account?" link
    const switchLink = screen.getByTestId("switch-mode-link");
    fireEvent.click(switchLink);

    // Now it should switch to "Sign Up"
    expect(screen.getByTestId("auth-dialog-title")).toHaveTextContent("Sign Up");
  });

  describe("Form submission", () => {
    const mockPost = vi.spyOn(axios, "post");

    afterEach(() => {
      mockPost.mockReset();
      localStorage.clear();
    });

    it("submits signup form successfully and shows success message", async () => {
        render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);
  
        fireEvent.click(screen.getByTestId("open-signup-dialog-button"));
  
        fireEvent.change(getInputByTestId("first-name-input"), { target: { value: "John" } });
        fireEvent.change(getInputByTestId("last-name-input"), { target: { value: "Doe" } });
        fireEvent.change(getInputByTestId("username-input"), { target: { value: "john_doe" } });
        fireEvent.change(getInputByTestId("email-input"), { target: { value: "john@example.com" } });
        fireEvent.change(getInputByTestId("password-input"), { target: { value: "mypassword" } });
        fireEvent.change(getInputByTestId("confirm-password-input"), {
          target: { value: "mypassword" },
        });
  
        mockPost.mockResolvedValueOnce({ status: 200, data: { message: "User created" } });
  
        fireEvent.click(screen.getByTestId("auth-submit-button"));
  
        await waitFor(() =>
          expect(screen.getByTestId("success-alert")).toBeInTheDocument()
        );
  
        expect(screen.getByTestId("auth-dialog-title")).toHaveTextContent("Log In");
      });

      it("handles signup error response", async () => {
        render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);
  
        fireEvent.click(screen.getByTestId("open-signup-dialog-button"));
  
        fireEvent.change(getInputByTestId("first-name-input"), { target: { value: "John" } });
        fireEvent.change(getInputByTestId("last-name-input"), { target: { value: "Doe" } });
        fireEvent.change(getInputByTestId("username-input"), { target: { value: "john_doe" } });
        fireEvent.change(getInputByTestId("email-input"), { target: { value: "john@example.com" } });
        fireEvent.change(getInputByTestId("password-input"), { target: { value: "mypassword" } });
        fireEvent.change(getInputByTestId("confirm-password-input"), {
          target: { value: "mypassword" },
        });
  
        mockPost.mockRejectedValueOnce({
          response: { data: { message: "Username already exists" } },
        });
  
        fireEvent.click(screen.getByTestId("auth-submit-button"));
  
        await waitFor(() =>
          expect(screen.getByTestId("error-alert")).toHaveTextContent("Username already exists")
        );
      });
      
      it("submits login form successfully and sets localStorage + calls props", async () => {
        render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);
  
        fireEvent.click(screen.getByTestId("open-login-dialog-button"));
  
        fireEvent.change(getInputByTestId("identifier-input"), { target: { value: "john_doe" } });
        fireEvent.change(getInputByTestId("password-input"), { target: { value: "mypassword" } });
  
        mockPost.mockResolvedValueOnce({ status: 200, data: { token: "fake_jwt_token" } });
  
        fireEvent.click(screen.getByTestId("auth-submit-button"));
  
        await waitFor(() => {
          expect(mockPost).toHaveBeenCalledWith("/api/v1/auth/login", {
            identifier: "john_doe",
            password: "mypassword",
          });
        });
  
        expect(localStorage.getItem("token")).toBe("fake_jwt_token");
        expect(localStorage.getItem("userLogged")).toBe("true");
  
        expect(mockSetUserLogged).toHaveBeenCalledWith(true);
        expect(mockSetAnchorElUser).toHaveBeenCalledWith(null);
      });

    it("handles login error response", async () => {
      render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);

      fireEvent.click(screen.getByTestId("open-login-dialog-button"));

      fireEvent.change(getInputByTestId("identifier-input"), { target: { value: "john_doe" } });
      fireEvent.change(getInputByTestId("password-input"), { target: { value: "mypassword" } });

      mockPost.mockRejectedValueOnce({
        response: { data: { message: "Invalid Login Credentials" } },
      });

      fireEvent.click(screen.getByTestId("auth-submit-button"));

      await waitFor(() =>
        expect(screen.getByTestId("error-alert")).toHaveTextContent("Invalid Login Credentials")
      );
    });

  });

  it("clicking 'Forgot password?' calls the forgot password callback (placeholder)", () => {
    render(<AuthPopup setUserLogged={mockSetUserLogged} setAnchorElUser={mockSetAnchorElUser} />);

    // Open the login dialog
    fireEvent.click(screen.getByTestId("open-login-dialog-button"));

    // There's a link with test ID "forgot-password-link"
    const forgotLink = screen.getByTestId("forgot-password-link");
    const consoleSpy = vi.spyOn(console, "log");

    fireEvent.click(forgotLink);

    expect(consoleSpy).toHaveBeenCalledWith("Forgot Password");

    consoleSpy.mockRestore();
  });
});

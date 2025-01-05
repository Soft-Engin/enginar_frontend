/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import UserEventsTab from "../UserEventsTab";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("axios");

describe("UserEventsTab component", () => {
  let mockGet;

  const renderUserEventsTab = (route = "/profile?id=abc123") => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/profile" element={<UserEventsTab />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = axios.get;

    // Mock URL methods
    global.URL.createObjectURL = vi.fn(() => "mocked-url");
    global.URL.revokeObjectURL = vi.fn();

    mockGet.mockImplementation((url, { params }) => {
      return Promise.reject(new Error(`No mock for ${url}?pageNumber=${params?.pageNumber}`));
    });

    // Add ResizeObserver mock
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Mock scroll behavior
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1600, writable: true });
  });

  it("shows loading spinner initially", async () => {
    renderUserEventsTab();
    expect(screen.getByTestId("user-events-tab-container")).toBeInTheDocument();
  });

  it("shows error if fetching user events fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network Error"));

    renderUserEventsTab("/profile?id=abc123");

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/Network Error/)).toBeInTheDocument();
    });

    const eventsStack = screen.getByTestId("events-stack");
    expect(eventsStack).toBeInTheDocument();
    expect(eventsStack.children.length).toBe(0);
  });

  it("renders events after successful fetch", async () => {
    mockGet.mockImplementation((url, { params }) => {
      if (url.includes("/api/v1/users/abc123/events") && params.pageNumber === 1) {
        return Promise.resolve({
          status: 200,
          data: {
            items: [
              { id: "event1", title: "First event", eventId: "event1" },
              { id: "event2", title: "Second event", eventId: "event2" },
            ],
            totalCount: 2,
          },
        });
      }
      return Promise.reject(new Error("Unhandled"));
    });

    renderUserEventsTab("/profile?id=abc123");

    await waitFor(() => {
      expect(screen.queryByText("Network Error")).not.toBeInTheDocument();
      expect(screen.getByTestId("event-mini-event1")).toBeInTheDocument();
      expect(screen.getByTestId("event-mini-event2")).toBeInTheDocument();
    });
  });

  it("handles empty event scenario", async () => {
    mockGet.mockImplementation((url, { params }) => {
      if (url.includes("/api/v1/users/abc123/events") && params.pageNumber === 1) {
        return Promise.resolve({
          status: 200,
          data: {
            items: [],
            totalCount: 0,
          },
        });
      }
      return Promise.reject(new Error("Unhandled"));
    });

    renderUserEventsTab("/profile?id=abc123");

    await waitFor(() => {
      const eventsStack = screen.getByTestId("events-stack");
      expect(eventsStack).toBeInTheDocument();
      expect(eventsStack.children.length).toBe(0);
    });
  });
});

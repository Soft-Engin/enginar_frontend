/**
 * @vitest-environment jsdom
 */
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EventPage from "../EventPage";

// Mock child components
vi.mock("../EventDetailed", () => ({
  default: (props) => (
    <div data-testid="mock-event-detailed">
      Mocked EventDetailed, eventId: {props.eventId}
    </div>
  ),
}));

vi.mock("../CommentSection", () => ({
  default: (props) => (
    <div data-testid="mock-comment-section">
      Mocked CommentSection, contentId: {props.contentId}, type: {props.type}
    </div>
  ),
}));

vi.mock("../RecommendedUsers", () => ({
  default: () => <div data-testid="mock-recommended-users">Mocked RecommendedUsers</div>,
}));

vi.mock("../UpcomingEvents", () => ({
  default: () => <div data-testid="mock-upcoming-events">Mocked UpcomingEvents</div>,
}));

function renderWithRouter(queryString = "") {
  return render(
    <MemoryRouter initialEntries={[`/event${queryString}`]}>
      <Routes>
        <Route path="/event" element={<EventPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("EventPage Component", () => {
  it("renders without crashing", () => {
    renderWithRouter("?id=123");
    expect(screen.getByTestId("mock-event-detailed")).toBeInTheDocument();
  });

  it("passes the correct id to child components", () => {
    renderWithRouter("?id=event123");

    // Check EventDetailed receives correct props
    const eventDetailed = screen.getByTestId("mock-event-detailed");
    expect(eventDetailed).toHaveTextContent("eventId: event123");

    // Check CommentSection receives correct props
    const commentSection = screen.getByTestId("mock-comment-section");
    expect(commentSection).toHaveTextContent("contentId: event123");
    expect(commentSection).toHaveTextContent("type: event");

    // Verify other components are rendered
    expect(screen.getByTestId("mock-recommended-users")).toBeInTheDocument();
    expect(screen.getByTestId("mock-upcoming-events")).toBeInTheDocument();
  });

  it("handles missing id parameter", () => {
    renderWithRouter();

    // Components should still render with empty/null id
    expect(screen.getByTestId("mock-event-detailed")).toHaveTextContent("eventId:");
    expect(screen.getByTestId("mock-comment-section")).toHaveTextContent("contentId:");
  });
});

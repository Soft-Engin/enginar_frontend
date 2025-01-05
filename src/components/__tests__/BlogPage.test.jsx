// BlogPage.test.jsx

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogPage from "../BlogPage";

// 2. Mock them
vi.mock("../BlogDetailed", () => ({
  default: (props) => (
    <div data-testid="blog-detailed">
      Mocked BlogDetailed, blogId: {props.blogId}
    </div>
  ),
}));
vi.mock("../CommentSection", () => ({
  default: (props) => (
    <div data-testid="comment-section">
      Mocked CommentSection, contentId: {props.contentId}, type: {props.type}
    </div>
  ),
}));
vi.mock("../RecommendedUsers", () => ({
  default: () => <div data-testid="recommended-users">Mocked RecommendedUsers</div>,
}));
vi.mock("../UpcomingEvents", () => ({
  default: () => <div data-testid="upcoming-events">Mocked UpcomingEvents</div>,
}));

function renderWithQuery(queryString = "") {
  return render(
    <MemoryRouter initialEntries={[`/blog${queryString}`]}>
      <Routes>
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("BlogPage Component", () => {
  it("renders without crashing", () => {
    renderWithQuery("?id=123");
    expect(screen.getByTestId("blog-page-container")).toBeInTheDocument();
  });

  it("passes the 'id' search param to BlogDetailed and CommentSection", () => {
    renderWithQuery("?id=abc123");

    // The mocked BlogDetailed
    const blogDetailed = screen.getByTestId("blog-detailed");
    expect(blogDetailed).toHaveTextContent("abc123");

    // The mocked CommentSection
    const commentSection = screen.getByTestId("comment-section");
    expect(commentSection).toHaveTextContent("abc123");

    // The mocked RecommendedUsers + UpcomingEvents
    expect(screen.getByTestId("recommended-users")).toBeInTheDocument();
    expect(screen.getByTestId("upcoming-events")).toBeInTheDocument();
  });

  it("handles missing 'id' param gracefully", () => {
    // no "?id=..." in the URL
    renderWithQuery();

    expect(screen.getByTestId("blog-page-container")).toBeInTheDocument();

    // The mocked BlogDetailed is rendered with blogId: null
    expect(screen.getByTestId("blog-detailed")).toHaveTextContent("blogId:");
    expect(screen.getByTestId("comment-section")).toHaveTextContent("contentId:");
  });
});

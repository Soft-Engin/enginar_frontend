import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PopularBlogsTab from '../PopularBlogsTab';
import BlogDetailed from '../BlogDetailed';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8090";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? `Bearer ${localStorage.getItem("token")}`
  : "";

describe('Browse, select blog, update, delete', () => {
  beforeEach(() => {
    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(
      <Router>
        <PopularBlogsTab />
      </Router>,
      { container }
    );
  });

  test('should allow updating and deleting a blog from BlogDetailed', async () => {
    // Wait for the blogs container to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('blogs-container')).toBeInTheDocument();
    });

    setTimeout(async () => {
      // Check if blog boxes are present
      const blogBoxes = screen.queryAllByTestId('blog-box');
      expect(blogBoxes.length).toBeGreaterThan(0);

      // Select the first blog box and click to view details
      const firstBlogBox = blogBoxes[0];
      fireEvent.click(within(firstBlogBox).getByTestId('view-blog-button'));

      // Render the BlogDetailed component
      render(
        <Router>
          <BlogDetailed />
        </Router>
      );

      // Wait for the detailed view to be in the document
      await waitFor(() => {
        expect(screen.getByTestId('blog-detailed-container')).toBeInTheDocument();
      });

      // Check if the user is the owner of the blog
      const isOwner = screen.getByTestId('blog-owner').textContent === 'true';
      expect(isOwner).toBe(true);

      if (isOwner) {
        // Find the blog title input field and change its value
        const titleInput = screen.getByTestId('blog-title-input');
        fireEvent.change(titleInput, { target: { value: 'Updated Blog Title' } });

        // Find and click the save button
        const saveButton = screen.getByTestId('save-blog-button');
        fireEvent.click(saveButton);

        // Wait for the blog title to be updated
        await waitFor(() => {
          expect(screen.getByTestId('blog-title')).toHaveTextContent('Updated Blog Title');
        });

        // Find and click the delete button
        const deleteButton = screen.getByTestId('delete-blog-button');
        fireEvent.click(deleteButton);

        // Wait for the blog detailed view to be removed
        await waitFor(() => {
          expect(screen.queryByTestId('blog-detailed-container')).not.toBeInTheDocument();
        });
      }
    }, 1000); // Adjust the timeout duration as needed
  });
});
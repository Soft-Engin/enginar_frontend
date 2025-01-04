import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PopularRecipesTab from '../PopularRecipesTab';
import axios from 'axios'; // Import axios

describe('Guest User Journey - Browsing Popular Recipes', () => {
  beforeEach(async () => {
    // Set the base URL for axios
    axios.defaults.baseURL = "http://localhost:8090";

    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(<PopularRecipesTab />, { container });
  });

  test('should allow user to bookmark and like a recipe', async () => {
    // Wait for the recipes container to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('recipes-container')).toBeInTheDocument();
    });

    // Check if recipe boxes are present
    const recipeBoxes = screen.queryAllByTestId('recipe-box');

    setTimeout(async () => {

    expect(recipeBoxes.length).toBeGreaterThan(0);

    // Select the first recipe
    const firstRecipe = recipeBoxes[0];
    expect(firstRecipe).toBeInTheDocument();

    // Click the bookmark icon to save it to personal collection
    const bookmarkIcon = within(firstRecipe).getByTestId('bookmark-icon');
    fireEvent.click(bookmarkIcon);
    expect(bookmarkIcon).toHaveClass('bookmarked');

    // Click the like button to express appreciation
    const likeButton = within(firstRecipe).getByTestId('like-button');
    fireEvent.click(likeButton);
    expect(likeButton).toHaveClass('liked');

    // Verify the saved recipe is in the bookmarks section
    const bookmarksSection = screen.getByTestId('bookmarks-section');
    fireEvent.click(bookmarksSection);
    const savedRecipe = screen.getByText(firstRecipe.textContent);
    expect(savedRecipe).toBeInTheDocument();
    }, 5000)
  });
});
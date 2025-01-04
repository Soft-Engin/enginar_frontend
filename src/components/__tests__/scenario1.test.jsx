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

    console.log("mounted");
  });

  test('should display popular recipes and load more on scroll', async () => {
    // Wait for the recipes container to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('recipes-container')).toBeInTheDocument();
    });

    // Log the HTML to debug
    console.log(document.body.innerHTML);

    setTimeout(async () => {
      console.log("tries");
    // Check if recipe boxes are present
    const recipeBoxes = screen.queryAllByTestId('recipe-box');
    console.log('Recipe boxes found:', recipeBoxes.length);
    expect(recipeBoxes.length).toBeGreaterThan(0);

    const initialRecipeCount = recipeBoxes.length;

    // Simulate scrolling to bottom
     // set innerHeight to a value to avoid the need to scroll down in the test
     window.innerHeight = 800;

    // set the scrollTop to trigger the scroll event for loading more recipes
    document.documentElement.scrollTop = document.documentElement.scrollHeight;

    fireEvent.scroll(window);
    

    // Wait for more recipes to load
    await waitFor(() => {
        const newRecipeBoxes = screen.queryAllByTestId('recipe-box');
      expect(newRecipeBoxes.length).toBeGreaterThan(initialRecipeCount);
    });

    // Verify loading more indicator appears while fetching
    expect(screen.getByTestId('loading-error-display')).toHaveAttribute(
      'loadingMore',
      'true'
    );
    }, 5000)
    
  });
});
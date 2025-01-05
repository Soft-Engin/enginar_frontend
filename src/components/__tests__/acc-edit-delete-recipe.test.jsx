import React from 'react';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PopularRecipesTab from '../PopularRecipesTab';
import RecipeDetailed from '../RecipeDetailed';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8090";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? `Bearer ${localStorage.getItem("token")}`
  : "";

describe('updateediterecipes', () => {
  beforeEach(() => {
    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(
      <Router>
        <PopularRecipesTab />
      </Router>,
      { container }
    );
  });

  test('should allow updating and deleting a recipe from RecipeDetailed', async () => {
    // Wait for the recipes container to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('recipes-container')).toBeInTheDocument();
    });

    setTimeout(async () => {
    const recipeBoxes = await waitFor(() => screen.queryAllByTestId('recipe-box'));
    expect(recipeBoxes.length).toBeGreaterThan(0);

    // Select the first recipe box and click to view details
    const firstRecipeBox = recipeBoxes[0];
    fireEvent.click(within(firstRecipeBox).getByTestId('view-recipe-button'));

    // Render the RecipeDetailed component
    render(
      <Router>
        <RecipeDetailed />
      </Router>
    );

    // Wait for the detailed view to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('recipe-detailed-container')).toBeInTheDocument();
    });

    // Check if the user is the owner of the recipe
    const isOwner = screen.getByTestId('recipe-owner').textContent === 'true';
    expect(isOwner).toBe(true);

    if (isOwner) {
      // Find the recipe title input field and change its value
      const titleInput = screen.getByTestId('recipe-title-input');
      fireEvent.change(titleInput, { target: { value: 'Updated Recipe Title' } });

      // Find and click the save button
      const saveButton = screen.getByTestId('save-recipe-button');
      fireEvent.click(saveButton);

      // Wait for the recipe title to be updated
      await waitFor(() => {
        expect(screen.getByTestId('recipe-title')).toHaveTextContent('Updated Recipe Title');
      });

      // Find and click the delete button
      const deleteButton = screen.getByTestId('delete-recipe-button');
      fireEvent.click(deleteButton);

      // Wait for the recipe detailed view to be removed
      await waitFor(() => {
        expect(screen.queryByTestId('recipe-detailed-container')).not.toBeInTheDocument();
      });
    }
    }, 5000)
  });
});
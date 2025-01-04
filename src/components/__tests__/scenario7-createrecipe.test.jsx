import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from 'axios'; // Import axios

axios.defaults.baseURL = "http://localhost:8090";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? `Bearer ${localStorage.getItem("token")}`
  : "";

describe('User Journey - Creating a Recipe', () => {
  beforeEach(() => {
    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(
      <Router>
        <Navbar />
      </Router>,
      { container }
    );
  });

  test('should allow user to create a recipe', async () => {
    // Wait for the speed dial button to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('speed-dial-button')).toBeInTheDocument();
    });

    // Click the speed dial button to open the create recipe form
    fireEvent.click(screen.getByTestId('speed-dial-button'));

    // Wait for the create recipe form to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('create-recipe-form')).toBeInTheDocument();
    });

    // Fill in the recipe form
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'My New Recipe' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'This is the description of my new recipe.' } });
    fireEvent.change(screen.getByTestId('ingredients-input'), { target: { value: 'Ingredients for my new recipe.' } });
    fireEvent.change(screen.getByTestId('instructions-input'), { target: { value: 'Instructions for my new recipe.' } });

    // Click the submit button
    fireEvent.click(screen.getByTestId('submit-recipe-button'));

    // Wait for the success message to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    // Verify the success message content
    expect(screen.getByTestId('success-message')).toHaveTextContent('Recipe created successfully');
  });
});
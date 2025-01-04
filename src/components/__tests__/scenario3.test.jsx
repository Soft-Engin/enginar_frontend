import React from 'react';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProfile from '../UserProfile';
import axios from 'axios';

describe('UserProfile', () => {
  beforeEach(() => {

    axios.defaults.baseURL = "http://localhost:8090";

    
    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(
      <Router>
        <UserProfile />
      </Router>,
      { container }
    );
  });

  test('should allow user to edit bio', async () => {
    // Wait for the profile container to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('profile-container')).toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByTestId('edit-bio-button');
    fireEvent.click(editButton);

    // Find the bio input field and change its value
    const bioInput = screen.getByTestId('bio-input');
    fireEvent.change(bioInput, { target: { value: 'New bio content' } });

    // Find and click the save button
    const saveButton = screen.getByTestId('save-bio-button');
    fireEvent.click(saveButton);

    // Wait for the bio to be updated
    await waitFor(() => {
      expect(screen.getByTestId('bio-display')).toHaveTextContent('New bio content');
    });
  });
});
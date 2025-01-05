import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserProfile from '../UserProfile';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8090";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? `Bearer ${localStorage.getItem("token")}`
  : "";

describe('User Journey - Following a User in UserProfile', () => {
  beforeEach(() => {
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

  test('should allow following a user from UserProfile', async () => {
    // Wait for the profile container to be in the document
    await waitFor(() => {
      expect(screen.getByTestId('user-profile-container')).toBeInTheDocument();
    });

    // Wait for loading state to finish
    await waitFor(() => {
      expect(screen.queryByTestId('user-profile-loading')).not.toBeInTheDocument();
    });

    // Get and verify follow button
    const followButton = await screen.findByTestId('follow-button');
    expect(followButton).toBeInTheDocument();
    
    // Click follow button
    fireEvent.click(followButton);

    // Wait for unfollow button to appear
    await waitFor(() => {
      const unfollowButton = screen.getByTestId('unfollow-button');
      expect(unfollowButton).toBeInTheDocument();
    });

    // Test unfollow
    const unfollowButton = screen.getByTestId('unfollow-button');
    fireEvent.click(unfollowButton);

    // Wait for follow button to reappear
    await waitFor(() => {
      const followButtonAgain = screen.getByTestId('follow-button');
      expect(followButtonAgain).toBeInTheDocument();
    });
  });
});
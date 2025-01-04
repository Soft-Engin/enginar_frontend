import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8090";

describe('User Journey - Login and Logout', () => {
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

  test('should allow user to login and logout', async () => {
    // First verify the navbar is loaded
    await waitFor(() => {
      expect(screen.getByTestId('navbar-container')).toBeInTheDocument();
    });

    // Find the auth popup component
    const authPopup = screen.getByTestId('auth-popup');
    expect(authPopup).toBeInTheDocument();

    // Click on the auth popup to show the login form
    fireEvent.click(authPopup);

    // After logging in, click the user avatar to show the menu
    const avatarButton = await screen.findByTestId('user-avatar-button');
    fireEvent.click(avatarButton);

    // Find and click the logout option in the menu
    const userMenu = screen.getByTestId('user-menu');
    expect(userMenu).toBeInTheDocument();

    // Find and click the logout menu item
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Verify we're logged out by checking for auth popup again
    await waitFor(() => {
      expect(screen.getByTestId('auth-popup')).toBeInTheDocument();
    });
  });
});
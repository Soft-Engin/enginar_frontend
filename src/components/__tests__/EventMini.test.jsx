/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventMini from '../EventMini';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('EventMini Component', () => {
  let mockNavigate;
  
  const mockEvent = {
    eventId: 'event-123',
    title: 'Test Event',
    date: '2024-02-01T15:00:00Z',
    creatorId: 'user-456',
    address: {
      district: {
        city: {
          name: 'Test City'
        }
      }
    },
    bodyText: 'This is a test event description'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Setup default axios responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/profile-picture')) {
        return Promise.resolve({ data: new Blob() });
      }
      if (url.includes('/participants')) {
        return Promise.resolve({ 
          data: {
            participations: { items: [] },
            followedParticipations: { items: [] }
          }
        });
      }
      if (url.includes('/is-participant')) {
        return Promise.resolve({ data: { isParticipant: false } });
      }
      return Promise.resolve({ data: {} });
    });
  });

  const renderEventMini = () => {
    return render(
      <MemoryRouter>
        <EventMini event={mockEvent} />
      </MemoryRouter>
    );
  };

  it('renders event details correctly', () => {
    renderEventMini();

    expect(screen.getByTestId(`event-mini-${mockEvent.eventId}`)).toBeInTheDocument();
    expect(screen.getByTestId('event-title')).toHaveTextContent('Test Event');
    expect(screen.getByTestId('event-location')).toHaveTextContent('Test City');
    expect(screen.getByTestId('event-date')).toHaveTextContent('01.02.2024');
    expect(screen.getByTestId('event-description')).toHaveTextContent('This is a test event description');
  });

  it('shows join button for non-participants', async () => {
    renderEventMini();

    const joinButton = await screen.findByTestId('join-button');
    expect(joinButton).toHaveTextContent('Join');
  });

  it('shows leave button for participants', async () => {
    // Set userLogged to true first
    window.localStorage.setItem('userLogged', 'true');

    // Mock specific axios responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/is-participant')) {
        return Promise.resolve({ data: { isParticipant: true } });
      }
      if (url.includes('/participants')) {
        return Promise.resolve({ 
          data: {
            participations: { items: [] },
            followedParticipations: { items: [] }
          }
        });
      }
      // Default response for other calls
      return Promise.resolve({ data: {} });
    });

    renderEventMini();

    // Wait for the join button to update its text
    await waitFor(() => {
      const joinButton = screen.getByTestId('join-button');
      expect(joinButton.textContent).toBe('Leave');
    }, {
      timeout: 2000 // Increase timeout if needed
    });
  });

  it('prompts login when non-logged user tries to join', async () => {
    window.localStorage.setItem('userLogged', 'false');
    
    // Create mock login button
    const mockClick = vi.fn();
    const loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.addEventListener('click', mockClick);
    document.body.appendChild(loginButton);

    renderEventMini();

    const joinButton = await screen.findByTestId('join-button');
    fireEvent.click(joinButton);

    expect(mockClick).toHaveBeenCalledTimes(1);

    document.body.removeChild(loginButton);
  });

  it('toggles participation when logged user clicks join/leave', async () => {
    window.localStorage.setItem('userLogged', 'true');
    axios.post.mockResolvedValueOnce({});

    renderEventMini();

    const joinButton = await screen.findByTestId('join-button');
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `/api/v1/events/${mockEvent.eventId}/toggle-event-attendance`
      );
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('API Error'));

    renderEventMini();

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  it('displays participants avatars', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/participants')) {
        return Promise.resolve({
          data: {
            participations: {
              items: [
                { userId: 'user1', userName: 'User 1' },
                { userId: 'user2', userName: 'User 2' }
              ]
            },
            followedParticipations: {
              items: []
            }
          }
        });
      }
      return Promise.resolve({ data: {} });
    });

    renderEventMini();

    await waitFor(() => {
      const avatarGroup = screen.getByText('2 people are going');
      expect(avatarGroup).toBeInTheDocument();
    });
  });
});

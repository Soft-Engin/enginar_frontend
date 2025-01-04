/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventDetailed from '../EventDetailed';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('EventDetailed Component', () => {
  const mockEventId = 'event-123';
  const eventDate = '2024-02-01T15:00:00Z';
  const mockEvent = {
    eventId: mockEventId,
    title: 'Test Event',
    date: eventDate,
    creatorId: 'user-456',
    creatorUserName: 'TestHost',
    address: {
      street: 'Test Street',
      district: {
        name: 'Test District',
        city: {
          name: 'Test City',
          country: {
            name: 'Test Country'
          }
        }
      }
    },
    bodyText: 'This is a test event description',
    requirements: [
      { id: 1, name: 'Req 1', description: 'Description 1' },
      { id: 2, name: 'Req 2', description: 'Description 2' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();

    // Setup default axios responses
    axios.get.mockImplementation((url) => {
      if (url.includes(`/api/v1/events/${mockEventId}`)) {
        return Promise.resolve({ data: mockEvent });
      }
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

  const renderEventDetailed = () => {
    return render(
      <MemoryRouter>
        <EventDetailed eventId={mockEventId} />
      </MemoryRouter>
    );
  };

  it('renders loading state initially', () => {
    renderEventDetailed();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders event details after loading', async () => {
    renderEventDetailed();

    await waitFor(() => {
      expect(screen.getByTestId('event-title')).toHaveTextContent('Test Event');
      // Don't test the exact time, just verify the date format
      const datetimeElement = screen.getByTestId('event-datetime');
      expect(datetimeElement.textContent).toMatch(/01\.02\.2024, \d{2}:\d{2}/);
      expect(screen.getByTestId('event-location')).toHaveTextContent('Test Street, Test District, Test City, Test Country');
      expect(screen.getByTestId('event-description')).toHaveTextContent('This is a test event description');
    });
  });

  it('shows join button for non-participants', async () => {
    renderEventDetailed();

    await waitFor(() => {
      const joinButton = screen.getByTestId('join-button');
      expect(joinButton).toHaveTextContent('Join');
    });
  });

  it('shows leave button for participants', async () => {
    window.localStorage.setItem('userLogged', 'true');
    
    axios.get.mockImplementation((url) => {
      if (url.includes('/is-participant')) {
        return Promise.resolve({ data: { isParticipant: true } });
      }
      return Promise.resolve({ data: mockEvent });
    });

    renderEventDetailed();

    await waitFor(() => {
      const joinButton = screen.getByTestId('join-button');
      expect(joinButton).toHaveTextContent('Leave');
    });
  });

  it('prompts login when non-logged user tries to join', async () => {
    window.localStorage.setItem('userLogged', 'false');
    
    const mockClick = vi.fn();
    const loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.addEventListener('click', mockClick);
    document.body.appendChild(loginButton);

    renderEventDetailed();

    await waitFor(() => {
      const joinButton = screen.getByTestId('join-button');
      fireEvent.click(joinButton);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    document.body.removeChild(loginButton);
  });

  it('toggles participation when logged user clicks join/leave', async () => {
    window.localStorage.setItem('userLogged', 'true');
    axios.post.mockResolvedValueOnce({});

    renderEventDetailed();

    await waitFor(() => {
      const joinButton = screen.getByTestId('join-button');
      fireEvent.click(joinButton);
      expect(axios.post).toHaveBeenCalledWith(
        `/api/v1/events/${mockEventId}/toggle-event-attendance`
      );
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    renderEventDetailed();

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText(/API Error/)).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('displays requirements when available', async () => {
    renderEventDetailed();

    await waitFor(() => {
      expect(screen.getByText('Requirements:')).toBeInTheDocument();
      expect(screen.getByText('Req 1:')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Req 2:')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });
  });

  it('displays participants count correctly', async () => {
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
              items: [
                { userId: 'user3', userName: 'User 3' }
              ]
            }
          }
        });
      }
      return Promise.resolve({ data: mockEvent });
    });

    renderEventDetailed();

    await waitFor(() => {
      expect(screen.getByText('3 people are going')).toBeInTheDocument();
      expect(screen.getByText('(1 whom you follow)')).toBeInTheDocument();
    });
  });
});

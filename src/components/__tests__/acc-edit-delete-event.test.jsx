import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import EventDetailed from '../EventDetailed';
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8090";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? `Bearer ${localStorage.getItem("token")}`
  : "";

const eventId = 1; // Replace with the actual event ID you want to test

describe('User Journey - Editing and Deleting an Event', () => {
  beforeEach(() => {
    const container = document.createElement('div');
    container.style.height = '800px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    render(
      <Router>
        <EventDetailed eventId={eventId} />
      </Router>,
      { container }
    );
  });

  test('should allow updating and deleting an event from EventDetailed', async () => {
    // Wait for the detailed view to be in the document
    await waitFor(() => {
      expect(screen.getByTestId(`event-detailed-${eventId}`)).toBeInTheDocument();
    });

    setTimeout(async () => {
      // Check if the user is the owner of the event
      const isOwner = screen.getByTestId('event-owner').textContent === 'true';
      expect(isOwner).toBe(true);

      if (isOwner) {
        // Find the event title input field and change its value
        const titleInput = screen.getByTestId('event-title-input');
        fireEvent.change(titleInput, { target: { value: 'Updated Event Title' } });

        // Find and click the save button
        const saveButton = screen.getByTestId('save-event-button');
        fireEvent.click(saveButton);

        // Wait for the event title to be updated
        await waitFor(() => {
          expect(screen.getByTestId('event-title')).toHaveTextContent('Updated Event Title');
        });

        // Find and click the delete button
        const deleteButton = screen.getByTestId('delete-event-button');
        fireEvent.click(deleteButton);

        // Wait for the event detailed view to be removed
        await waitFor(() => {
          expect(screen.queryByTestId(`event-detailed-${eventId}`)).not.toBeInTheDocument();
        });
      }
    }, 1000); // Adjust the timeout duration as needed
  });
});
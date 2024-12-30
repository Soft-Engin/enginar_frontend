import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import BlogMini from '../BlogMini';

// Mock axios
vi.mock('axios');

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Sample blog data
const mockBlog = {
  id: '123',
  userId: '456',
  userName: 'Test User',
  bodyText: 'This is a test blog post',
  createdAt: '2024-01-01T12:00:00Z',
};

// Helper function to render BlogMini with router
const renderBlogMini = (props = {}) => {
  return render(
    <BrowserRouter>
      <BlogMini blog={mockBlog} {...props} />
    </BrowserRouter>
  );
};

describe('BlogMini Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorage.clear();

    // Setup default axios responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/banner')) {
        return Promise.resolve({ data: new Blob(), status: 200 });
      }
      if (url.includes('/profile-picture')) {
        return Promise.resolve({ data: new Blob(), status: 200 });
      }
      if (url.includes('/like-count')) {
        return Promise.resolve({ data: { likeCount: 10 } });
      }
      if (url.includes('/comments')) {
        return Promise.resolve({ data: { totalCount: 5 } });
      }
      if (url.includes('/is-liked')) {
        return Promise.resolve({ data: { isLiked: false } });
      }
      if (url.includes('/is-bookmarked')) {
        return Promise.resolve({ data: { isBookmarked: false } });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('renders blog content correctly', async () => {
    renderBlogMini();

    // Check if main content is rendered
    expect(screen.getByText(mockBlog.userName)).toBeInTheDocument();
    expect(screen.getByText(mockBlog.bodyText)).toBeInTheDocument();
  });

  test('handles like interaction when user is logged in', async () => {
    localStorage.setItem('userLogged', 'true');
    axios.post.mockResolvedValueOnce({});

    renderBlogMini();

    const likeButton = await screen.findByTestId('like-button');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`/api/v1/blogs/${mockBlog.id}/toggle-like`);
    });
  });

  test('handles like interaction when user is not logged in', async () => {
    localStorage.setItem('userLogged', 'false');
    
    // Create a mock login button that would exist in the parent component
    document.body.innerHTML = '<button id="loginButton">Login</button>';
    
    renderBlogMini();

    const likeButton = await screen.findByTestId('like-button');
    fireEvent.click(likeButton);

    // Should not make API call
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('navigates to blog detail page when clicking content', async () => {
    renderBlogMini();

    const blogContent = screen.getByText(mockBlog.bodyText);
    fireEvent.click(blogContent);

    expect(mockNavigate).toHaveBeenCalledWith(`/blog?id=${mockBlog.id}`);
  });

  test('handles image loading errors gracefully', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    renderBlogMini();

    await waitFor(() => {
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  test('updates like count when toggling like', async () => {
    localStorage.setItem('userLogged', 'true');
    axios.post.mockResolvedValueOnce({});

    renderBlogMini();

    const initialLikeCount = await screen.findByText('10');
    expect(initialLikeCount).toBeInTheDocument();

    const likeButton = await screen.findByTestId('like-button');
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(screen.getByText('11')).toBeInTheDocument();
    });
  });

  test('handles bookmark interaction', async () => {
    localStorage.setItem('userLogged', 'true');
    axios.post.mockResolvedValueOnce({});

    renderBlogMini();

    const bookmarkButton = await screen.findByTestId('bookmark-button');
    fireEvent.click(bookmarkButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`/api/v1/blogs/${mockBlog.id}/bookmark`);
    });
  });

  test('navigates to user profile when clicking username', async () => {
    renderBlogMini();

    const usernameLink = screen.getByText(mockBlog.userName);
    fireEvent.click(usernameLink);

    expect(window.location.pathname).toBe('/profile');
    expect(window.location.search).toBe(`?id=${mockBlog.userId}`);
  });

  test('handles failed API calls gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    axios.get.mockRejectedValue(new Error('API Error'));
    
    renderBlogMini();

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });

  /* is this test necessary? */
  // it is testing by adil and will be removed in the future, propably
  /*
  test('cleans up resources on unmount', async () => {
    const mockUrls = ['mock-url-1', 'mock-url-2'];
    let urlIndex = 0;
  
    // Mock URL.createObjectURL
    URL.createObjectURL.mockImplementation(() => mockUrls[urlIndex++]);
  
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('/banner') || url.includes('/profile-picture')) {
        return Promise.resolve({ data: new Blob(['test'], { type: 'image/jpeg' }) });
      }
      return Promise.resolve({ data: {} });
    });
  
    const { unmount } = render(
      <BrowserRouter>
        <BlogMini blog={mockBlog} />
      </BrowserRouter>
    );
  
    // Wait for the banner and profile picture URLs to be set
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    });
  
    // Log to confirm the URLs are set
    console.log('Mock URLs:', mockUrls);
  
    // Unmount the component
    unmount();
  
    // Ensure URLs are cleaned up
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrls[0]);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrls[1]);
  });
  */
  
  test('toggles like icon when clicked', async () => {
    localStorage.setItem('userLogged', 'true');
    axios.post.mockResolvedValueOnce({});

    renderBlogMini();

    // Initially should show the not-liked icon
    expect(await screen.findByTestId('not-liked-icon')).toBeInTheDocument();

    // Click the like button
    const likeButton = await screen.findByTestId('like-button');
    fireEvent.click(likeButton);

    // Should now show the liked icon
    await waitFor(() => {
      expect(screen.getByTestId('liked-icon')).toBeInTheDocument();
    });
  });

  test('toggles bookmark icon when clicked', async () => {
    localStorage.setItem('userLogged', 'true');
    axios.post.mockResolvedValueOnce({});

    renderBlogMini();

    // Initially should show the not-bookmarked icon
    expect(await screen.findByTestId('not-bookmarked-icon')).toBeInTheDocument();

    // Click the bookmark button
    const bookmarkButton = await screen.findByTestId('bookmark-button');
    fireEvent.click(bookmarkButton);

    // Should now show the bookmarked icon
    await waitFor(() => {
      expect(screen.getByTestId('bookmarked-icon')).toBeInTheDocument();
    });
  });
});

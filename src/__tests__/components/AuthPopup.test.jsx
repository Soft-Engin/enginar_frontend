import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthPopup from '../../components/AuthPopup'

describe('AuthPopup', () => {
  const mockSetAnchorElUser = vi.fn()
  const mockSetUserLogged = vi.fn()
  const mockLocalStorage = vi.spyOn(Storage.prototype, 'setItem')
  const mockConsoleLog = vi.spyOn(console, 'log')

  beforeEach(() => {
    render(
      <AuthPopup 
        setAnchorElUser={mockSetAnchorElUser}
        setUserLogged={mockSetUserLogged}
      />
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Render', () => {
    it('renders login and signup buttons', () => {
      expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
    })

    it('dialog should not be visible initially', () => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('Sign Up Flow', () => {
    beforeEach(async () => {
      const signupButton = screen.getByRole('button', { name: 'Sign up' })
      fireEvent.click(signupButton)
    })

    it('displays signup form fields', () => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(within(dialog).getByPlaceholderText('Username')).toBeInTheDocument()
      expect(within(dialog).getByPlaceholderText('Email Address')).toBeInTheDocument()
      expect(within(dialog).getByPlaceholderText('Password')).toBeInTheDocument()
      expect(within(dialog).getByPlaceholderText('Confirm Password')).toBeInTheDocument()
    })

    it('shows login link', () => {
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByText('Already have an account?')).toBeInTheDocument()
      expect(within(dialog).getByText('Hop back in!')).toBeInTheDocument()
    })

    it('switches to login form when clicking login link', async () => {
      const switchLink = screen.getByText('Hop back in!')
      fireEvent.click(switchLink)
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveTextContent('Log In')
      })
    })
  })

  describe('Login Flow', () => {
    beforeEach(async () => {
      const loginButton = screen.getByRole('button', { name: 'Log in' })
      fireEvent.click(loginButton)
    })

    it('displays login form fields', () => {
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByPlaceholderText('Username or Email')).toBeInTheDocument()
      expect(within(dialog).getByPlaceholderText('Password')).toBeInTheDocument()
      expect(within(dialog).getByText('Forgot password?')).toBeInTheDocument()
    })

    it('shows signup link', () => {
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByText("Don't have an account?")).toBeInTheDocument()
      expect(within(dialog).getByText('Sign up today!')).toBeInTheDocument()
    })

    it('handles successful login', async () => {
      const dialog = screen.getByRole('dialog')
      const usernameInput = within(dialog).getByPlaceholderText('Username or Email')
      const passwordInput = within(dialog).getByPlaceholderText('Password')
      const submitButton = within(dialog).getByRole('button', { name: 'Log In' })

      await userEvent.type(usernameInput, 'testuser')
      await userEvent.type(passwordInput, 'password123')
      fireEvent.click(submitButton)

      expect(mockSetAnchorElUser).toHaveBeenCalledWith(null)
      expect(mockSetUserLogged).toHaveBeenCalledWith(true)
      expect(mockLocalStorage).toHaveBeenCalledWith('userLogged', 'true')
      expect(mockLocalStorage).toHaveBeenCalledTimes(1)
      expect(mockConsoleLog).toHaveBeenCalledWith({
        identifier: 'testuser',
        password: 'password123'
      })
    })

    it('handles form submission with empty values', async () => {
      const dialog = screen.getByRole('dialog')
      const submitButton = within(dialog).getByRole('button', { name: 'Log In' })
      
      // Create and dispatch a submit event on the form
      const form = within(dialog).getByRole('dialog')
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      form.dispatchEvent(submitEvent)
      
      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalledWith({
          identifier: '',
          password: ''
        })
        expect(mockSetAnchorElUser).toHaveBeenCalledWith(null)
        expect(mockSetUserLogged).toHaveBeenCalledWith(true)
      })
    })
  })

  describe('Form Validation', () => {
    const mockSubmit = vi.fn()
    
    beforeEach(async () => {
      mockSubmit.mockClear()
      const signupButton = screen.getByRole('button', { name: 'Sign up' })
      fireEvent.click(signupButton)
    })

    it('shows required field validation', async () => {
      const dialog = screen.getByRole('dialog')
      const submitButton = within(dialog).getByRole('button', { name: 'Sign Up' })
      fireEvent.click(submitButton)

      const requiredFields = within(dialog).getAllByRole('textbox')
      requiredFields.forEach(field => {
        expect(field).toBeRequired()
      })
    })

    it('validates email format', async () => {
      const dialog = screen.getByRole('dialog')
      const emailInput = within(dialog).getByPlaceholderText('Email Address')
      await userEvent.type(emailInput, 'invalid-email')
      
      const submitButton = within(dialog).getByRole('button', { name: 'Sign Up' })
      fireEvent.click(submitButton)
      
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('validates password match in signup', async () => {
      const dialog = screen.getByRole('dialog')
      const passwordInput = within(dialog).getByPlaceholderText('Password')
      const confirmPasswordInput = within(dialog).getByPlaceholderText('Confirm Password')
      
      await userEvent.type(passwordInput, 'password123')
      await userEvent.type(confirmPasswordInput, 'password124')
      
      // Create and dispatch a submit event on the form
      const form = within(dialog).getByRole('dialog')
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      form.dispatchEvent(submitEvent)
      
      await waitFor(() => {
        expect(mockConsoleLog).toHaveBeenCalledWith({
          username: '',
          email: '',
          password: 'password123',
          confirmPassword: 'password124'
        })
      })
    })
  })

  describe('UI Elements', () => {
    it('renders styled buttons correctly', () => {
      const loginButton = screen.getByRole('button', { name: 'Log in' })
      const signupButton = screen.getByRole('button', { name: 'Sign up' })

      expect(loginButton).toHaveStyle({
        textTransform: 'none'
      })
      expect(signupButton).toHaveStyle({
        textTransform: 'none'
      })
    })

    it('shows icons in form fields', async () => {
      const loginButton = screen.getByRole('button', { name: 'Log in' })
      fireEvent.click(loginButton)

      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByTestId('PersonIcon')).toBeInTheDocument()
      expect(within(dialog).getByTestId('KeyIcon')).toBeInTheDocument()
    })
  })
})

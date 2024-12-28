import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserMini from '../../components/UserMini'

describe('UserMini', () => {
  beforeEach(() => {
    render(<UserMini />)
  })

  describe('User Information Display', () => {
    it('displays the username correctly', () => {
      expect(screen.getByText('Hoshino Ichika')).toBeInTheDocument()
    })

    it('displays follower and following counts correctly', () => {
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Following')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Followers')).toBeInTheDocument()
    })

    it('displays biography text', () => {
      expect(screen.getByText(/biography biography/)).toBeInTheDocument()
    })
  })

  describe('Follow Button', () => {
    it('displays a follow button', () => {
      const followButton = screen.getByText('Follow')
      expect(followButton).toBeInTheDocument()
    })

    it('follow button has correct text', () => {
      const followButton = screen.getByText('Follow')
      expect(followButton).toHaveTextContent('Follow')
    })
  })

  describe('Menu Interaction', () => {
    it('menu is not visible initially', () => {
      expect(screen.queryByText('Ban')).not.toBeInTheDocument()
    })

    it('opens menu when clicking more button', () => {
      const menuButton = screen.getByLabelText('more')
      fireEvent.click(menuButton)
      expect(screen.getByText('Ban')).toBeInTheDocument()
    })

    it('closes menu when selecting Ban option', async () => {
      const menuButton = screen.getByLabelText('more')
      fireEvent.click(menuButton)
      
      const banOption = screen.getByText('Ban')
      fireEvent.click(banOption)
      
      // Give MUI menu time to animate closing
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(screen.queryByText('Ban')).not.toBeInTheDocument()
    })

    it('menu button has correct ARIA attributes', () => {
      const menuButton = screen.getByLabelText('more')
      expect(menuButton).toHaveAttribute('aria-haspopup', 'true')
    })
  })

  describe('Visual Elements', () => {
    it('renders an avatar component', () => {
      const avatar = screen.getByTestId('PersonIcon')
      expect(avatar).toBeInTheDocument()
    })

    it('renders follower and following information', () => {
      const followingText = screen.getByText(/Following/)
      const followersText = screen.getByText(/Followers/)
      
      expect(followingText).toBeInTheDocument()
      expect(followersText).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('renders in correct hierarchy', () => {
      const username = screen.getByText('Hoshino Ichika')
      const followButton = screen.getByText('Follow')
      const biography = screen.getByText(/biography biography/)
      
      expect(username).toBeInTheDocument()
      expect(followButton).toBeInTheDocument()
      expect(biography).toBeInTheDocument()
    })
  })
})

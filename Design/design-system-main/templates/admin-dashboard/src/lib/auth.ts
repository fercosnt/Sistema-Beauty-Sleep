/**
 * Mock Authentication Service
 *
 * This is a simple mock authentication service for demonstration purposes.
 * In production, replace this with your actual authentication logic.
 */

export interface User {
  id: string
  name: string
  email: string
  role: string
}

const MOCK_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@beautysmile.com',
  role: 'admin',
}

const AUTH_KEY = 'auth_token'

export const auth = {
  /**
   * Mock login function
   *
   * Accepts any email/password combination for demo purposes
   */
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, validate credentials with your backend
    if (email && password) {
      localStorage.setItem(AUTH_KEY, 'mock_token')
      return MOCK_USER
    }

    throw new Error('Invalid credentials')
  },

  /**
   * Logout function
   */
  logout: () => {
    localStorage.removeItem(AUTH_KEY)
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_KEY)
  },

  /**
   * Get current user
   */
  getCurrentUser: (): User | null => {
    if (auth.isAuthenticated()) {
      return MOCK_USER
    }
    return null
  },
}

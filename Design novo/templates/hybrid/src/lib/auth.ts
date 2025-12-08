/**
 * Mock Authentication Service with Roles
 */

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

const MOCK_ADMIN: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@beautysmile.com',
  role: 'admin',
}

const MOCK_USER: User = {
  id: '2',
  name: 'Regular User',
  email: 'user@beautysmile.com',
  role: 'user',
}

const AUTH_KEY = 'auth_token'
const USER_KEY = 'current_user'

export const auth = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock: admin@* logs in as admin, others as regular user
    const user = email.startsWith('admin@') ? MOCK_ADMIN : MOCK_USER

    localStorage.setItem(AUTH_KEY, 'mock_token')
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return user
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(USER_KEY)
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_KEY)
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY)
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  isAdmin: (): boolean => {
    const user = auth.getCurrentUser()
    return user?.role === 'admin'
  },
}

"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { User } from "@/lib/mock-data"

const STORAGE_KEY = "cropguard_user"
const REGISTERED_USERS_KEY = "cropguard_registered_users"

interface AuthContextType {
  user: User | null
  hydrated: boolean
  login: (email: string, name?: string) => void
  register: (data: {
    name: string
    email: string
    lat: number
    lng: number
    region: string
    cropTypes: string[]
  }) => void
  logout: () => void
  updateUser: (changes: Partial<Pick<User, "name" | "region" | "cropTypes">>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}

function getRegisteredUsers(): Record<string, User> {
  if (typeof window === "undefined") return {}
  try {
    const stored = sessionStorage.getItem(REGISTERED_USERS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveRegisteredUser(user: User) {
  if (typeof window === "undefined") return
  const users = getRegisteredUsers()
  users[user.email] = user
  sessionStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const stored = getStoredUser()
    if (stored) {
      setUser(stored)
    }
    setHydrated(true)
  }, [])

  // Sync state changes back to sessionStorage
  useEffect(() => {
    if (hydrated) {
      storeUser(user)
    }
  }, [user, hydrated])

  const login = useCallback((email: string, name?: string) => {
    // Check if this email was previously registered
    const registeredUsers = getRegisteredUsers()
    const existingUser = registeredUsers[email]

    if (existingUser) {
      // Use the registered user's full data
      setUser(existingUser)
    } else {
      // Create a basic user from the email
      const newUser: User = {
        id: "u-" + Date.now(),
        name: name || email.split("@")[0],
        email,
        location: { lat: 28.6139, lng: 77.209 },
        cropTypes: ["Tomato", "Potato", "Wheat"],
        region: "North India",
        createdAt: new Date().toISOString(),
      }
      setUser(newUser)
    }
  }, [])

  const register = useCallback(
    (data: {
      name: string
      email: string
      lat: number
      lng: number
      region: string
      cropTypes: string[]
    }) => {
      const newUser: User = {
        id: "u-" + Date.now(),
        name: data.name,
        email: data.email,
        location: { lat: data.lat, lng: data.lng },
        cropTypes: data.cropTypes.length > 0 ? data.cropTypes : ["Tomato"],
        region: data.region || "North India",
        createdAt: new Date().toISOString(),
      }
      // Save to registered users store so login can find it
      saveRegisteredUser(newUser)
      setUser(newUser)
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateUser = useCallback(
    (changes: Partial<Pick<User, "name" | "region" | "cropTypes">>) => {
      setUser(prev => {
        if (!prev) return prev
        const updated = { ...prev, ...changes }
        saveRegisteredUser(updated)
        return updated
      })
    },
    []
  )

  return (
    <AuthContext.Provider value={{ user, hydrated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

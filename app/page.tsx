"use client"

import { useState } from "react"
import UserView from "./components/UserView"
import AdminView from "./components/AdminView"
import LandingPage from "./components/LandingPage"

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<"landing" | "user" | "admin">("landing")

  const handleLoginSuccess = (userData: any) => {
    setCurrentUser(userData)

    // Detectar automáticamente si es admin o usuario
    if (userData.role === "admin") {
      setCurrentView("admin")
    } else {
      setCurrentView("user")
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("landing")
  }

  if (currentView === "user") {
    return <UserView onBack={handleLogout} currentUser={currentUser} />
  }

  if (currentView === "admin") {
    return <AdminView onBack={handleLogout} currentUser={currentUser} />
  }

  return <LandingPage onLoginSuccess={handleLoginSuccess} />
}

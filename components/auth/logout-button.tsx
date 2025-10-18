"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/auth/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
      <LogOut className="h-4 w-4 mr-2" />
      Abmelden
    </Button>
  )
}

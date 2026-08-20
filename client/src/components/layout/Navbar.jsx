import { Link, NavLink } from "react-router-dom"
import {
  CalendarCheck,
  Menu,
  Sparkles,
  X,
} from "lucide-react"
import { useState } from "react"

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/react"

import Logo from "../branding/Logo"
import ThemeToggle from "./ThemeToggle"
import { Button } from "../ui/button"

const navigationItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Rooms",
    path: "/rooms",
  },
  {
    name: "Destinations",
    path: "/destinations",
  },
  {
    name: "AI Planner",
    path: "/ai-planner",
    icon: Sparkles,
  },
]

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                {Icon && <Icon className="size-4" />}
                {item.name}
              </NavLink>
            )
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          {/* Signed In Dashboard */}
          <Show when="signed-in">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          </Show>

          <Link to="/bookings">
            <Button variant="ghost" size="sm">
              <CalendarCheck />
              My Bookings
            </Button>
          </Link>

          {/* Signed Out */}
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </Show>

          {/* Signed In */}
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-9",
                },
              }}
            />
          </Show>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navigationItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  {Icon && <Icon className="size-4" />}
                  {item.name}
                </NavLink>
              )
            })}

            {/* Mobile Dashboard */}
            <Show when="signed-in">
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </Show>

            {/* Mobile My Bookings */}
            <NavLink
              to="/bookings"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <CalendarCheck className="size-4" />
              My Bookings
            </NavLink>

            {/* Mobile Actions */}
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-4">
              <ThemeToggle />

              {/* Signed Out */}
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button className="flex-1">
                    Sign Up
                  </Button>
                </SignUpButton>
              </Show>

              {/* Signed In */}
              <Show when="signed-in">
                <div className="flex flex-1 justify-end">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "size-9",
                      },
                    }}
                  />
                </div>
              </Show>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
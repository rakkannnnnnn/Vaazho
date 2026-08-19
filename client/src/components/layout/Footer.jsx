import {
  Mail,
  MapPin,
} from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight"
            >
              VAZHO
            </Link>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Your AI-powered travel companion. Discover destinations,
              plan smarter trips and make your journey easier.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              <span>India</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h2 className="text-sm font-semibold">
              Explore
            </h2>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/rooms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Rooms
                </Link>
              </li>

              <li>
                <Link
                  to="/destinations"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Destinations
                </Link>
              </li>

              <li>
                <Link
                  to="/ai-planner"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  AI Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-sm font-semibold">
              Company
            </h2>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h2 className="text-sm font-semibold">
              Legal & Social
            </h2>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-2">
                <a
                    href="#"
                    aria-label="Instagram"
                    className="flex size-9 items-center justify-center rounded-full border border-border text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    ◎
                </a>

                <a
                    href="#"
                    aria-label="Facebook"
                    className="flex size-9 items-center justify-center rounded-full border border-border text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    f
                </a>

                <a
                    href="#"
                    aria-label="X / Twitter"
                    className="flex size-9 items-center justify-center rounded-full border border-border text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    𝕏
                </a>

                <a
                    href="mailto:hello@vazho.com"
                    aria-label="Email VAZHO"
                    className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    <Mail className="size-4" />
                </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} VAZHO. All rights reserved.
          </p>

          <p>
            Plan Less. Travel More.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
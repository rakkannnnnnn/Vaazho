import { useEffect, useState } from "react";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";
import AuthActions from "./AuthActions";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("vazho-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem("vazho-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <DesktopNav />

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle
            theme={theme}
            onToggle={toggleTheme}
          />

          <AuthActions />
        </div>

        <MobileNav
          open={mobileOpen}
          onToggle={() => setMobileOpen((open) => !open)}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>
    </header>
  );
}

export default Navbar;

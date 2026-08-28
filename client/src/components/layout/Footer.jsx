import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const exploreLinks = [
  { label: "Home", path: "/" },
  { label: "Destinations", path: "/destinations" },
  { label: "AI Planner", path: "/ai-planner" },
];

const companyLinks = [
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const legalLinks = [
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
];

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="group inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                <ArrowUpRight
                  size={20}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
              <span className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
                VAZHO
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-neutral-600 dark:text-neutral-400">
              Plan smarter. Travel better.
            </p>
          </div>

          <FooterLinkGroup title="Explore" links={exploreLinks} />
          <FooterLinkGroup title="Company" links={companyLinks} />
          <FooterLinkGroup title="Legal" links={legalLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VAZHO</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2"
      aria-label="VAZHO Home"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
        <ArrowUpRight
          size={20}
          strokeWidth={2.5}
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>

      <span className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
        VAZHO
      </span>
    </Link>
  );
}

export default Logo;
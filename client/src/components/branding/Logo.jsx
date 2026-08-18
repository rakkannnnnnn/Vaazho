import { Link } from "react-router-dom"

function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2"
      aria-label="VAZHO Home"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7 9L14 28L20 17L26 28L33 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M12 32C17 28 23 28 29 32"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <span className="text-xl font-bold tracking-tight">
        VAZHO
      </span>
    </Link>
  )
}

export default Logo
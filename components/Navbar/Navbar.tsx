"use client";

import { useState } from "react";
import Link from "next/link";

// No auth wiring yet — that's a later step. Static links + Sign In/Register for now.
const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/employees", label: "Employees" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-bold text-white">
            Employee Portal
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-md px-3 py-2 text-sm font-medium text-blue-100 transition-colors hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-md border border-white/40 px-4 py-1.5 text-sm font-medium text-white hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Register
            </Link>
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 md:hidden"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="space-y-1 pb-4 md:hidden">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10"
              >
                {label}
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-white/20 pt-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-white/40 px-4 py-2 text-center text-sm font-medium text-white hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-white px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

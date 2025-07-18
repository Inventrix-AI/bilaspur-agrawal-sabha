"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, LogOut, Settings, User } from "lucide-react"

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Agrawal Sabha",
    href: "/about",
    children: [
      { name: "About Us", href: "/about-us" },
      { name: "Patron Members", href: "/patron-members" },
      { name: "Lifetime Members", href: "/lifetime-members" },
      { name: "2-Year Members", href: "/two-year-members" }
    ]
  },
  {
    name: "Committee",
    href: "/committee",
    children: [
      { name: "Executive Committee", href: "/committee/1" },
      { name: "Cultural Committee", href: "/committee/2" }
    ]
  },
  { name: "Members List", href: "/members" },
  { name: "Gallery", href: "/gallery" },
  { name: "Events", href: "/events" },
  { name: "Downloads", href: "/downloads" },
  { name: "News", href: "/news" }
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  
  const isAdmin = session?.user?.role === 'Super Admin' || session?.user?.role === 'Committee Admin'

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-orange-500 py-6 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <span className="sr-only">Bilaspur Agrawal Sabha</span>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BAS</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Bilaspur Agrawal Sabha</h1>
                  <p className="text-sm text-gray-600">Connecting Hearts, Celebrating Heritage</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="ml-10 space-x-4 lg:block hidden">
            {navigation.map((item) => (
              <div key={item.name} className="relative inline-block group">
                <Link
                  href={item.href}
                  className="text-base font-medium text-gray-700 hover:text-orange-600 px-3 py-2"
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
{session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user.name}
                </span>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                  title="My Dashboard"
                >
                  <User className="h-5 w-5" />
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-orange-600 transition-colors"
                    title="Admin Panel"
                  >
                    <Settings className="h-5 w-5" />
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/register"
                  className="text-orange-600 hover:text-orange-700 px-3 py-2 rounded-md font-medium transition-colors"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-2 pb-3 pt-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
{session ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 px-3 py-2">
                    {session.user.name}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block text-gray-700 hover:text-orange-600 px-3 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block text-gray-700 hover:text-orange-600 px-3 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left text-gray-700 hover:text-orange-600 px-3 py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/register"
                    className="block text-orange-600 hover:text-orange-700 px-3 py-2 rounded-md font-medium transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    className="block bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
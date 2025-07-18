import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in touch!</h3>
            <div className="text-sm text-gray-300">
              <p>C/o Agrasen Bhawan</p>
              <p>Juni Line, BILASPUR C.G.</p>
              <p>495001</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about-us" className="text-gray-300 hover:text-orange-400">Agrawal Sabha</Link></li>
              <li><Link href="/members" className="text-gray-300 hover:text-orange-400">Members List</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-orange-400">Events</Link></li>
              <li><Link href="/news" className="text-gray-300 hover:text-orange-400">News</Link></li>
              <li><Link href="/downloads" className="text-gray-300 hover:text-orange-400">Smriti Ank 2023</Link></li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">More</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-gray-300 hover:text-orange-400">Login</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-orange-400">Privacy Policy</Link></li>
              <li><Link href="/gallery" className="text-gray-300 hover:text-orange-400">Gallery</Link></li>
              <li><Link href="/committee" className="text-gray-300 hover:text-orange-400">Committee</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-pink-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © Copyright 2025 Bilaspur Agrawal Sabha All Rights Reserved
            </p>
            <p className="text-sm text-gray-400 mt-2 md:mt-0">
              Powered By Exabyte Technologies
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
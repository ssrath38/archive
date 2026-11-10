import { FiPhoneCall } from "react-icons/fi";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 lg:grid-cols-4 lg:px-0">
        <div>
          <h3 className="mb-4 text-lg text-gray-800">Newsletter</h3>
          <p className="mb-4 text-gray-500">
            Be the first to here about new products, exclusive events, and
            online offers.
          </p>
          <p className="mb-6 text-sm font-medium text-gray-600">
            Sign up and get 10% off on your first order.
          </p>
          {/* Newsletter form */}
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-l-md border-t border-b border-l border-gray-300 p-3 text-sm transition-all focus:ring-2 focus:ring-gray-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="rounded-r-md bg-black px-6 py-3 text-sm text-white transition-all hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
        </div>
        {/* Shop links */}
        <div>
          <h3 className="mb-4 text-lg text-gray-800">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Men&apos;s Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Women&apos;s Top Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Men&apos;s Bottom Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Women&apos;s Bottom Wear
              </Link>
            </li>
          </ul>
        </div>
        {/* Support links */}
        <div>
          <h3 className="mb-4 text-lg text-gray-800">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Features
              </Link>
            </li>
          </ul>
        </div>
        {/* Follow us */}
        <div>
          <h3 className="mb-4 text-lg text-gray-800">Follow Us</h3>
          <div className="mb-6 flex items-center space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <TbBrandMeta className="size-5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <IoLogoInstagram className="size-5" />
            </a>
            <a
              href="https://www.x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <RiTwitterXLine className="size-4" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p>
            <FiPhoneCall className="mr-2 inline-block" />
            0123-456-789
          </p>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 border-t border-gray-200 px-4 pt-6 lg:px-0">
        <p className="text-center text-sm tracking-tighter text-gray-500">
          © 2025, Bazaar. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

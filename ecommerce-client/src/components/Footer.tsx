// components/Footer.tsx
//import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

import {
  FaceFrownIcon,
  HandThumbDownIcon,
  InboxStackIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="bg-white text-black  mt-32">
      <div className="container mx-auto text-center ">
        <img
          src="/logo.jpg"
          alt="Nike Logo"
          width={70}
          height={70}
          className="mx-auto"
        />
        <div className="flex justify-center space-x-6 mt-4 font-sans font-medium text-sm">
          <a href="#" className="hover:underline">
            Find a Store
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
          <a href="#" className="hover:underline">
            Join Us
          </a>
          <a href="#" className="hover:underline">
            Sign In
          </a>
        </div>
      </div>
      <div className="container mx-auto mt-32 grid grid-cols-1 md:grid-cols-4 gap-6 px-6 md:px-20  ">
        <div className="">
          <h3 className="font-semibold">Featured</h3>
          <ul className="text-[#777] font-medium flex flex-col gap-2 mt-2 text-sm">
            <li>Air Force 1</li>
            <li>Jordan 1</li>
            <li>Air Max Dn</li>
            <li>Vomero</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Shoes</h3>
          <ul className="text-[#777] font-medium flex flex-col gap-2 mt-2 text-sm">
            <li>All Shoes</li>
            <li>Jordan Shoes</li>
            <li>Running Shoes</li>
            <li>Basketball Shoes</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Clothing</h3>
          <ul className="text-[#777] font-medium flex flex-col gap-2 mt-2 text-sm">
            <li>All Clothing</li>
            <li>Tops & T-Shirts</li>
            <li>Shorts</li>
            <li>Hoodies & Pullovers</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Kids</h3>
          <ul className="text-[#777] font-medium flex flex-col gap-2 mt-2 text-sm">
            <li>Infant & Toddler Shoes</li>
            <li>Kids Shoes</li>
            <li>Kids Basketball Shoes</li>
            <li>Kids Running Shoes</li>
          </ul>
        </div>
      </div>
      <div className="container mt-32">
        <hr />
      </div>
      {/* Top Links Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5  mt-8 gap-6 text-sm ">
        {/* Featured */}
        <div>
          <h3 className="font-semibold mb-3">FEATURED</h3>
          <ul className="space-y-2 text-[#777] text-sm font-medium">
            <li>
              <a href="#" className="hover:text-white">
                Air Force 1
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Jordan 1
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Metcon
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Nike SB
              </a>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold mb-3">HELP</h3>
          <ul className="space-y-2 text-[#777] text-sm font-medium">
            <li>
              <a href="#" className="hover:text-white">
                Get Help
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Order Status
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Payment Options
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="font-semibold mb-3">COMPANY</h3>
          <ul className="space-y-2 text-[#777] text-sm font-medium">
            <li>
              <a href="#" className="hover:text-white">
                About Nike
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                News
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Investors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Sustainability
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-3">FOLLOW US</h3>
          <div className="flex space-x-4 text-[#777] text-sm font-medium">
            <a href="#" className="hover:text-white">
              {/* <FaFacebook size={20} /> */}
              <FaceFrownIcon className="w-5" />
            </a>
            <a href="#" className="hover:text-white">
              {/* <FaTwitter size={20} /> */}
              <HandThumbDownIcon className="w-5" />
            </a>
            <a href="#" className="hover:text-white">
              {/* <FaInstagram size={20} /> */}
              <InboxStackIcon className="w-5" />
            </a>
            <a href="#" className="hover:text-white">
              {/* <FaYoutube size={20} /> */}
              <StarIcon className="w-5" />
            </a>
          </div>
        </div>

        {/* Nike Apps */}
        <div>
          <h3 className="font-semibold mb-3">NIKE APPS</h3>
          <ul className="space-y-2 text-[#777] text-sm font-medium">
            <li>
              <a href="#" className="hover:text-white">
                Nike App
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Nike Training Club
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Nike Run Club
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 text-gray-400 text-xs py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between">
          {/* Location */}
          <div className="flex items-center space-x-2">
            <span>🌍 Egypt</span>
            <span className="text-gray-600">
              © {new Date().getFullYear()} Nike, Inc. All Rights Reserved.
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Guides
            </a>
            <a href="#" className="hover:text-white">
              Terms of Sale
            </a>
            <a href="#" className="hover:text-white">
              Terms of Use
            </a>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

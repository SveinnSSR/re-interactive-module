// src/components/layout/Footer.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const footerSections = {
  company: {
    title: 'Reykjavik Excursions',
    links: [
      { name: 'About us', href: '#' },
      { name: 'Environmental Policy', href: '#' },
      { name: 'Employees', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Vakinn Certification', href: '#' },
      { name: 'Coach Hire in Iceland', href: '#' },
      { name: 'Rent a Car', href: '#' },
      { name: 'Tailor Made for Groups', href: '#' },
      { name: 'Private Tours', href: '#' },
      { name: 'Brochures', href: '#' },
    ]
  },
  tours: {
    title: 'Popular Tours',
    links: [
      { name: 'Golden Circle Tours', href: '#' },
      { name: 'South Coast Tours', href: '#' },
      { name: 'Adventure Bus', href: '#' },
      { name: 'Highland Bus', href: '#' },
      { name: 'Adventure Tours', href: '#' },
      { name: 'Hop On Hop Off', href: '#' },
      { name: 'Special Offers', href: '#' },
      { name: 'Reykjavik City Tours', href: '#' },
      { name: 'Blue Lagoon Tours', href: '#' },
      { name: 'Northern Lights Tours', href: '#' },
    ]
  },
  info: {
    title: 'Need More Info?',
    links: [
      { name: 'FAQ', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Pick Up Locations', href: '#' },
      { name: 'Tour Status', href: '#' },
      { name: 'Customer Support', href: '#' },
    ]
  },
  contact: {
    title: 'Get in touch',
    address: [
      'Reykjavik Excursions by Icelandia',
      'BSÍ Bus Terminal',
      '101 Reykjavík',
      'Iceland',
      'Phone: +354 599 0000'
    ]
  }
};

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-6">{footerSections.company.title}</h3>
            <ul className="space-y-4">
              {footerSections.company.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tours */}
          <div>
            <h3 className="font-semibold mb-6">{footerSections.tours.title}</h3>
            <ul className="space-y-4">
              {footerSections.tours.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Need More Info */}
          <div>
            <h3 className="font-semibold mb-6">{footerSections.info.title}</h3>
            <ul className="space-y-4">
              {footerSections.info.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-blue-600">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-6">{footerSections.contact.title}</h3>
            <ul className="space-y-4">
              {footerSections.contact.address.map((line) => (
                <li key={line} className="text-gray-600">
                  {line}
                </li>
              ))}
              <li>
                <Link href="#" className="text-blue-600 hover:text-blue-700">
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div>
              <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">
                Agent login
              </button>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <Facebook size={24} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <Instagram size={24} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600">
                  <Youtube size={24} />
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-wrap gap-4 md:justify-end items-center">
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Cookies
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Terms and Conditions
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Privacy Policy
              </Link>
              <div className="text-sm text-gray-600">
                Reykjavik Excursions {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

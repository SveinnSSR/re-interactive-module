// src/components/layout/Header.tsx
import React from 'react';
import { Search, Globe, ShoppingCart } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from 'next/image';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image 
              src="/images/logo.png" 
              alt="Reykjavik Excursions" 
              width={150}
              height={50}
              className="h-10 w-auto"
            />
          </div>

          {/* Main Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base font-medium">
                  Tours & Activities
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">Northern Lights Tours</li>
                    <li className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">Golden Circle Tours</li>
                    <li className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">South Coast Tours</li>
                    <li className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">Blue Lagoon Tours</li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-base font-medium px-3 py-2">
                  Airport Transfer
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-base font-medium px-3 py-2">
                  Private Tours
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-base font-medium px-3 py-2">
                  Tour Status
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Items */}
          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-gray-50 rounded-full">
              <Search className="h-5 w-5" />
            </button>
            
            {/* Currency Selector */}
            <button className="hidden lg:flex items-center text-sm font-medium">
              ISK
            </button>
            
            {/* Language Selector */}
            <button className="hidden lg:flex items-center gap-1">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">EN</span>
            </button>
            
            {/* My Booking Button */}
            <button className="hidden lg:inline-flex items-center px-4 py-2 text-blue-600 font-medium border border-blue-600 rounded hover:bg-blue-50">
              My Booking
            </button>
            
            {/* Cart */}
            <button className="p-2 hover:bg-gray-50 rounded-full">
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

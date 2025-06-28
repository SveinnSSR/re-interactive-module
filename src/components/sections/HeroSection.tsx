// src/components/sections/HeroSection.tsx
"use client";

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image (includes special offer badge) */}
      <div className="absolute inset-0">
        <Image 
          src="/images/hero/background.webp"
          alt="Iceland Landscape"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold mb-12 text-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              START YOUR ADVENTURE NOW
            </h1>

            {/* Search Box */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {/* When */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    When
                  </label>
                  <button className="w-full flex items-center justify-between px-4 py-3 border rounded-md bg-white text-gray-700 hover:border-gray-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span>Any Time</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Type of Tour */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2">
                    Type of Tour
                  </label>
                  <button className="w-full flex items-center justify-between px-4 py-3 border rounded-md bg-white text-gray-700 hover:border-gray-400 transition-colors">
                    <span>All Tours</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                    <span>Search</span>
                    <span className="text-xl">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

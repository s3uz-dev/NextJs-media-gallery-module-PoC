'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import React from 'react';

const logos = [
  {
    name: 'Next.js',
    src: '/logos/next-light.svg', 
    srcDark: '/logos/next-dark.svg', 
    url: 'https://nextjs.org/',
  },
  {
    name: 'Drizzle',
    src: '/logos/drizzle-light.svg',
    srcDark: '/logos/drizzle-light.svg',
    url: 'https://orm.drizzle.team/',
  },
  {
    name: 'Turso',
    src: '/logos/turso-light.svg',
    srcDark: '/logos/turso-light.svg',
    url: 'https://turso.tech/',
  },
  {
    name: 'Cloudinary',
    src: '/logos/Cloudinary.svg',
    srcDark: '/logos/Cloudinary.svg',
    url: 'https://cloudinary.com/',
  },
  {
    name: 'TanStack',
    src: '/logos/logo-color-100w-br5_Ikqp.png',
    srcDark: '/logos/logo-color-100w-br5_Ikqp.png',
    url: 'https://tanstack.com/',
  },
  {
    name: 'Hono',
    src: '/logos/hono-seeklogo.svg',
    srcDark  : '/logos/hono-seeklogo.svg',
    url: 'https://hono.dev/',
  },
];

export const TechHeader = () => {
  const { theme,   } = useTheme()
  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-2xl font-bold text-center text-foreground">
         PoC Galeria Multimedia
        </h1>
        <p className='text-small'>Tecnologias</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {logos.map((logo, index) => (
            <a
              key={index}
              href={  logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Image
                src={ theme === 'light' ? logo.src : logo.srcDark }
                alt={logo.name}
                width={80}
                height={40}
                className="h-8 w-auto object-contain"
              />
              <span className="sr-only">{logo.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
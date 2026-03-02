"use client"

import React, { useState, useEffect } from 'react'
import Container from './Container'
import Link from 'next/link'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import MobileMenu from './MobileMenu'

const Header = () => {
    const [scrolled, setScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks: { label: string, href: string }[] = [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Blog', href: '#' },
    ]

    return (
        <header className={cn(
            'fixed top-0 left-0 w-full py-2 z-50 text-xs transition-colors duration-300',
            scrolled
                ? 'bg-background border-b dark:border-b-gray-800 border-b-gray-300'
                : 'bg-transparent border-b-transparent'
        )}>
            <Container>
                <div className='flex items-center justify-between'>
                    <div><Link href={'/'}>
                        <Image className='hidden dark:block' src="/logo.png" alt="Logo" width={40} height={40} />
                        <Image className='dark:hidden' src="/logolight.png" alt="Logo" width={40} height={40} />
                    </Link></div>
                    <nav className='hidden md:block'>
                        <ul className='flex gap-3 items-center'>
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className='link--mneme link'><span>{link.label}</span></Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className='flex items-center gap-3'>
                        <Button
                            variant={'ghost'}
                            className='cursor-pointer text-primary md:hidden'
                            onClick={() => setIsMenuOpen(true)}
                        >
                            [Menu]
                        </Button>
                        <Button animate className='uppercase text-[10px] rounded-xs cursor-pointer hidden md:block'>Start a project</Button>
                        <AnimatedThemeToggler />
                    </div>
                </div>
            </Container>

            <MobileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                navLinks={navLinks}
            />
        </header>
    )
}

export default Header
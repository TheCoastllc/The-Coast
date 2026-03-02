"use client"

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    navLinks: { label: string, href: string }[]
}

const MobileMenu = ({ isOpen, onClose, navLinks }: MobileMenuProps) => {
    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }}
                    animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                    exit={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
                    transition={{ duration: 0.9, ease: [0.8, 0, 0.1, 1] }}
                    className="fixed inset-0 z-60 md:hidden bg-background flex flex-col justify-between p-8"
                >
                    {/* Abstract Grid background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
                        <div className="grid grid-cols-12 h-screen w-screen border-l border-primary/20">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="border-r border-primary/20" />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-start relative z-10 pt-2 border-t border-primary/20">
                        <span className="text-[10px] tracking-widest uppercase opacity-40 font-mono">The Coast</span>
                        <button
                            onClick={onClose}
                            className="p-2 text-primary hover:skew-x-12 transition-transform duration-300 font-mono text-sm"
                            aria-label="Close menu"
                        >
                            [EXIT]
                        </button>
                    </div>

                    <nav className="relative z-10">
                        <ul className="flex flex-col gap-0 divide-y divide-primary/5">
                            {navLinks.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + index * 0.08, duration: 0.6, ease: "circOut" }}
                                    className="group"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={onClose}
                                        className="flex items-baseline gap-6 py-4 overflow-hidden"
                                    >
                                        <span className="text-primary font-mono text-xs tabular-nums group-hover:text-primary transition-colors">
                                            0{index + 1}
                                        </span>
                                        <div className="relative overflow-hidden">
                                            <span className="text-4xl md:text-8xl font-black uppercase tracking-tighter block transition-all duration-500 group-hover:translate-x-4">
                                                {link.label}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </nav>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 pb-4">
                        <div className="flex gap-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ delay: 1 }}
                                className="flex flex-col gap-1"
                            >
                                <span className="text-[10px] uppercase tracking-tighter font-bold mb-2">Connect</span>
                                <span className="cursor-pointer hover:text-primary transition-all text-xs border-b border-transparent hover:border-primary">Instagram</span>
                                <span className="cursor-pointer hover:text-primary transition-all text-xs border-b border-transparent hover:border-primary">X / Twitter</span>
                                <span className="cursor-pointer hover:text-primary transition-all text-xs border-b border-transparent hover:border-primary">LinkedIn</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ delay: 1.1 }}
                                className="hidden sm:flex flex-col gap-1"
                            >
                                <span className="text-[10px] uppercase tracking-tighter font-bold mb-2">Location</span>
                                <span className="text-xs">Based in Lagos</span>
                                <span className="text-xs">Available Globally</span>
                            </motion.div>
                        </div>

                        <div className="text-right">
                            <div className="text-[40px] md:text-[80px] font-black leading-none opacity-[0.05] absolute -bottom-4 right-0 pointer-events-none uppercase">
                                The Coast
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default MobileMenu

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const MESSAGES = ["STUDIO", "ACTIVE"];

export function LiveIndicator() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="flex items-center justify-center gap-2.5 px-4 py-2 rounded-sm 
                 bg-transparent border border-white/10 backdrop-blur-sm
                 overflow-hidden whitespace-nowrap"
        >
            {/* Pulsing Dot */}
            <div className="relative flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#76f042] shrink-0" />
                <motion.div
                    className="absolute h-1.5 w-1.5 rounded-full bg-[#76f042]"
                    animate={{
                        boxShadow: [
                            "0 0 0 0px rgba(118, 240, 66, 0.4)",
                            "0 0 0 6px rgba(118, 240, 66, 0)",
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Text Switcher */}
            <div className="flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={MESSAGES[index]}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="text-white font-mono font-medium text-[10px] uppercase leading-none"
                    >
                        {MESSAGES[index]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
}
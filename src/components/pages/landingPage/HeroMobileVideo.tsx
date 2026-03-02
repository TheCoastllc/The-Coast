'use client'

import React, { useEffect, useRef } from 'react'

const HeroMobileVideo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
            videoRef.current.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });
        }
    }, []);

    return (
        <div id="hero-initial-video" className='overflow-hidden rounded-lg'>
            <video
                ref={videoRef}
                className='h-[200px] p-0 opacity-100 md:opacity-0'
                playsInline
                autoPlay
                muted
                loop
            >
                <source src="coastVid.webm" type="video/webm" />
            </video>
        </div>
    )
}

export default HeroMobileVideo

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import gsap from 'gsap';

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585110396065-88b770d45474?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=800&auto=format&fit=crop"
];

const HeroSlider = ({ pets }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const headingRef = useRef(null);
    const infoRef = useRef(null);

    // Prepare content (either real pets or fallback images)
    const items = pets && pets.length > 0 ? pets : FALLBACK_IMAGES.map((url, i) => ({
        _id: `fallback-${i}`,
        name: "Adopt Me",
        images: [url],
        fallback: true
    }));

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 3500); // 3.5 seconds
        return () => clearInterval(interval);
    }, [items.length]);

    // GSAP Animation for "ADOPT ME"
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".letter",
                { opacity: 0, x: -50, rotateY: 90 },
                {
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.7)",
                    repeat: -1,
                    repeatDelay: 3
                }
            );
        }, headingRef);

        return () => ctx.revert();
    }, []);

    // Animate Info on Slide Change
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(infoRef.current.children,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    delay: 0.5,
                    stagger: 0.3
                }
            );
        }, infoRef); // Scope to infoRef just in case, though simple ref is fine
        return () => ctx.revert();
    }, [currentIndex]);

    const handleNext = (e) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = (e) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    // Get current item
    const currentItem = items[currentIndex];
    const imageSrc = currentItem.fallback ? currentItem.images[0] : (currentItem.images && currentItem.images.length > 0 ? currentItem.images[0] : FALLBACK_IMAGES[0]);

    return (
        <div className="relative w-full h-screen overflow-hidden group">
            {/* Background Image with Scale Effect */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
                style={{ backgroundImage: `url(${imageSrc})` }}
            >
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Left Aligned Content Overlay */}
            <div className="relative z-10 h-full flex flex-col items-start justify-center text-left pl-8 md:pl-32 pr-4 max-w-4xl">

                {/* 1. Main Heading - Custom Font & GSAP Animation */}
                <h1
                    ref={headingRef}
                    className="text-6xl md:text-8xl tracking-wide text-white mb-4 drop-shadow-2xl leading-none"
                    style={{ fontFamily: '"BBH Bartle Static", sans-serif', fontWeight: 900 }}
                >
                    {"ADOPT ME".split("").map((char, index) => (
                        <span key={index} className="inline-block letter perspective-1000">
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </h1>

                {/* 2. Pet Info Card */}
                <div ref={infoRef} className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-pastel-peach drop-shadow-md mb-2">
                        Meet {currentItem.name}
                    </h2>
                    {!currentItem.fallback && (
                        <p className="text-xl md:text-2xl text-gray-100 font-medium ml-1">
                            {currentItem.breed} • {currentItem.age} Years Old
                        </p>
                    )}
                </div>

                {/* 3. Action Button */}
                <Link to="/browse-pets">
                    <button className="bg-white text-gray-900 hover:bg-pastel-purple hover:text-white font-bold px-12 py-5 rounded-full shadow-2xl transition-all duration-300 text-xl md:text-2xl flex items-center gap-3 transform hover:-translate-y-1">
                        Browse Pets
                        <FaArrowRight />
                    </button>
                </Link>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 border border-white/20"
            >
                <FaArrowLeft className="text-xl" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 border border-white/20"
            >
                <FaArrowRight className="text-xl" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {items.slice(0, 5).map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === (currentIndex % 5) ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`}
                        onClick={() => setCurrentIndex(idx)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;

import React from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585110396065-88b770d45474?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=800&auto=format&fit=crop"
];

function Marquee({ text, pets, className = '' }) {
    return (
        <div className={`overflow-hidden w-full h-full absolute inset-0 z-0 ${className}`}>
            <div className='moveX flex absolute top-1/2 -translate-y-1/2 w-max items-center'>
                {[...Array(2)].map((_, idx) => (
                    <div key={idx} className='flex items-center whitespace-nowrap flex-shrink-0 pr-16'>
                        {pets && pets.length > 0 ? (
                            <div className="flex items-center gap-16">
                                {pets.map((pet, i) => (
                                    <Link key={i} to="/browse-pets" className="group relative w-40 md:w-64 h-64 md:h-80 flex-shrink-0 cursor-pointer block">
                                        <img
                                            src={pet.images && pet.images.length > 0 ? pet.images[0] : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                                            alt={pet.name}
                                            className="h-full w-full object-cover rounded-3xl shadow-lg opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                                        />

                                        {/* Hover Info Overlay */}
                                        <div className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                            <h3 className="font-bold text-xl">{pet.name}</h3>
                                            <p className="text-sm text-gray-200">{pet.breed}</p>
                                            <p className="text-xs text-gray-300 mt-1">{pet.age} yrs • {pet.gender}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-16">
                                {FALLBACK_IMAGES.map((img, i) => (
                                    <Link key={i} to="/browse-pets" className="group relative w-40 md:w-64 h-64 md:h-80 flex-shrink-0 cursor-pointer block">
                                        <img
                                            src={img}
                                            alt="Pet"
                                            className="h-full w-full object-cover rounded-3xl shadow-lg opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 grayscale hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg tracking-widest">ADOPT</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Marquee;

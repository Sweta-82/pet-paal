import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const PetCard = ({ pet }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: cardRef.current, start: "top 90%" } }
    );
  }, []);

  return (
    <div ref={cardRef} className="bg-white border border-gray-100 rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative overflow-hidden h-56">
        <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 font-display">{pet.name}</h3>
        <p className="text-gray-600 text-sm mb-4 font-medium opacity-80">{pet.breed} • {pet.age} years old</p>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/40">
          <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${pet.category === 'Dog' ? 'bg-pastel-blue/20 text-pastel-blue' : 'bg-pastel-pink/20 text-pastel-pink'}`}>
            {pet.category}
          </span>
          <Link to={`/pets/${pet._id}`} className="text-pastel-purple hover:text-pastel-pink font-bold text-sm transition-colors flex items-center gap-1 group/link">
            View Details <span className="group-hover/link:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;

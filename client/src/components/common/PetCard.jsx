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
    <div ref={cardRef} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <img src={pet.images[0]} alt={pet.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{pet.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{pet.breed} • {pet.age} years old</p>
        <div className="flex justify-between items-center mt-4">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${pet.category === 'Dog' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
            {pet.category}
          </span>
          <Link to={`/pets/${pet._id}`} className="text-forest-green hover:text-green-700 font-medium text-sm">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;

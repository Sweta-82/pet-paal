import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPets } from '../../redux/slices/petSlice';

const FeaturedPets = () => {
  const dispatch = useDispatch();
  const { pets, loading } = useSelector((state) => state.pets);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    dispatch(fetchPets({ limit: 4 })); // Assuming fetchPets can handle limit or we just slice
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              cardsRef.current,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [pets]);

  // Display only first 4 pets
  const featuredPets = pets.slice(0, 4);

  return (
    <section ref={sectionRef} className="py-16 bg-warm-beige/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Pets</h2>
            <p className="mt-2 text-gray-600">Meet some of our newest arrivals waiting for a home.</p>
          </div>
          <Link to="/browse" className="hidden sm:block text-forest-green font-semibold hover:text-green-700">
            View All Pets &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading pets...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.map((pet, index) => (
              <div
                key={pet._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={pet.images[0] || 'https://via.placeholder.com/300'}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-500">{pet.breed}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {pet.age} yrs
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/pets/${pet._id}`}
                      className="block w-full text-center bg-off-white text-forest-green border border-forest-green py-2 rounded-md hover:bg-forest-green hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/browse" className="text-forest-green font-semibold hover:text-green-700">
            View All Pets &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;

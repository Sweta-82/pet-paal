import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPets } from '../redux/slices/petSlice';
import InfoCard from '../components/home/InfoCard';
import HeroSlider from '../components/home/HeroSlider';


function HomePage() {
  const dispatch = useDispatch();
  const { pets } = useSelector((state) => state.pets);

  useEffect(() => {
    dispatch(fetchPets());
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-pastel-bg bg-opacity-50">

      {/* --- HERO SECTION: FULL SCREEN IMMERSIVE --- */}
      <HeroSlider pets={pets} />





      {/* --- HOW IT WORKS GRID --- */}
      <div className="bg-pastel-bg py-24 relative overflow-hidden">
        <div className="text-center mb-16 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">How Pet-Paal Works</h2>
          <div className="h-1 w-24 bg-pastel-pink mx-auto rounded-full"></div>
        </div>
        <InfoCard />
      </div>

    </div >
  )
}

export default HomePage;

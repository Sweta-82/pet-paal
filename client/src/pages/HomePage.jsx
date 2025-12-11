import React from 'react';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import FeaturedPets from '../components/home/FeaturedPets';
import Testimonials from '../components/home/Testimonials';
import CallToAction from '../components/home/CallToAction';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <FeaturedPets />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FaSearch, FaPaw, FaHome } from 'react-icons/fa';

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              stepsRef.current,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const steps = [
    {
      icon: <FaSearch className="w-12 h-12 text-forest-green" />,
      title: 'Search',
      description: 'Browse through hundreds of pets from local shelters. Filter by breed, age, and size to find your perfect match.',
    },
    {
      icon: <FaPaw className="w-12 h-12 text-terracotta" />,
      title: 'Meet',
      description: 'Connect with shelters, ask questions, and schedule a visit to meet your potential new family member.',
    },
    {
      icon: <FaHome className="w-12 h-12 text-forest-green" />,
      title: 'Adopt',
      description: 'Complete the adoption process and bring your new best friend home. We support you every step of the way.',
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How Pet-Paal Works
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Simple steps to finding your forever friend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (stepsRef.current[index] = el)}
              className="flex flex-col items-center text-center p-6 bg-off-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

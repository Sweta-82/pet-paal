import React from 'react';
import { FaPaw, FaDog, FaCat, FaStethoscope } from 'react-icons/fa';

const ResourcesPage = () => {
  const resources = [
    {
      id: 1,
      category: 'General Care',
      title: 'Preparing Your Home for a New Pet',
      summary: 'Essential tips for pet-proofing your house and creating a welcoming environment for your new family member.',
      icon: <FaPaw className="w-8 h-8 text-pastel-purple" />,
    },
    {
      id: 2,
      category: 'Dog Care',
      title: 'Understanding Dog Body Language',
      summary: 'Learn to interpret your dog\'s signals to better communicate and build a strong bond.',
      icon: <FaDog className="w-8 h-8 text-pastel-pink" />,
    },
    {
      id: 3,
      category: 'Cat Care',
      title: 'Litter Box Training 101',
      summary: 'A comprehensive guide to litter box training your kitten or adult cat successfully.',
      icon: <FaCat className="w-8 h-8 text-pastel-purple" />,
    },
    {
      id: 4,
      category: 'Health',
      title: 'Vaccination Schedule Guide',
      summary: 'Keep your pet healthy with this standard vaccination schedule for dogs and cats.',
      icon: <FaStethoscope className="w-8 h-8 text-pastel-pink" />,
    },
    {
      id: 5,
      category: 'Nutrition',
      title: 'Choosing the Right Food',
      summary: 'How to select high-quality food that meets your pet\'s nutritional needs at every life stage.',
      icon: <FaPaw className="w-8 h-8 text-pastel-purple" />,
    },
    {
      id: 6,
      category: 'Training',
      title: 'Positive Reinforcement Basics',
      summary: 'Why positive reinforcement is the most effective and humane way to train your pet.',
      icon: <FaDog className="w-8 h-8 text-pastel-pink" />,
    },
  ];

  return (
    <div className="min-h-screen bg-pastel-bg bg-opacity-50 pt-32 pb-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 sm:text-6xl drop-shadow-sm mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pet Care Resources
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Expert advice and tips to help you provide the best care for your furry friend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-gradient-to-br from-white/90 to-pastel-purple/10 backdrop-blur-xl rounded-3xl shadow-xl shadow-pastel-purple/10 border border-white/60 overflow-hidden hover:shadow-pastel-purple/20 hover:-translate-y-2 transition-all duration-300 group">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-pastel-pink/10 text-pastel-purple text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {resource.category}
                  </span>
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <img src="https://i.pinimg.com/originals/43/41/18/4341180955ce9c0004bab4de327239de.gif" alt="icon" className="w-16 h-16 object-contain" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-pastel-purple transition-colors">{resource.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{resource.summary}</p>
                <button className="text-pastel-purple font-bold hover:text-pastel-pink transition-colors flex items-center gap-2">
                  Read Article <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-pastel-purple to-pastel-pink rounded-3xl p-12 text-center text-white shadow-2xl shadow-pastel-purple/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-50 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">Have a specific question?</h2>
          <p className="mb-8 text-lg text-white/90 relative z-10">Our community of experts and experienced pet owners is here to help.</p>
          <button className="bg-white text-pastel-purple font-bold py-3.5 px-8 rounded-2xl hover:bg-gray-50 hover:shadow-lg hover:scale-105 transition-all relative z-10">
            Ask the Community (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;

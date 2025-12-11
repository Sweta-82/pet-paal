import React from 'react';
import { FaPaw, FaDog, FaCat, FaStethoscope } from 'react-icons/fa';

const ResourcesPage = () => {
  const resources = [
    {
      id: 1,
      category: 'General Care',
      title: 'Preparing Your Home for a New Pet',
      summary: 'Essential tips for pet-proofing your house and creating a welcoming environment for your new family member.',
      icon: <FaPaw className="w-8 h-8 text-forest-green" />,
    },
    {
      id: 2,
      category: 'Dog Care',
      title: 'Understanding Dog Body Language',
      summary: 'Learn to interpret your dog\'s signals to better communicate and build a strong bond.',
      icon: <FaDog className="w-8 h-8 text-terracotta" />,
    },
    {
      id: 3,
      category: 'Cat Care',
      title: 'Litter Box Training 101',
      summary: 'A comprehensive guide to litter box training your kitten or adult cat successfully.',
      icon: <FaCat className="w-8 h-8 text-yellow-600" />,
    },
    {
      id: 4,
      category: 'Health',
      title: 'Vaccination Schedule Guide',
      summary: 'Keep your pet healthy with this standard vaccination schedule for dogs and cats.',
      icon: <FaStethoscope className="w-8 h-8 text-blue-600" />,
    },
    {
      id: 5,
      category: 'Nutrition',
      title: 'Choosing the Right Food',
      summary: 'How to select high-quality food that meets your pet\'s nutritional needs at every life stage.',
      icon: <FaPaw className="w-8 h-8 text-forest-green" />,
    },
    {
      id: 6,
      category: 'Training',
      title: 'Positive Reinforcement Basics',
      summary: 'Why positive reinforcement is the most effective and humane way to train your pet.',
      icon: <FaDog className="w-8 h-8 text-terracotta" />,
    },
  ];

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Pet Care Resources
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Expert advice and tips to help you provide the best care for your furry friend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {resource.category}
                  </span>
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.summary}</p>
                <button className="text-forest-green font-semibold hover:text-green-700 transition-colors">
                  Read Article &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-forest-green rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Have a specific question?</h2>
          <p className="mb-6">Our community of experts and experienced pet owners is here to help.</p>
          <button className="bg-white text-forest-green font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Ask the Community (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;

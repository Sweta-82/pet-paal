import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPets } from '../redux/slices/petSlice';
import PetCard from '../components/common/PetCard';

const BrowsePetsPage = () => {
  const dispatch = useDispatch();
  const { pets, loading, error } = useSelector((state) => state.pets);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');

  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  const location = selectedLocation === 'Other' ? customLocation : selectedLocation;
  const category = selectedCategory === 'Other' ? customCategory : selectedCategory;

  useEffect(() => {
    dispatch(fetchPets({ category, age, breed, location }));
  }, [dispatch, category, age, breed, location]);

  return (
    <div className="min-h-screen bg-pastel-bg bg-opacity-50 pt-28 pb-10 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Find Your Best Friend</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-xl shadow-pastel-purple/10 border border-white/60 h-fit transition-all duration-300 hover:shadow-pastel-purple/20">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b border-pastel-pink/30 pb-2">Filters</h2>
          <div className="space-y-5">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 pl-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  if (e.target.value !== 'Other') {
                    setCustomLocation('');
                  }
                }}
                className="w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all hover:bg-white/80"
              >
                <option value="">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Other">Other</option>
              </select>
              {selectedLocation === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify Location..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="mt-3 w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 pl-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value !== 'Other') {
                    setCustomCategory('');
                  }
                }}
                className="w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all hover:bg-white/80"
              >
                <option value="">All Categories</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
              {selectedCategory === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify Category..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-3 w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 pl-1">Age</label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all hover:bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 pl-1">Breed</label>
              <input
                type="text"
                placeholder="Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all hover:bg-white/80"
              />
            </div>
          </div>
        </div>

        {/* Pet Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-purple"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl shadow-sm relative text-center" role="alert">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
              {pets.length === 0 && (
                <div className="col-span-full text-center py-20 flex flex-col items-center justify-center opacity-60">
                  <p className="text-gray-500 text-xl font-medium">No pets found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePetsPage;

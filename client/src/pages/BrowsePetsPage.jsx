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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Pets</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-lg font-semibold mb-4 text-forest-green">Filters</h2>
          <div className="space-y-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  if (e.target.value !== 'Other') {
                    setCustomLocation('');
                  }
                }}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm border p-2"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value !== 'Other') {
                    setCustomCategory('');
                  }
                }}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm border p-2"
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
                  className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm border p-2"
                />
              )}
              {selectedCategory === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify Category..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2 w-full border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm border p-2"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
              <input
                type="text"
                placeholder="Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-forest-green focus:border-forest-green sm:text-sm border p-2"
              />
            </div>
          </div>
        </div>

        {/* Pet Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
              {pets.length === 0 && <p className="text-gray-500 col-span-full text-center py-10">No pets found matching your criteria.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePetsPage;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { deletePet, fetchPetDetails } from '../redux/slices/petSlice';
import { FaHeart, FaMapMarkerAlt, FaPaw } from 'react-icons/fa';

const PetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pet, loading, error } = useSelector((state) => state.pets);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPetDetails(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      await dispatch(deletePet(pet._id));
      navigate('/dashboard');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green"></div></div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!pet) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/browse" className="text-forest-green hover:underline mb-4 inline-block">&larr; Back to Browse</Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery (Placeholder for now, just showing first image) */}
          <div className="md:w-1/2">
            <img src={pet.images[0]} alt={pet.name} className="w-full h-96 object-cover" />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <FaMapMarkerAlt className="mr-1" /> {pet.location || pet.shelter?.location || 'Location not available'}
                </p>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <FaHeart className="h-8 w-8" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-off-white p-3 rounded-lg text-center">
                <span className="block text-xs text-gray-500 uppercase">Breed</span>
                <span className="font-semibold text-gray-800">{pet.breed}</span>
              </div>
              <div className="bg-off-white p-3 rounded-lg text-center">
                <span className="block text-xs text-gray-500 uppercase">Age</span>
                <span className="font-semibold text-gray-800">{pet.age} Years</span>
              </div>
              <div className="bg-off-white p-3 rounded-lg text-center">
                <span className="block text-xs text-gray-500 uppercase">Gender</span>
                <span className="font-semibold text-gray-800">{pet.gender}</span>
              </div>
              <div className="bg-off-white p-3 rounded-lg text-center">
                <span className="block text-xs text-gray-500 uppercase">Size</span>
                <span className="font-semibold text-gray-800">{pet.size}</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About {pet.name}</h3>
              <p className="text-gray-600 leading-relaxed">{pet.description}</p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              {userInfo && userInfo.role === 'adopter' ? (
                <>
                  <Link to={`/adoption-form/${pet._id}`} className="block text-center w-full bg-forest-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
                    Apply to Adopt {pet.name}
                  </Link>
                  <button
                    onClick={() => navigate('/chat', { state: { userId: pet.shelter._id, user: pet.shelter } })}
                    className="block text-center w-full bg-white text-forest-green border-2 border-forest-green py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Message Shelter
                  </button>
                </>
              ) : userInfo && userInfo.role === 'shelter' && userInfo._id === pet.shelter._id ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/pets/edit/${pet._id}`)}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <Link to="/login" className="block text-center w-full bg-forest-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
                  Login to Adopt
                </Link>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center text-gray-500 text-sm">
              <FaPaw className="mr-2 text-forest-green" />
              <span>Posted by {pet.shelter?.name || 'Unknown Shelter'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;

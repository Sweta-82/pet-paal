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
    <div className="min-h-screen bg-pastel-bg bg-opacity-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <Link to="/browse" className="text-pastel-purple hover:text-pastel-pink hover:underline mb-6 inline-block font-bold transition-colors">&larr; Back to Browse</Link>

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pastel-purple/20 border border-white/60 overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2 relative bg-gray-100">
            <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover min-h-[500px]" />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-5xl font-bold text-gray-800 drop-shadow-sm mb-2" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>{pet.name}</h1>
                <p className="text-gray-600 flex items-center text-lg">
                  <FaMapMarkerAlt className="mr-2 text-pastel-purple" /> {pet.location || pet.shelter?.location || 'Location not available'}
                </p>
              </div>
              <button className="text-gray-300 hover:text-pastel-pink transition-colors transform hover:scale-110">
                <FaHeart className="h-10 w-10" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/50 border border-pastel-pink/20 p-4 rounded-2xl text-center shadow-sm hover:shadow-md transition-all">
                <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Breed</span>
                <span className="font-bold text-gray-800 text-lg">{pet.breed}</span>
              </div>
              <div className="bg-white/50 border border-pastel-pink/20 p-4 rounded-2xl text-center shadow-sm hover:shadow-md transition-all">
                <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Age</span>
                <span className="font-bold text-gray-800 text-lg">{pet.age} Years</span>
              </div>
              <div className="bg-white/50 border border-pastel-pink/20 p-4 rounded-2xl text-center shadow-sm hover:shadow-md transition-all">
                <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Gender</span>
                <span className="font-bold text-gray-800 text-lg">{pet.gender}</span>
              </div>
              <div className="bg-white/50 border border-pastel-pink/20 p-4 rounded-2xl text-center shadow-sm hover:shadow-md transition-all">
                <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider">Size</span>
                <span className="font-bold text-gray-800 text-lg">{pet.size}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>About {pet.name}</h3>
              <p className="text-gray-600 leading-relaxed text-lg bg-white/40 p-6 rounded-2xl border border-white/50">{pet.description}</p>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              {userInfo && userInfo.role === 'adopter' ? (
                <>
                  <Link to={`/adoption-form/${pet._id}`} className="block text-center w-full bg-gradient-to-r from-pastel-purple to-pastel-pink hover:from-pastel-pink hover:to-pastel-purple text-white py-4 px-6 rounded-2xl font-bold shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-lg">
                    Apply to Adopt {pet.name}
                  </Link>
                  <button
                    onClick={() => navigate('/chat', { state: { userId: pet.shelter._id, user: pet.shelter, petId: pet._id, pet: pet } })}
                    className="block text-center w-full bg-white text-pastel-purple border-2 border-pastel-purple py-4 px-6 rounded-2xl font-bold hover:bg-pastel-purple hover:text-white transition-all shadow-sm"
                  >
                    Message Shelter
                  </button>
                </>
              ) : userInfo && userInfo.role === 'shelter' && userInfo._id === pet.shelter._id ? (
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/pets/edit/${pet._id}`)}
                    className="flex-1 bg-blue-500 text-white py-4 px-6 rounded-2xl font-bold hover:bg-blue-600 transition-colors shadow-md"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 text-white py-4 px-6 rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-md"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <Link to="/login" className="block text-center w-full bg-pastel-purple text-white py-4 px-6 rounded-2xl font-bold hover:bg-pastel-pink transition-colors shadow-lg">
                  Login to Adopt
                </Link>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center text-gray-400 text-sm font-medium">
              <FaPaw className="mr-2 text-pastel-pink" />
              <span>Posted by {pet.shelter?.name || 'Unknown Shelter'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;

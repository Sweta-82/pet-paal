import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../redux/slices/authSlice';
import { fetchMyApplications, fetchShelterApplications, updateApplicationStatus } from '../redux/slices/applicationSlice';
import { fetchShelterPets } from '../redux/slices/petSlice';
import { useForm } from 'react-hook-form';

const DashboardPage = () => {
  const { userInfo, loading: authLoading } = useSelector((state) => state.auth);
  const { applications, loading: appLoading } = useSelector((state) => state.applications);
  const { pets, loading: petsLoading } = useSelector((state) => state.pets);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm();

  // Local state for specific application status updates
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setValue('name', userInfo.name);
      setValue('email', userInfo.email);
      setValue('bio', userInfo.bio);
      setValue('location', userInfo.location);
      setValue('phone', userInfo.phone);

      if (userInfo.role === 'adopter') {
        dispatch(fetchMyApplications());
      } else if (userInfo.role === 'shelter') {
        dispatch(fetchShelterApplications());
        dispatch(fetchShelterPets());
      }
    }
  }, [navigate, userInfo, setValue, dispatch]);

  const onUpdateProfile = (data) => {
    dispatch(updateProfile(data));
  };

  const handleStatusUpdate = async (id, status) => {
    setStatusUpdatingId(id);
    await dispatch(updateApplicationStatus({ id, status }));
    setStatusUpdatingId(null);
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-pastel-bg bg-opacity-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome, {userInfo.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="md:col-span-1 bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-pastel-purple/10 border border-white/60 h-fit">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b border-pastel-pink/30 pb-2">Profile Details</h2>
          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1 pl-1">Name</label>
              <input type="text" {...register('name')} className="block w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1 pl-1">Email</label>
              <input type="email" {...register('email')} className="block w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1 pl-1">Phone</label>
              <input type="text" {...register('phone')} className="block w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1 pl-1">Location</label>
              <input type="text" {...register('location')} className="block w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1 pl-1">Bio</label>
              <textarea {...register('bio')} className="block w-full bg-white/50 border-pastel-pink/30 rounded-xl shadow-sm focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm border p-3 outline-none transition-all" rows="3"></textarea>
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-pastel-purple text-white py-3 px-4 rounded-2xl font-bold shadow-md hover:bg-pastel-pink hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 mt-4"
            >
              {authLoading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Role Specific Section */}
        <div className="md:col-span-2 space-y-8">
          {userInfo.role === 'adopter' ? (
            <>
              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-pastel-purple/10 border border-white/60">
                <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b border-pastel-pink/30 pb-2">My Applications</h2>
                {applications.length === 0 ? (
                  <p className="text-gray-500 italic">You haven't submitted any adoption applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app._id} className="bg-white/40 border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:bg-white/60 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{app.pet?.name || 'Unknown Pet'}</h3>
                          <p className="text-sm text-gray-600">Shelter: {app.shelter?.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Status: <span className={`font-bold ${app.status === 'Approved' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{app.status}</span></p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 font-medium">{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-pastel-purple/10 border border-white/60">
                <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b border-pastel-pink/30 pb-2">Favorite Pets</h2>
                <div className="text-center py-8 opacity-60">
                  <p className="text-gray-500">No favorites yet. Go browse some pets!</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-pastel-purple/10 border border-white/60">
                <div className="flex justify-between items-center mb-6 border-b border-pastel-pink/30 pb-2">
                  <h2 className="text-2xl font-bold text-gray-700">Manage Pets</h2>
                  <button onClick={() => navigate('/create-pet')} className="bg-pastel-pink text-white py-2 px-4 rounded-xl font-bold shadow-md hover:bg-pastel-purple hover:shadow-lg transform hover:scale-[1.02] transition-all text-sm">Add New Pet</button>
                </div>

                {petsLoading ? (
                  <div className="text-center py-4 text-gray-500">Loading pets...</div>
                ) : pets.length === 0 ? (
                  <p className="text-gray-500 mb-4">You haven't listed any pets yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pets.map((pet) => (
                      <div key={pet._id} className="bg-white/40 border border-white/50 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                        <img src={pet.images[0] || 'https://via.placeholder.com/150'} alt={pet.name} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{pet.name}</h3>
                          <p className="text-xs text-gray-500">{pet.breed} • {pet.age} yrs</p>
                          <p className={`text-xs font-bold mt-1 ${pet.status === 'Available' ? 'text-green-600' : 'text-gray-500'}`}>{pet.status}</p>
                          <button onClick={() => navigate(`/pets/edit/${pet._id}`)} className="text-pastel-purple text-xs font-bold mt-2 hover:text-pastel-pink transition-colors">Edit Pet</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-pastel-purple/10 border border-white/60">
                <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b border-pastel-pink/30 pb-2">Incoming Applications</h2>
                {applications.length === 0 ? (
                  <p className="text-gray-500 italic">No new applications.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app._id} className="bg-white/40 border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:bg-white/60">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">For: <span className="text-pastel-purple">{app.pet?.name}</span></h3>
                            <p className="text-sm text-gray-600">Applicant: <span className="font-medium">{app.adopter?.name}</span> ({app.adopter?.email})</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${app.status === 'Approved' ? 'bg-green-100 text-green-800' : app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</span>
                        </div>
                        <p className="text-gray-700 text-sm bg-white/50 p-4 rounded-xl mb-4 italic border border-gray-100">"{app.message}"</p>
                        {app.status === 'Pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Approved')}
                              disabled={statusUpdatingId === app._id}
                              className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-green-600 disabled:opacity-50 transition-all transform hover:scale-105"
                            >
                              {statusUpdatingId === app._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                              disabled={statusUpdatingId === app._id}
                              className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-red-600 disabled:opacity-50 transition-all transform hover:scale-105"
                            >
                              {statusUpdatingId === app._id ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

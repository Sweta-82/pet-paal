import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createApplication, resetSuccess } from '../redux/slices/applicationSlice';
import { fetchPetDetails } from '../redux/slices/petSlice';

const AdoptionFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { pet } = useSelector((state) => state.pets);
  const { loading, error, success } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchPetDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      dispatch(resetSuccess());
      navigate('/dashboard');
    }
  }, [success, navigate, dispatch]);

  const submitHandler = (data) => {
    dispatch(createApplication({ petId: id, message: data.message }));
  };

  if (!pet) return <div className="text-center py-10">Loading pet details...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen pt-32 transition-colors duration-500">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif" }}>Adopt {pet.name}</h1>

      <div className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-pastel-purple/20 border border-white/60">
        <div className="flex items-center mb-6">
          <img src={pet.images[0]} alt={pet.name} className="w-24 h-24 object-cover rounded-2xl shadow-md mr-6 border-2 border-white" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{pet.name}</h2>
            <p className="text-gray-600 font-medium">{pet.breed} • {pet.age} years old</p>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 pl-1">Why do you want to adopt {pet.name}?</label>
            <textarea
              rows="6"
              className={`w-full border ${errors.message ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-4 bg-white/50 transition-all resize-none`}
              placeholder="Tell us about your home, lifestyle, and experience with pets..."
              {...register("message", { required: "Please provide a reason for adoption" })}
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1 pl-1">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pastel-purple to-pastel-pink hover:from-pastel-pink hover:to-pastel-purple text-white py-3 px-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg transform hover:scale-[1.02] duration-300 text-lg"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdoptionFormPage;

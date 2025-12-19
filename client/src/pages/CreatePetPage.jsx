import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createPet, fetchPetDetails, updatePet } from '../redux/slices/petSlice';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur'];
const CATEGORIES = ['Dog', 'Cat', 'Other'];

const CreatePetPage = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, pet } = useSelector((state) => state.pets);

  React.useEffect(() => {
    if (id) {
      if (!pet || pet._id !== id) {
        dispatch(fetchPetDetails(id));
      } else {
        setValue('name', pet.name);
        setValue('age', pet.age);
        setValue('breed', pet.breed);

        if (CATEGORIES.includes(pet.category)) {
          setValue('category', pet.category);
        } else {
          setValue('category', 'Other');
          setValue('customCategory', pet.category);
        }

        setValue('gender', pet.gender);
        setValue('size', pet.size);
        setValue('description', pet.description);

        if (CITIES.includes(pet.location)) {
          setValue('location', pet.location);
        } else {
          setValue('location', 'Other');
          setValue('customLocation', pet.location);
        }
      }
    }
  }, [dispatch, id, pet, setValue]);

  const submitHandler = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', data.age);
    formData.append('breed', data.breed);

    const finalCategory = data.category === 'Other' ? data.customCategory : data.category;
    formData.append('category', finalCategory);

    formData.append('gender', data.gender);
    formData.append('size', data.size);
    formData.append('description', data.description);

    const finalLocation = data.location === 'Other' ? data.customLocation : data.location;
    formData.append('location', finalLocation);

    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i]);
      }
    }

    if (id) {
      dispatch(updatePet({ id, petData: formData })).then((res) => {
        if (!res.error) {
          navigate(`/pets/${id}`);
        }
      });
    } else {
      dispatch(createPet(formData)).then((res) => {
        if (!res.error) {
          navigate('/dashboard');
        }
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen pt-32 transition-colors duration-500">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 drop-shadow-sm text-center" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>
        {id ? 'Edit Pet Details' : 'List a New Pet'}
      </h1>

      <div className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl shadow-pastel-purple/20 border border-white/60">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Pet Name</label>
            <input
              type="text"
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 pl-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Category</label>
              <select
                className="w-full border border-pastel-pink/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all"
                {...register("category", { required: true })}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {watch('category') === 'Other' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Specify Category</label>
                <input
                  type="text"
                  className={`w-full border ${errors.customCategory ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all`}
                  {...register("customCategory", { required: "Please specify the category" })}
                />
                {errors.customCategory && <p className="text-red-500 text-xs mt-1 pl-1">{errors.customCategory.message}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Breed</label>
              <input
                type="text"
                className={`w-full border ${errors.breed ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all`}
                {...register("breed", { required: "Breed is required" })}
              />
              {errors.breed && <p className="text-red-500 text-xs mt-1 pl-1">{errors.breed.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Age (Years)</label>
              <input
                type="number"
                className={`w-full border ${errors.age ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all`}
                {...register("age", { required: "Age is required", min: 0 })}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1 pl-1">{errors.age.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Gender</label>
              <select
                className="w-full border border-pastel-pink/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all"
                {...register("gender", { required: true })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Size</label>
              <select
                className="w-full border border-pastel-pink/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all"
                {...register("size", { required: true })}
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Location</label>
              <select
                className={`w-full border ${errors.location ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all`}
                {...register("location", { required: "Location is required" })}
              >
                <option value="">Select Location</option>
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
              {errors.location && <p className="text-red-500 text-xs mt-1 pl-1">{errors.location.message}</p>}
            </div>
          </div>

          {watch('location') === 'Other' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Specify Location</label>
              <input
                type="text"
                className={`w-full border ${errors.customLocation ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all`}
                {...register("customLocation", { required: "Please specify the location" })}
              />
              {errors.customLocation && <p className="text-red-500 text-xs mt-1 pl-1">{errors.customLocation.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Description</label>
            <textarea
              rows="4"
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all resize-none`}
              {...register("description", { required: "Description is required" })}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1 pl-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 pl-1">Pet Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className={`w-full border ${errors.images ? 'border-red-500' : 'border-pastel-pink/30'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent sm:text-sm p-3 bg-white/50 transition-all`}
              {...register("images")}
            />
            <p className="text-xs text-gray-500 mt-1 pl-1">Upload one or more images (JPG, PNG, WebP)</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pastel-purple to-pastel-pink hover:from-pastel-pink hover:to-pastel-purple text-white py-3 px-4 rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg transform hover:scale-[1.02] duration-300 text-lg"
          >
            {loading ? (id ? 'Updating Pet...' : 'Adding Pet...') : (id ? 'Update Pet' : 'List Pet')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePetPage;

import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      content: "Adopting Luna was the best decision we ever made. The process with Pet-Paal was so smooth and transparent.",
      author: "Sarah Jenkins",
      role: "Adopter",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 2,
      content: "As a shelter, Pet-Paal has helped us connect with so many loving families. It's a game changer for animal welfare.",
      author: "Michael Chen",
      role: "Shelter Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 3,
      content: "I found my perfect running buddy, Max! The filtering options made it easy to find a high-energy dog.",
      author: "Emily Rodriguez",
      role: "Adopter",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Happy Tails</h2>
          <p className="mt-4 text-xl text-gray-500">
            Hear from our community of adopters and shelters.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-off-white p-6 rounded-xl shadow-sm">
              <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.author}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

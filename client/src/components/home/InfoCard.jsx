import React from 'react';

const data = [
    {
        "id": 1,
        "title": "Search",
        "description": "Browse hundreds of pets. Filter by breed, age, and size.",
        "image": "https://i.pinimg.com/originals/28/7d/ed/287ded299cb85361b589e667b0f06f7a.gif"
    },
    {
        "id": 2,
        "title": "Meet",
        "description": "Schedule a shelter visit to meet your potential new friend.",
        "image": "https://i.pinimg.com/originals/11/87/af/1187afc97c3af98bb330029165d29262.gif"
    },
    {
        "id": 3,
        "title": "Adopt",
        "description": "Complete the process and bring your best friend home.",
        "image": "https://i.pinimg.com/originals/f9/4e/65/f94e657a802d5a1ecbe644c649748f57.gif"
    },
    {
        "id": 4,
        "title": "Love",
        "description": "Start a rewarding journey together. We support you.",
        "image": "https://i.pinimg.com/originals/41/fb/a7/41fba7f302496b3837dd4a8e9de1c3c0.gif"
    }
];

function InfoCard() {
    // Triple the data for smooth infinite scroll
    const marqueeData = [...data, ...data, ...data];

    return (
        <div className="w-full overflow-hidden py-10 select-none">
            <div className="flex w-max gap-8 moveX hover:pause">
                {marqueeData.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="group relative text-center bg-white/60 backdrop-blur-md rounded-3xl pb-8 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-pastel-blue/30 border border-white overflow-hidden w-[320px] shrink-0">

                        {/* Decorative Background Gradient - Very Light Pastel */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white to-pastel-blue/10 -z-10 group-hover:from-white group-hover:to-pastel-pink/20 transition-all"></div>

                        <div className="p-4 sm:p-6">
                            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full p-2 border-2 border-dashed border-pastel-purple/50 group-hover:border-pastel-purple transition-colors duration-500">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-700 mb-3">{item.title}</h1>
                        <p className="text-sm text-gray-500 px-6 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity font-medium">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InfoCard;

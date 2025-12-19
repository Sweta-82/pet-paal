import React from 'react'

function Capsule({ className = "", children, image }) {
    return (
        <div className={`relative w-24 h-64 md:w-32 md:h-80 lg:w-40 lg:h-96 rounded-full shadow-lg border-2 border-white/40 overflow-hidden ${className}`}>
            {image && (
                <img
                    src={image}
                    alt="Pet"
                    className="w-full h-full object-cover rounded-full opacity-90 hover:scale-110 transition-transform duration-700 block"
                />
            )}
            {children}
        </div>
    )
}

export default Capsule

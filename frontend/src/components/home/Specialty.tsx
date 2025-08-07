import React from 'react'

const Specialty = () => {
  return (
    <div className='outfit-font py-16'>
      <div className='text-3xl font-medium text-center pb-6'>Find By Specialty</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Dr. Rostani */}
        <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Dermatology</h3>
          <p className="text-sm text-gray-600">
            Specialized in skin treatments including acne, pigmentation, and anti-aging care using advanced technology.
          </p>
        </div>

        {/* Card 2 - another specialty */}
        <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cosmetic Procedures</h3>
          <p className="text-sm text-gray-600">
            We offer Botox, fillers, and non-invasive facial rejuvenation tailored to your needs.
          </p>
        </div>

        {/* Card 3 - optional */}
        <div className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Laser Treatments</h3>
          <p className="text-sm text-gray-600">
            Laser hair removal and pigmentation treatment with the latest FDA-approved devices.
          </p>
        </div>
      </div>

    </div>
  )
}

export default Specialty
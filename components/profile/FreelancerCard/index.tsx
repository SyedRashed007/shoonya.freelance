/* eslint-disable react/button-has-type */
import React from 'react'

function FreelancerCard({ data, handleClick }: any) {
  return (
    <div className="ml-12 mt-5">
      {data?.freelancers?.map((freelancer) => (
        <div className="flex p-3 mb-3">
          <button onClick={() => handleClick(freelancer.id)}>
            <div>
              <img className="h-20 w-20 rounded-full cursor-pointer" src={freelancer.picture} alt="Display Pic" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold mb-2">{freelancer.name}</p>
              <p className="text-sm">{freelancer.title}</p>
              <p className="text-sm">{freelancer.professionalExperience} year exp</p>
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}

export default FreelancerCard

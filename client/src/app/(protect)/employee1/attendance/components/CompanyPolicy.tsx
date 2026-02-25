import React from 'react'

const CompanyPolicy = () => {
  return (
       <div className="bg-gradient-to-b from-indigo-100 to-white rounded-2xl p-4 sm:p-5 md:p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 h-fit">
              <h4 className="text-teal-500 font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                Company Policy
              </h4>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed">
                Remember to check in before 09:30 AM to avoid late marking.
              </p>
              
              {/* Additional policy points for better content */}
              <div className="mt-3 sm:mt-4 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Break time: 1 hour daily
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Working hours: 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
  )
}

export default CompanyPolicy
'use client';

import React from 'react';

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  joinDate: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'employee';
  profilePicture?: string;
  address?: string;
  dateOfBirth?: string;
}

interface ProfileCardProps {
  profileData: ProfileData;
  isEditing: boolean;
  onEditClick: () => void;
}

export default function ProfileCard({
  profileData,
  isEditing,
  onEditClick,
}: ProfileCardProps) {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-50 text-red-700';
      case 'manager':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-teal-50 text-teal-700';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const yearsOfExperience = Math.floor(
    (new Date().getTime() - new Date(profileData.joinDate).getTime()) /
      (1000 * 60 * 60 * 24 * 365)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header Background */}
      <div className="h-20 bg-gradient-to-r from-teal-500 to-teal-600"></div>

      {/* Profile Content */}
      <div className="px-6 py-6">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4 -mt-12">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-white text-3xl font-bold">
              {getInitials(profileData.fullName)}
            </span>
          </div>
        </div>

        {/* Profile Name */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
          {profileData.fullName}
        </h2>

        {/* Role Badge */}
        <div className="flex justify-center mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
              profileData.role
            )}`}
          >
            {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
          </span>
        </div>

        {/* Department & Designation */}
        <div className="text-center mb-6 pb-6 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-600">{profileData.designation}</p>
          <p className="text-sm text-gray-500">{profileData.department}</p>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Employee ID</p>
            <p className="text-sm font-medium text-gray-800">{profileData.employeeId}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Years of Experience</p>
            <p className="text-sm font-medium text-gray-800">
              {yearsOfExperience} year{yearsOfExperience !== 1 ? 's' : ''}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Joined On</p>
            <p className="text-sm font-medium text-gray-800">
              {new Date(profileData.joinDate).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-800 break-all">{profileData.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="text-sm font-medium text-gray-800">{profileData.phoneNumber}</p>
          </div>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={onEditClick}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Profile Active</span>
        </div>
        <span className="text-xs text-gray-500">Updated today</span>
      </div>
    </div>
  );
}

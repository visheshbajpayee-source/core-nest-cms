'use client';

import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import ProfileForm from './ProfileForm';

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

const mockProfileData: ProfileData = {
  fullName: 'Disha Sharma',
  email: 'disha.sharma@example.com',
  phoneNumber: '+91 8765432109',
  department: 'Engineering',
  designation: 'Senior Software Engineer',
  joinDate: '2022-03-15',
  employeeId: 'ENG-2022-001',
  role: 'employee',
  profilePicture: undefined,
  address: '123 Tech Street, Bangalore, India',
  dateOfBirth: '1996-07-20',
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>(mockProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData(mockProfileData);
  };

  const handleSaveProfile = async (updatedData: Partial<ProfileData>) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setProfileData((prev) => ({
        ...prev,
        ...updatedData,
      }));
      setIsEditing(false);
      
      // Show success message (you can integrate with a toast library here)
      console.log('Profile updated successfully:', updatedData);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">View and manage your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card (Left Sidebar) */}
        <div className="lg:col-span-1">
          <ProfileCard 
            profileData={profileData}
            isEditing={isEditing}
            onEditClick={handleEditClick}
          />
        </div>

        {/* Profile Form (Main Content) */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <ProfileForm
              profileData={profileData}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
              isSaving={isSaving}
            />
          ) : (
            <ProfileDetails profileData={profileData} />
          )}
        </div>
      </div>
    </div>
  );
}

interface ProfileDetailsProps {
  profileData: ProfileData;
}

function ProfileDetails({ profileData }: ProfileDetailsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      {/* Basic Information */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailField label="Full Name" value={profileData.fullName} />
          <DetailField label="Email" value={profileData.email} />
          <DetailField label="Phone Number" value={profileData.phoneNumber} />
          <DetailField label="Date of Birth" value={profileData.dateOfBirth || 'Not provided'} />
        </div>
      </section>

      {/* Professional Information */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          Professional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailField label="Employee ID" value={profileData.employeeId} />
          <DetailField label="Department" value={profileData.department} />
          <DetailField label="Designation" value={profileData.designation} />
          <DetailField label="Date of Joining" value={new Date(profileData.joinDate).toLocaleDateString()} />
          <DetailField label="Role" value={profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)} />
        </div>
      </section>

      {/* Address Information */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          Address
        </h2>
        <DetailField label="Address" value={profileData.address || 'Not provided'} />
      </section>

      {/* Documents Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          Documents
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-gray-400 text-4xl mb-2">📄</div>
          <p className="text-gray-600 font-medium">No documents uploaded yet</p>
          <p className="text-gray-500 text-sm mt-1">You can upload documents like ID proof, certificates, and offer letters</p>
        </div>
      </section>
    </div>
  );
}

interface DetailFieldProps {
  label: string;
  value: string;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <p className="text-base text-gray-800 font-medium">{value}</p>
    </div>
  );
}

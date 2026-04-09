'use client';

import React, { useEffect, useState } from 'react';
import ProfileCard from './components/ProfileCard';
import ProfileForm from './components/ProfileForm';
import {
  fetchMyProfile,
  getStoredProfile,
  updateMyProfile,
  type ProfileData,
} from './service/profile.service';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = getStoredProfile();
    if (stored) {
      setProfileData(stored);
    }

    fetchMyProfile()
      .then((profile) => {
        setProfileData(profile);
      })
      .catch((fetchError: Error) => {
        setError(fetchError.message || 'Unable to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSaveProfile = async (updatedData: Partial<ProfileData>) => {
    if (!profileData) return;

    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateMyProfile(profileData, updatedData);
      setProfileData(updated);
      setIsEditing(false);
    } catch (saveError: any) {
      setError(saveError?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl bg-white p-6 text-sm text-gray-600 shadow-sm">Loading profile...</div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || 'Unable to load profile.'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">View and manage your profile information</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
          Employee Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailField label="System ID" value={profileData.id} />
          <DetailField label="Full Name" value={profileData.fullName} />
          <DetailField label="Email" value={profileData.email} />
          <DetailField label="Phone Number" value={profileData.phoneNumber} />
          <DetailField label="Department" value={profileData.department} />
          <DetailField label="Designation" value={profileData.designation} />
          <DetailField label="Date of Joining" value={new Date(profileData.dateOfJoining).toLocaleDateString()} />
          <DetailField label="Role" value={profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)} />
          <DetailField label="Employee ID" value={profileData.employeeId} />
          <DetailField label="Status" value={profileData.status.charAt(0).toUpperCase() + profileData.status.slice(1)} />
          <DetailField label="Profile Picture" value={profileData.profilePicture ? 'Added' : 'Not added'} />
          <DetailField label="Profile Picture URL" value={profileData.profilePicture || '-'} />
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

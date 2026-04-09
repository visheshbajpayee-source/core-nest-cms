'use client';

import React, { useState } from 'react';

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  employeeId: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  profilePicture?: string;
}

interface ProfileFormProps {
  profileData: ProfileData;
  onSave: (data: Partial<ProfileData>) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function ProfileForm({
  profileData,
  onSave,
  onCancel,
  isSaving,
}: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<ProfileData>>(profileData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        phoneNumber: formData.phoneNumber,
        profilePicture: formData.profilePicture,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <FormField
              label="Full Name"
              name="fullName"
              type="text"
              value={formData.fullName || ''}
              onChange={handleChange}
              error={errors.fullName}
              disabled={true}
              note="Cannot be changed"
            />

            {/* Email */}
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              disabled={true}
              note="Cannot be changed"
            />

            {/* Phone Number */}
            <FormField
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              error={errors.phoneNumber}
              placeholder="+91 XXXXXXXXXX"
            />

            {/* Profile Picture */}
            <FormField
              label="Profile Picture (optional URL)"
              name="profilePicture"
              type="url"
              value={formData.profilePicture || ''}
              onChange={handleChange}
              placeholder="https://example.com/profile.jpg"
            />
          </div>
        </section>

        {/* Professional Information Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee ID */}
            <FormField
              label="Employee ID"
              name="employeeId"
              type="text"
              value={formData.employeeId || ''}
              onChange={handleChange}
              disabled={true}
              note="Auto-generated"
            />

            {/* Department */}
            <FormField
              label="Department"
              name="department"
              type="text"
              value={formData.department || ''}
              onChange={handleChange}
              disabled={true}
              note="Contact admin to change"
            />

            {/* Designation */}
            <FormField
              label="Designation"
              name="designation"
              type="text"
              value={formData.designation || ''}
              onChange={handleChange}
              disabled={true}
              note="Contact admin to change"
            />

            {/* Join Date */}
            <FormField
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining || ''}
              onChange={handleChange}
              disabled={true}
              note="Cannot be changed"
            />

            <FormField
              label="Role"
              name="role"
              type="text"
              value={formData.role || ''}
              onChange={handleChange}
              disabled={true}
            />

            <FormField
              label="Status"
              name="status"
              type="text"
              value={formData.status || ''}
              onChange={handleChange}
              disabled={true}
            />
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
  note?: string;
  isTextarea?: boolean;
  placeholder?: string;
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  note,
  isTextarea = false,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {note && <span className="text-xs text-gray-500 font-normal ml-1">({note})</span>}
      </label>

      {isTextarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
            disabled ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white'
          } ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
            disabled ? 'bg-gray-100 text-gray-600 cursor-not-allowed' : 'bg-white'
          } ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

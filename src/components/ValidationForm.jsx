import React, { useState } from "react";
import { User, Mail, Phone, MapPin, FileText, AlertCircle } from "lucide-react";

const degrees = [
  "B.Tech Computer Science",
  "B.Tech Electronics",
  "B.Sc Computer Science",
  "BCA",
  "MCA",
  "MBA"
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  degree: "",
  resume: null,
};

export default function ValidationForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = (name, value) => {
    switch (name) {
      case "name":
        return !value ? "Name is required" :
          !/^[A-Za-z\s]{2,30}$/.test(value) ? "Name must be 2-30 letters only" : "";
      case "email":
        return !value ? "Email is required" :
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
      case "phone":
        return !value ? "Phone is required" :
          !/^[6-9][0-9]{9}$/.test(value) ? "Enter valid 10-digit mobile number" : "";
      case "address":
        return !value ? "Address is required" : "";
      case "gender":
        return !value ? "Please select gender" : "";
      case "degree":
        return !value ? "Please select degree" : "";
      case "resume":
        if (!value) return "Resume is required";
        if (value.type !== "application/pdf") return "Resume must be PDF";
        if (value.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    const fieldValue = type === "file" ? files[0] : value;

    setForm(prev => ({ ...prev, [name]: fieldValue }));

    const error = validate(name, fieldValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach(key => {
      newErrors[key] = validate(key, form[key]);
    });

    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error)) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await fetch("http://localhost:4000/api/submit-form", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        setForm(initialState);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      alert("Submission failed. Please try again.");
    }

    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted!</h2>
        <p className="text-gray-600 mb-6">Thank you for your submission.</p>
        <button
          onClick={() => setSuccess(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit Another Form
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Application Form</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
            />
            {errors.name && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle size={14} />
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} />
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle size={14} />
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} />
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
            />
            {errors.phone && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle size={14} />
                {errors.phone}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} />
              Degree
            </label>
            <select
              name="degree"
              value={form.degree}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.degree ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
            >
              <option value="">Select your degree</option>
              {degrees.map(degree => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
            {errors.degree && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle size={14} />
                {errors.degree}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} />
            Address
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your full address"
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
          />
          {errors.address && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.address}
            </div>
          )}
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Gender</label>
          <div className="flex gap-6">
            {["male", "female", "other"].map(gender => (
              <label key={gender} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={form.gender === gender}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="capitalize">{gender}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.gender}
            </div>
          )}
        </div>

        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText size={16} />
            Resume (PDF only)
          </label>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {errors.resume && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle size={14} />
              {errors.resume}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full mt-8 py-3 px-4 rounded-lg font-medium transition-colors ${submitting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
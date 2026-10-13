"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { useHomestayDetail, useUpdateHomestay } from "@/hooks/useHomestays";
import { GalleryUploader, HostPhotoUploader } from "@/components/shared/ImageUploader";
import { showToast, errorMessage } from "@/lib/toast";

export default function EditHomestayPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: homestay, isLoading, isError } = useHomestayDetail(id);
  const updateMutation = useUpdateHomestay();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    village: "",
    region: "",
    hostName: "",
    hostBio: "",
    hostPhoto: "",
    roomType: "PRIVATE",
    capacity: 2,
    mealsIncluded: "BREAKFAST",
    pricePerNight: 2000,
    facilitiesText: "",
    images: [],
  });

  useEffect(() => {
    if (homestay) {
      setFormData({
        name: homestay.name || "",
        description: homestay.description || "",
        village: homestay.village || "",
        region: homestay.region || "",
        hostName: homestay.hostName || "",
        hostBio: homestay.hostBio || "",
        hostPhoto: homestay.hostPhoto || "",
        roomType: homestay.roomType || "PRIVATE",
        capacity: homestay.capacity || 2,
        mealsIncluded: homestay.mealsIncluded || "BREAKFAST",
        pricePerNight: homestay.pricePerNight || 0,
        facilitiesText: (homestay.facilities || []).join(", "),
        images: homestay.images || [],
      });
    }
  }, [homestay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const facilities = formData.facilitiesText
      ? formData.facilitiesText.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const images = Array.isArray(formData.images) ? formData.images.filter(Boolean) : [];

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      village: formData.village,
      region: formData.region,
      hostName: formData.hostName,
      hostBio: formData.hostBio || undefined,
      hostPhoto: formData.hostPhoto || undefined,
      roomType: formData.roomType,
      capacity: Number(formData.capacity) || 2,
      mealsIncluded: formData.mealsIncluded,
      pricePerNight: Number(formData.pricePerNight) || 1500,
      facilities,
      images,
    };

    try {
      await updateMutation.mutateAsync({ id, data: payload });
      showToast.success("Homestay updated successfully! ✅");
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to update homestay."));
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-admin-muted text-sm flex items-center justify-center gap-3">
        <svg className="animate-spin h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading homestay details...
      </div>
    );
  }

  if (isError || !homestay) {
    return (
      <div className="space-y-4">
        <Link href="/homestays" className="text-xs text-gold hover:underline">
          ← Back to homestays
        </Link>
        <div className="admin-card p-8 text-center text-admin-muted">
          Homestay not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/homestays"
          className="text-xs font-semibold text-admin-muted hover:text-admin-text transition-colors"
        >
          ← Homestays
        </Link>
        <span className="text-admin-border">/</span>
        <span className="text-xs text-gold">Edit: {homestay.name}</span>
      </div>

      <PageHeader
        title={`Edit "${homestay.name}"`}
        subtitle="Update homestay pricing, details, host biography, and facilities."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="font-semibold text-admin-text text-base border-b border-admin-border pb-3">
            Homestay Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Homestay Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Village Name *</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Region / District *</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Price Per Night (NPR) *</label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                min={0}
                required
                className="admin-input font-mono"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Description & Experience</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="admin-input text-xs"
            />
          </div>
        </div>

        {/* Accommodation Specs */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="font-semibold text-admin-text text-base border-b border-admin-border pb-3">
            Capacity & Hospitality
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Room Type</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="PRIVATE">PRIVATE</option>
                <option value="SHARED">SHARED</option>
                <option value="FAMILY">FAMILY</option>
              </select>
            </div>

            <div>
              <label className="admin-label">Max Guest Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min={1}
                className="admin-input font-mono"
              />
            </div>

            <div>
              <label className="admin-label">Meals Included</label>
              <select
                name="mealsIncluded"
                value={formData.mealsIncluded}
                onChange={handleChange}
                className="admin-input"
              >
                <option value="BREAKFAST">BREAKFAST</option>
                <option value="BREAKFAST_DINNER">BREAKFAST + DINNER</option>
                <option value="ALL_MEALS">ALL MEALS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="admin-label">Facilities (comma-separated)</label>
            <input
              type="text"
              name="facilitiesText"
              value={formData.facilitiesText}
              onChange={handleChange}
              className="admin-input text-xs"
            />
          </div>
        </div>

        {/* Host Details */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="font-semibold text-admin-text text-base border-b border-admin-border pb-3">
            Host Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Host Name *</label>
              <input
                type="text"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
                required
                className="admin-input"
              />
            </div>

          </div>

          <HostPhotoUploader
            value={formData.hostPhoto}
            onChange={(url) => setFormData((prev) => ({ ...prev, hostPhoto: url }))}
          />

          <div>
            <label className="admin-label">Host Bio</label>
            <textarea
              name="hostBio"
              value={formData.hostBio}
              onChange={handleChange}
              rows={2}
              className="admin-input text-xs"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="font-semibold text-admin-text text-base border-b border-admin-border pb-3">
            Gallery Photos & Media
          </h3>

          <GalleryUploader
            images={formData.images}
            onChange={(imgs) => setFormData((prev) => ({ ...prev, images: imgs }))}
          />
        </div>


        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/homestays" className="admin-btn-ghost text-xs">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="admin-btn-primary px-6 py-2.5 text-xs shadow-md cursor-pointer disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

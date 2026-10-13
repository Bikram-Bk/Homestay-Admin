"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { useCreateHomestay } from "@/hooks/useHomestays";
import { GalleryUploader, HostPhotoUploader } from "@/components/shared/ImageUploader";
import { showToast, errorMessage } from "@/lib/toast";

export default function NewHomestayPage() {
  const router = useRouter();
  const createMutation = useCreateHomestay();

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
    facilitiesText: "Hot Water, WiFi, Organic Meals, Mountain View",
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.village || !formData.region || !formData.hostName || !formData.pricePerNight) {
      showToast.error("Please fill in all required fields (Name, Village, Region, Host Name, Price).");
      return;
    }

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
      await createMutation.mutateAsync(payload);
      showToast.success(`"${payload.name}" published successfully! 🏡`);
      router.push("/homestays");
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to create homestay."));
    }
  };

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
        <span className="text-xs text-gold">Create New</span>
      </div>

      <PageHeader
        title="Add New Homestay"
        subtitle="List a new authentic homestay with host details, pricing, and amenities."
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
                placeholder="e.g. Gurung Didi Homestay"
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
                placeholder="e.g. Ghandruk"
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
                placeholder="e.g. Kaski, Annapurna"
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
              placeholder="Describe the homestay experience, stone architecture, farm views..."
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
              placeholder="Hot Water, WiFi, Organic Meals, Mountain View"
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
                placeholder="e.g. Maya Gurung"
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
              placeholder="Welcoming trekkers and families for over 15 years with traditional hospitality..."
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
            disabled={createMutation.isPending}
            className="admin-btn-primary px-6 py-2.5 text-xs shadow-md cursor-pointer disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating Homestay..." : "Publish Homestay"}
          </button>
        </div>
      </form>
    </div>
  );
}

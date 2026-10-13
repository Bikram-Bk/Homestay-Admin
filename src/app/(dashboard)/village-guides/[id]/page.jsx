"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { useVillageGuides, useUpdateVillageGuide } from "@/hooks/useVillageGuides";
import { showToast, errorMessage } from "@/lib/toast";

export default function EditVillageGuidePage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: guides = [], isLoading } = useVillageGuides();
  const updateMutation = useUpdateVillageGuide();

  const guide = guides.find((g) => g.id === id);

  const [formData, setFormData] = useState({
    village: "",
    region: "",
    tagsText: "",
    content: "",
  });
  useEffect(() => {
    if (guide) {
      setFormData({
        village: guide.village || "",
        region: guide.region || "",
        tagsText: (guide.tags || []).join(", "),
        content: guide.content || "",
      });
    }
  }, [guide]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.village || !formData.region || !formData.content) {
      showToast.error("Please fill in village name, region, and guide content.");
      return;
    }

    if (formData.content.length < 20) {
      showToast.error("Guide content must be at least 20 characters.");
      return;
    }

    const tags = formData.tagsText
      ? formData.tagsText.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      village: formData.village,
      region: formData.region,
      content: formData.content,
      tags,
    };

    try {
      await updateMutation.mutateAsync({ id, data: payload });
      showToast.success("Village guide updated successfully! ✅");
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to update village guide."));
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-admin-muted text-sm flex items-center justify-center gap-3">
        <svg className="animate-spin h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading village guide...
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="space-y-4">
        <Link href="/village-guides" className="text-xs text-gold hover:underline">
          ← Back to village guides
        </Link>
        <div className="admin-card p-8 text-center text-admin-muted">
          Village guide not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/village-guides"
          className="text-xs font-semibold text-admin-muted hover:text-admin-text transition-colors"
        >
          ← Village Guides
        </Link>
        <span className="text-admin-border">/</span>
        <span className="text-xs text-gold">Edit: {guide.village}</span>
      </div>

      <PageHeader
        title={`Edit Guide: ${guide.village}`}
        subtitle="Update regional info, cultural insights, and tags."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="admin-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tagsText"
              value={formData.tagsText}
              onChange={handleChange}
              className="admin-input text-xs"
            />
          </div>

          <div>
            <label className="admin-label">Guide Content & Cultural Notes *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              required
              className="admin-input text-xs leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/village-guides" className="admin-btn-ghost text-xs">
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

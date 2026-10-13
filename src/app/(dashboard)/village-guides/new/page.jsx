"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { useCreateVillageGuide } from "@/hooks/useVillageGuides";
import { showToast, errorMessage } from "@/lib/toast";

export default function NewVillageGuidePage() {
  const router = useRouter();
  const createMutation = useCreateVillageGuide();

  const [formData, setFormData] = useState({
    village: "",
    region: "",
    tagsText: "Gurung Culture, Annapurna Sanctuary, Himalayan Views, Traditional Food",
    content: "",
  });
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
      await createMutation.mutateAsync(payload);
      showToast.success(`"${payload.village}" guide published! 🏔️`);
      router.push("/village-guides");
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to create village guide."));
    }
  };

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
        <span className="text-xs text-gold">Create New</span>
      </div>

      <PageHeader
        title="Add Village Guide"
        subtitle="Provide rich travel and cultural context for this Nepali village."
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
                placeholder="e.g. Kaski, Gandaki"
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
              placeholder="Gurung Culture, Trekking, Sunrise Views"
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
              placeholder="Describe the altitude, local traditions, best travel months, reaching the village by trail/jeep, and homestay hospitality customs..."
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
            disabled={createMutation.isPending}
            className="admin-btn-primary px-6 py-2.5 text-xs shadow-md cursor-pointer disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating Guide..." : "Publish Village Guide"}
          </button>
        </div>
      </form>
    </div>
  );
}

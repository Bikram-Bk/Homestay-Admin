"use client";

import { useState, useRef } from "react";
import api from "@/lib/api";
import { showToast } from "@/lib/toast";

/**
 * Upload multiple files to /api/uploads in chunks of 5 (backend Multer limit)
 */
async function uploadFilesToCloudinary(files, onProgress) {
  const CHUNK_SIZE = 5;
  const allUrls = [];

  for (let i = 0; i < files.length; i += CHUNK_SIZE) {
    const chunk = files.slice(i, i + CHUNK_SIZE);
    if (onProgress) {
      onProgress(
        `Uploading ${i + 1}–${Math.min(i + chunk.length, files.length)} of ${files.length} images...`
      );
    }

    const fd = new FormData();
    chunk.forEach((f) => fd.append("images", f));

    const res = await api.post("/uploads", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const urls = res?.data?.data?.urls || [];
    allUrls.push(...urls);
  }

  return allUrls;
}

/**
 * GalleryUploader — Drag & drop multi-image upload with visual preview grid,
 * reordering, cover photo selection, deletion, and manual URL input.
 */
export function GalleryUploader({ images = [], onChange, label = "Gallery Images" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFiles = async (selectedFiles) => {
    const files = Array.from(selectedFiles).filter((f) =>
      f.type.startsWith("image/")
    );

    if (files.length === 0) return;

    setUploading(true);
    try {
      const newUrls = await uploadFilesToCloudinary(files, setUploadStatus);
      onChange([...images, ...newUrls]);
      showToast.success(`${newUrls.length} image(s) uploaded ✅`);
    } catch (err) {
      showToast.error(
        err?.response?.data?.message || err?.message || "Failed to upload images."
      );
    } finally {
      setUploading(false);
      setUploadStatus("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    const filtered = images.filter((_, idx) => idx !== indexToRemove);
    onChange(filtered);
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([item, ...rest]);
  };

  const handleMove = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onChange(reordered);
  };

  const handleAddManualUrl = (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onChange([...images, manualUrl.trim()]);
    setManualUrl("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="admin-label mb-0">
          {label} ({images.length} {images.length === 1 ? "photo" : "photos"})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-gold hover:underline transition-colors flex items-center gap-1"
        >
          {showUrlInput ? "Hide URL input" : "+ Add via URL"}
        </button>
      </div>

      {/* Manual URL entry row */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
            className="admin-input text-xs font-mono flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#2D333B] hover:bg-[#373E47] text-admin-text text-xs rounded-lg transition-colors"
          >
            Add URL
          </button>
        </form>
      )}

      {/* Drag & drop upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-terracotta bg-terracotta/10"
            : "border-admin-border hover:border-gold/50 bg-mist/40 hover:bg-mist"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-admin-text">
              <span className="text-gold">Click to browse</span> or drag and drop images
            </p>
            <p className="text-[11px] text-admin-muted mt-0.5">
              JPG, PNG, WebP up to 10MB • Auto-uploads to Cloudinary
            </p>
          </div>
        </div>
      </div>

      {/* Uploading progress notification */}
      {uploading && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{uploadStatus || "Uploading to Cloudinary..."}</span>
        </div>
      )}

      {/* Visual Thumbnail Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-admin-border bg-admin-bg shadow-sm hover:border-gold/50 transition-all"
            >
              {/* Image element */}
              <img
                src={url}
                alt={`Homestay photo ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600";
                }}
              />

              {/* Cover badge */}
              {idx === 0 ? (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-gold text-white flex items-center gap-1 shadow-md">
                  ★ Cover
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCover(idx)}
                  title="Make this the cover photo"
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded text-[10px] font-medium bg-black/75 hover:bg-gold hover:text-black text-admin-text backdrop-blur-sm"
                >
                  Set as Cover
                </button>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                title="Remove photo"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md"
              >
                ✕
              </button>

              {/* Bottom controls: Move left / right / view full */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, idx - 1)}
                      title="Move left"
                      className="w-5 h-5 rounded bg-black/60 hover:bg-black flex items-center justify-center text-[10px]"
                    >
                      ◀
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(idx, idx + 1)}
                      title="Move right"
                      className="w-5 h-5 rounded bg-black/60 hover:bg-black flex items-center justify-center text-[10px]"
                    >
                      ▶
                    </button>
                  )}
                </div>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open full size"
                  className="text-[10px] text-admin-muted hover:text-admin-text px-1"
                >
                  View ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * HostPhotoUploader — Single image uploader tailored for host avatar/portrait
 */
export function HostPhotoUploader({ value = "", onChange, label = "Host Portrait / Photo" }) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("images", file);

      const res = await api.post("/uploads", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res?.data?.data?.urls?.[0];
      if (url) {
        onChange(url);
        showToast.success("Host photo uploaded ✅");
      }
    } catch (err) {
      showToast.error(
        err?.response?.data?.message || err?.message || "Failed to upload host photo."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setManualUrl("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="admin-label mb-0">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-gold hover:underline transition-colors"
        >
          {showUrlInput ? "Hide URL input" : "+ Enter URL"}
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://..."
            className="admin-input text-xs font-mono flex-1"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#2D333B] hover:bg-[#373E47] text-admin-text text-xs rounded-lg transition-colors"
          >
            Apply
          </button>
        </form>
      )}

      <div className="flex items-center gap-4 p-3 rounded-xl border border-admin-border bg-admin-bg">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        {/* Avatar thumbnail preview */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 bg-admin-bg flex-shrink-0">
          {value ? (
            <img
              src={value}
              alt="Host portrait preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-admin-muted">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Action buttons & status */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal hover:bg-teal-dark text-white transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : value ? "Change Photo" : "Upload Photo"}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-admin-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          <p className="text-[11px] text-admin-muted">
            PNG, JPG up to 5MB • Uploads directly to Cloudinary
          </p>
        </div>
      </div>
    </div>
  );
}

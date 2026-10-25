'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageDropzoneUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

export function ImageDropzoneUploader({
  value,
  onChange,
  label = 'Product Image',
  helperText = 'Drag & drop image from your laptop, or click to browse files (JPG, PNG, WEBP, GIF up to 10MB)',
  className = '',
}: ImageDropzoneUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleUpload(droppedFile);
    }
  };

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#7b7366]">
          {label}
        </label>
        {value && (
          <span className="text-[11px] font-mono text-[#2d5508] bg-[#eef7e6] px-2 py-0.5 border border-[#cbe4be]">
            Image Attached
          </span>
        )}
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-500 font-bold hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed transition-all p-5 text-center cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
          isDragging
            ? 'border-[#2d5508] bg-[#f4faee]'
            : value
            ? 'border-[#e5dcd0] bg-white hover:border-[#2d5508]/60 hover:bg-[#faf8f5]'
            : 'border-[#d0c6b8] bg-[#faf8f5] hover:border-[#2d5508] hover:bg-[#f8fbf5]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={onFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="w-8 h-8 border-2 border-[#2d5508] border-t-transparent animate-spin rounded-full" />
            <p className="text-xs font-medium text-[#2d5508]">Uploading image from your laptop...</p>
            <p className="text-[10px] text-[#7b7366]">Saving to server and updating product</p>
          </div>
        ) : value ? (
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
            {/* Live Image Preview */}
            <div className="relative w-28 h-28 bg-[#faf8f5] border border-[#e5dcd0] overflow-hidden flex-shrink-0">
              <Image
                src={value}
                alt="Product preview"
                fill
                sizes="112px"
                className="object-cover"
                unoptimized={value.startsWith('http') || value.startsWith('/images/uploads/')}
              />
            </div>

            <div className="flex-1 text-left space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#131010]">Current Product Image</span>
              </div>
              <p className="text-[11px] font-mono text-[#7b7366] truncate max-w-md bg-[#faf8f5] p-1.5 border border-[#e5dcd0]">
                {value}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 bg-[#131010] hover:bg-[#2d5508] text-white text-[11px] font-medium transition-colors"
                >
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="px-3 py-1.5 bg-[#faf8f5] hover:bg-red-50 text-[#7b7366] hover:text-red-700 border border-[#e5dcd0] text-[11px] transition-colors"
                >
                  Remove
                </button>
              </div>
              <p className="text-[10px] text-[#7b7366] pt-1">
                Tip: You can also drag a new image file directly onto this box to replace.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="w-12 h-12 bg-[#efeae1] rounded-full flex items-center justify-center text-[#7b7366]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#131010]">
                Drop product image here, or <span className="text-[#2d5508] underline">browse your laptop</span>
              </p>
              <p className="text-[11px] text-[#7b7366] max-w-sm">{helperText}</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual URL input fallback toggle */}
      <div className="flex items-center justify-between text-[11px] text-[#7b7366] pt-1">
        <span>Supported: JPG, PNG, WEBP, GIF, AVIF</span>
        <div className="flex items-center gap-1 font-mono">
          <span>URL:</span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/..."
            onClick={(e) => e.stopPropagation()}
            className="px-2 py-0.5 text-[10px] border border-[#e5dcd0] bg-white font-mono w-44 focus:outline-none focus:border-[#2d5508]"
          />
        </div>
      </div>
    </div>
  );
}

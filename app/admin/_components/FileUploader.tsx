"use client";

import React, { useState } from "react";
import {
  FiUploadCloud,
  FiFileText,
  FiImage,
  FiVideo,
  FiCheck,
  FiCopy,
  FiLoader,
} from "react-icons/fi";
import { toast } from "react-toastify";

interface FileUploaderProps {
  onUploadSuccess?: (url: string, key: string, filename: string) => void;
  onMultiUploadSuccess?: (urls: string[]) => void;
  defaultFolder?: string;
  acceptedTypes?: "image" | "video" | "md" | "media" | "all";
  label?: string;
  currentUrl?: string;
  multiple?: boolean;
}

export function FileUploader({
  onUploadSuccess,
  onMultiUploadSuccess,
  defaultFolder = "uploads",
  acceptedTypes = "all",
  label = "Upload File to Cloudflare R2",
  currentUrl,
  multiple = false,
}: FileUploaderProps) {
  const [folder, setFolder] = useState(defaultFolder);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const acceptAttribute =
    acceptedTypes === "image"
      ? "image/*"
      : acceptedTypes === "video"
      ? "video/*,.mp4,.webm,.mov,.avi"
      : acceptedTypes === "md"
      ? ".md,.markdown,text/markdown"
      : acceptedTypes === "media"
      ? "image/*,video/*,.mp4,.webm,.mov,.avi"
      : "image/*,video/*,.pdf,.docx,.doc,.md,.markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    toast.info(`Uploading ${files.length} file(s) to Cloudflare R2...`);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Upload failed for ${file.name}`);
        }

        uploadedUrls.push(data.url);
        if (!multiple && i === 0) {
          setUploadedUrl(data.url);
          onUploadSuccess?.(data.url, data.key, data.originalName);
        }
      }

      if (multiple && onMultiUploadSuccess && uploadedUrls.length > 0) {
        onMultiUploadSuccess(uploadedUrls);
      }
      toast.success("Successfully uploaded file(s) to Cloudflare R2!");
    } catch (err: any) {
      const errMsg = err.message || "Failed to upload file(s)";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      toast.info("Copied R2 URL to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-zinc-950/60 p-4 font-mono text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="font-semibold text-zinc-200 text-sm flex items-center gap-2">
          <FiUploadCloud className="text-indigo-400 h-4.5 w-4.5" /> {label}
        </label>
        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
          <span className="font-semibold">Target Folder:</span>
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. projects"
            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none focus:border-indigo-500 w-32 text-xs font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm cursor-pointer border border-zinc-700 transition">
          {isUploading ? (
            <>
              <FiLoader className="animate-spin text-indigo-400 h-4.5 w-4.5" />
              <span>Uploading to R2...</span>
            </>
          ) : (
            <>
              {acceptedTypes === "md" ? (
                <FiFileText className="text-emerald-400 h-4.5 w-4.5" />
              ) : acceptedTypes === "image" ? (
                <FiImage className="text-sky-400 h-4.5 w-4.5" />
              ) : acceptedTypes === "video" ? (
                <FiVideo className="text-purple-400 h-4.5 w-4.5" />
              ) : (
                <FiUploadCloud className="text-indigo-400 h-4.5 w-4.5" />
              )}
              <span>
                {multiple ? "Upload Files (Multi Select)" : "Select File"} (
                {acceptedTypes === "md"
                  ? ".md"
                  : acceptedTypes === "image"
                  ? "Image"
                  : acceptedTypes === "video"
                  ? "Video"
                  : "Images / Videos / Docs / .md"}
                )
              </span>
            </>
          )}
          <input
            type="file"
            accept={acceptAttribute}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>

        {!multiple && uploadedUrl && (
          <div className="flex-1 w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs truncate font-mono">
            <span className="truncate">{uploadedUrl}</span>
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-1 hover:text-white rounded hover:bg-white/10 shrink-0"
              title="Copy URL"
            >
              {copied ? (
                <FiCheck className="h-4 w-4 text-emerald-400" />
              ) : (
                <FiCopy className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-400 font-sans">{error}</p>}
    </div>
  );
}

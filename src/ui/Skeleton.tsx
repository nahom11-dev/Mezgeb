import React from "react";

export interface SkeletonProps {
  className?: string;
  label?: string;
}

export function Skeleton({ className = "h-5 w-full", label }: SkeletonProps) {
  return (
    <div
      aria-busy={label ? "true" : undefined}
      aria-label={label}
      className={`rounded-[6px] bg-[var(--stone)] border border-[var(--line)] ${className}`}
    />
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="mezgeb-container py-12 space-y-6" aria-busy="true" aria-label="Loading page">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-96 max-w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

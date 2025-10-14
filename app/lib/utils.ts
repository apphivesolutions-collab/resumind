// Utility functions shared across the app

// Formats a byte size into a human-readable string in kb, mb, or gb (with b fallback)
export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} b`;
  const units = ["kb", "mb", "gb", "tb"] as const;
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  const rounded =
    size >= 100
      ? Math.round(size)
      : size >= 10
        ? Math.round(size * 10) / 10
        : Math.round(size * 100) / 100;
  return `${rounded} ${units[unitIndex]}`;
};
export const genrateUUID = () => {
  return crypto.randomUUID();
};

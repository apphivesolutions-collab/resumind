import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = acceptedFiles[0] || null;
      onFileSelect?.(files);
    },
    [onFileSelect],
  );
  const maxFileSize = 20 * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: maxFileSize,
    });

  const File = acceptedFiles[0] || null;
  return (
    <div className="w-full px-0">
      <div {...getRootProps()} className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-neon-purple hover:bg-white/5 transition-all cursor-pointer min-h-[200px]">
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {File ? (
            <div
              className="uploader-selected-file px-3 mx-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" alt="PDF" className="size-10" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm text-gray-700 truncate max-w-xs font-medium">
                    {File.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(File.size)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 cursor-pointer"
                onClick={() => {
                  onFileSelect?.(null);
                }}
              >
                <img src="/icons/cross.svg" alt="Cross" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex items-center justify-center">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to Upload</span> or Drag
                'n' Drop Files
              </p>
              <p className="text-lg text-gray-500">
                {" "}
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FileUploader;

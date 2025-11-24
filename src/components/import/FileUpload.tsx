import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (content: string, filename: string) => void;
  accept?: string;
}

export function FileUpload({ onFileSelect, accept = '.md,.markdown' }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const mdFile = files.find(f => f.name.endsWith('.md') || f.name.endsWith('.markdown'));

    if (mdFile) {
      readFile(mdFile);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content, file.name);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      <motion.div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className={`
          relative
          border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-brand-500 bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20 shadow-[5px_5px_0px_rgba(37,99,235,0.4)]'
            : 'border-brand-400 dark:border-brand-500 bg-white dark:bg-neutral-800 hover:border-brand-500 dark:hover:border-brand-400 shadow-[3px_3px_0px_rgba(37,99,235,0.3)] hover:shadow-[5px_5px_0px_rgba(37,99,235,0.5)]'
          }
        `}
      >
        <div className="flex flex-col items-center gap-5">
          <motion.div
            animate={{
              y: isDragging ? -8 : 0,
              scale: isDragging ? 1.1 : 1
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`w-20 h-20 rounded-xl flex items-center justify-center ${
              isDragging
                ? 'bg-gradient-to-br from-brand-500 to-brand-600'
                : 'bg-gradient-to-br from-brand-400 to-accent-500'
            } shadow-elevation-2`}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </motion.div>

          <div>
            <p className="text-xl font-black text-gray-900 dark:text-white mb-2">
              📄 Drop your markdown file here
            </p>
            <p className="text-base font-medium text-gray-600 dark:text-gray-300">
              or click to browse
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {e.stopPropagation(); handleClick();}}
            className="
              px-6 py-3
              bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
              text-white font-black rounded-xl
              shadow-[0_4px_14px_rgba(37,99,235,0.4)]
              hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
              border-2 border-brand-300
              transition-all duration-200
            "
          >
            📁 Select File
          </motion.button>

          <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
            Supports .md and .markdown files
          </p>
        </div>
      </motion.div>
    </div>
  );
}

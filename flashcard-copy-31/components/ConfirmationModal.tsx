
import React from 'react';
import { Theme } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  theme?: Theme;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  cancelText = "Cancel", 
  confirmText = "Delete",
  theme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="bg-white rounded-[20px] w-full max-w-[320px] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
        <h2 className="text-[26px] leading-tight font-normal text-slate-900 text-left mb-4">
          {title}
        </h2>
        
        <p className="text-lg text-slate-500 text-left leading-relaxed mb-8">
          {description}
        </p>
        
        <div className="flex items-center justify-end gap-6">
          <button 
            onClick={onClose}
            className="text-lg font-medium text-slate-900 active:opacity-70 transition-opacity"
          >
            {cancelText}
          </button>
          
          <button 
            onClick={onConfirm}
            className="text-lg font-medium text-[#e11d48] active:opacity-70 transition-opacity"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

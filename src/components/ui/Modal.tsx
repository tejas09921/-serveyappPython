import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-1 border-0 shadow-none hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
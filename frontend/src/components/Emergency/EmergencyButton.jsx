// src/components/Emergency/EmergencyButton.jsx
import React, { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import EmergencyModal from './EmergencyModal';

const EmergencyButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
        style={{ width: '80px', height: '80px' }}
      >
        <div className="flex flex-col items-center justify-center">
          <AlertTriangle size={28} />
          <span className="text-xs font-semibold mt-1">SOS</span>
        </div>
      </button>

      {showModal && (
        <EmergencyModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default EmergencyButton;

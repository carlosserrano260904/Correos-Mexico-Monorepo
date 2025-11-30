'use client'

interface BotonAnadirProps {
  texto?: string;
  onClick: () => void;
  className?: string;
}

export default function BotonAnadir({ 
  texto = "Añadir una dirección",
  onClick,
  className = ""
}: BotonAnadirProps) {
  return (
    <button
      onClick={onClick}
      className={`w-auto px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 transition-colors flex items-center justify-center gap-2 text-white font-semibold text-sm sm:text-base cursor-pointer shadow-md ${className}`}
    >
      <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      {texto}
    </button>
  );
}
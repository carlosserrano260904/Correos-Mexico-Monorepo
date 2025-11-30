'use client'
import { useRouter } from 'next/navigation';

interface BotonRegresarProps {
  texto?: string;
  className?: string;
}

export default function BotonRegresar({ 
  texto = "Regresar",
  className = ""
}: BotonRegresarProps) {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button 
      onClick={handleClick}
      className={`bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 sm:px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors mb-6 sm:mb-8 ${className}`}
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {texto}
    </button>
  );
}

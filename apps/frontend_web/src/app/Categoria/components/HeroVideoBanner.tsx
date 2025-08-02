import React from 'react';

const HeroVideoBanner: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto h-[400px] bg-[url(/video.png)] bg-cover bg-no-repeat ounded-2xl overflow-hidden rounded-2xl mt-5">
      <div className="w-full h-full flex px-6">
        <div className="basis-1/3 flex items-center justify-center">
        <div className='bg-black/40 text-white p-6 w-[200px]'>
            <h2 className="text-xl font-semibold text-center mb-2">Hola verano.</h2>
            <p className="mb-4 font-semibold text-center">Encuentra el outfit perfecto</p>
            <div className='w-full flex items-center justify-center'>
              <button className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-2xl">
                ¡Encontrar ya!
              </button>
            </div>
          </div>
        </div>
        <div className='basis-2/3'></div>
      </div>
    </div>
  );
};

export default HeroVideoBanner;

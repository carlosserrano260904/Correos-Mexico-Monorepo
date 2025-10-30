/* eslint-disable @next/next/no-img-element */
import { Btn, Title } from './primitivos';
import { CategoryItemProps } from '@/types/interface';

export const CategoryItem = ({ imageSrc, label }: CategoryItemProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Btn className="bg-[#F5F5F5] w-[175px] h-[175px]">
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={label}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>
      </Btn>
      <Title>{label}</Title>
    </div>
  );
};

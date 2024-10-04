import React from 'react';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-roboto',
});

interface LoginProps {
  componentProps: React.ReactNode;  
}

const Header: React.FC<LoginProps> = ({componentProps}) => {
  return (
    <div className={`${roboto.variable} flex justify-center items-center w-full`}>
      <header className='w-[1440px] bg-[#4A6B85] h-[79px] flex justify-between items-center'>
      <h2 className="font-roboto text-[24px] text-white ml-8 h-auto pb-2">
        AGENDA DE CONTATOS <span className='font-roboto font-bold text-[32px] text-[#ACAD57] ml-2'>Web</span>
      </h2>
      {componentProps}
      </header>
    </div>
  );
}

export default Header;

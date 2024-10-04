import React from 'react'
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    subsets: ['latin'],
    weight: '500',
    display: 'swap',
    variable: '--font-roboto',
});

const Footer = () => {
    return (
        <div className={`flex justify-center items-center bg-black h-5  ${roboto.variable}`}>
            <p className='font-roboto text-white text-xs'>Copyright &copy; {new Date().getFullYear()} Longo Bucco Dev. All rights reserved.</p>
        </div>
    )
}

export default Footer;
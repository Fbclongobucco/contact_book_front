import Link from 'next/link'
import React from 'react'
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-roboto',
});

const EnvelopedLogin = () => {
  return (
    <div className={`w-[400px] h-9 flex justify-center ${roboto.variable}`}>
        <Link href="#" className='text-white px-11 py-2 font-roboto'>Cadastre-se</Link>
        <Link href="#" className='py-2 px-8 bg-[#282828] rounded-3xl'><p className='text-slate-100 text-sm font-roboto'>Login</p></Link>
    </div>
  )
}

export default EnvelopedLogin
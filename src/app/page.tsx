import Image from "next/image";
import photo from '@/assets/contact.png';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  variable: '--font-roboto',
});

export default function Home() {
  return (
    <div className={`h-[calc(100vh-99px)] sm:max-w-[1440px] mx-auto bg-[#D9D9D9] flex flex-col lg:flex-row items-center justify-around px-4 sm:px-8 lg:px-0 ${roboto.variable}`}>
      <div className="flex flex-col w-full lg:w-[533px] h-auto lg:h-[528px] justify-between mb-8 lg:mb-0">
        <aside className="h-auto lg:h-[208px] mb-4 lg:mb-0">
          <h1 className="font-roboto text-[24px] sm:text-[30px] lg:text-[40px] text-[#ACAD57] font-medium">
            <span className="text-[#4A6B85]">APP</span> pra você manter salvo e seguro os contatos da sua agenda de contatos.
          </h1>
        </aside>
        <h2 className="font-roboto italic text-[18px] sm:text-[22px] lg:text-[26px] w-full lg:w-[314px]">
          Crie sua conta grátis e mantenha seus contatos em um servidor seguro. Essa aplicação tem como objetivo ser um portfólio, porém é altamente funcional para você usar e testar.
        </h2>
      </div>
      <Image
        src={photo}
        alt="picture contact"
        width={528}
        height={528}
        className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[528px] h-auto"
      />
    </div>
  );
}

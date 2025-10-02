"use client"
import { TokenPayload } from "@/types/token-payload"
import { User } from "@/types/user"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Roboto, Fira_Sans } from "next/font/google"

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
})
const firaSans = Fira_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "700"] 
})

export function Header() {
    const router = useRouter()
    const [userData, setUserData] = useState<User | null>(null)

    useEffect(() => {
        const accessToken = Cookies.get("accessToken")
        if (!accessToken) return router.push("/")

        const payload: TokenPayload = jwtDecode<TokenPayload>(accessToken)

        const fetchData = async () => {
            try {
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${payload.sub}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                setUserData(await userRes.json())
            } catch (err) {
                console.error(err)
                Cookies.remove("accessToken")
                Cookies.remove("refreshToken")
                router.push("/")
            }
        }

        fetchData()
    }, [router])

    const logout = () => {
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        router.push("/")
    }

    return (
        <header className={`w-full h-28 bg-cyan-600 ${roboto.className}`}>
            <div className="w-full h-full lg:w-full mx-auto px-4 flex justify-between items-center">
                <div className="flex-1">
                    <p className="font-bold text-zinc-100 text-sm sm:text-lg md:text-xl lg:text-2xl">
                        Olá, {userData?.name}!
                    </p>
                </div>
                
                <div className="flex-1 justify-center hidden sm:flex">
                    <h2 className={`text-amber-500 text-xl sm:text-2xl md:text-3xl font-extrabold ${firaSans.className}`}>
                        CONTACT <span className="text-cyan-950 font-extrabold">BOOK</span>
                    </h2>
                </div>
                
                <div className="flex-1 flex justify-end">
                    <button 
                        className="bg-cyan-950 px-4 py-2 sm:px-5 sm:py-2 rounded text-zinc-100 cursor-pointer hover:bg-cyan-900 transition-colors text-sm sm:text-base"
                        onClick={logout}
                    >
                        sair
                    </button>
                </div>
            </div>
        </header>
    )
}
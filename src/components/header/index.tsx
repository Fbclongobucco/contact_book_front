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
        <header className={`w-full ${roboto.className}`}>
            <div className="flex w-96 h-28 bg-cyan-600  p-1 md:w-full justify-between items-center">
                <div className="w-96 ">
                    <p className="font-bold text-zinc-100 text-sm sm:text-[24px] pl-4">Olá, {userData?.name}!</p>
                </div>
                <div className="hidden md:flex justify-center">
                    <h2 className={`text-amber-500 text-3xl font-extrabold ${firaSans.className}`}>CONTACT <span className="text-cyan-950  font-extrabold">BOOK</span></h2>
                </div>
                <div className="w-96 flex justify-end">
                    <button className="bg-cyan-950 px-5 py-1 mx-4 rounded text-zinc-100 cursor-pointer" onClick={logout}>
                        sair
                    </button>
                </div>
            </div>

        </header>
    )
}
import { User } from "@/types/user"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { TokenPayload } from "@/types/token-payload"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function Profile() {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        const accessToken = Cookies.get("accessToken")
        if (!accessToken) return router.push("/")

        const payload: TokenPayload = jwtDecode<TokenPayload>(accessToken)

        const fetchData = async () => {
            try {
                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${payload.sub}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                setUser(await userRes.json())
            } catch (err) {
                console.error(err)
                Cookies.remove("accessToken")
                Cookies.remove("refreshToken")
                router.push("/")
            }
        }

        fetchData()
    }, [router])

    return (
        <div className="w-full p-4 shadow-xl bg-zinc-100 rounded-lg flex flex-col lg:flex-row gap-4 lg:gap-20">
            <div className="lg:w-1/2">
                <h2 className="text-lg text-cyan-950 font-bold">Nome: {user?.name}</h2>
                <h3 className="text-cyan-950 font-bold">Email: {user?.email}</h3>
            </div>
            <div className="lg:w-1/2 text-lg font-bold text-cyan-950">
                <p>CPF: {user?.cpf}</p>
                <p>Aniversário: {user?.birthday}</p>
                <p>Criado em: {user?.createAt?.slice(0,10)}</p>
            </div>
            <Link href="/edit-profile" className="bg-cyan-800 w-20 h-8 text-cyan-100 flex items-center justify-center rounded hover:bg-cyan-900 transition-colors">editar</Link>
        </div>
    )
}
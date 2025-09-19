"use client"
import { useEffect, useState, useCallback } from "react"
import { jwtDecode } from "jwt-decode"
import { TokenPayload } from "@/types/token-payload"
import { Contact } from "@/types/contacts"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { ListContacts } from "@/components/list-contacts"
import { FindContact } from "@/components/find-contact"
import { Profile } from "@/components/profile"
import { AddContact } from "@/components/add-contact"

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[] | null>(null)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const router = useRouter()

  const fetchContacts = useCallback(async () => {
    const accessToken = Cookies.get("accessToken")
    if (!accessToken) return

    const payload: TokenPayload = jwtDecode<TokenPayload>(accessToken)

    try {
      const contactsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact/user/${payload.sub}?page=${page}&size=${size}`, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      setContacts(await contactsRes.json())
    } catch (err) {
      console.error(err)
      Cookies.remove("accessToken")
      Cookies.remove("refreshToken")
      router.push("/")
    }
  }, [page, size, router])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const nextPage = () => setPage(prev => prev + 1)
  const prevPage = () => setPage(prev => (prev > 1 ? prev - 1 : 1))

  return (
    <main className="w-full h-[calc(100vh-112px)] bg-gradient-to-b from-cyan-200 to-zinc-300 flex flex-col items-center gap-2">
      <div className="m-3 w-[1000px] flex justify-between flex-col gap-2">
        <Profile />
        <div className="flex">
          <AddContact onContactAdded={fetchContacts} />
          <FindContact />
        </div>
      </div>
      <div className="flex gap-4 mt-4 w-[1000px] justify-between">
        <button onClick={prevPage} disabled={page === 1} className="bg-cyan-700 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer">Voltar</button>
        <span className="self-center text-cyan-950">Página {page}</span>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border border-zinc-400 rounded px-2 py-1 bg-cyan-700 text-zinc-200"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
        </select>
        <button onClick={nextPage} className="bg-cyan-700 text-white px-4 py-2 rounded cursor-pointer">Avançar</button>
      </div>
      {
        contacts ? <ListContacts contacts={contacts || []} /> : <ListContacts/>
      }
    </main>
  )
}

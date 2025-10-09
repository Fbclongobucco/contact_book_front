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
    <main className="w-full min-h-[calc(100vh-7rem)]   bg-gradient-to-b from-cyan-200 to-zinc-300 flex flex-col items-center gap-4 py-4 px-2">
      <div className="w-full max-w-6xl flex flex-col lg:flex-wrap justify-between items-center lg:items-stretch gap-4">
        <Profile />
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2">
          <AddContact onContactAdded={fetchContacts} />
          <FindContact />
        </div>
      </div>
      
      <div className="flex flex-wrap  gap-4 mt-4 w-full max-w-6xl justify-center sm:justify-between items-center">
        <button onClick={prevPage} disabled={page === 1} className="bg-cyan-700 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer hover:bg-cyan-800 transition-colors">Voltar</button>
        <span className="text-cyan-950 font-medium hidden sm:block">Página {page}</span>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border border-zinc-400 rounded px-2 py-1 bg-cyan-700 text-zinc-200 cursor-pointer"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
        </select>
        <button onClick={nextPage} className="bg-cyan-700 text-white px-4 py-2 rounded cursor-pointer hover:bg-cyan-800 transition-colors">Avançar</button>
      </div>
      {contacts ? <ListContacts contacts={contacts || []} /> : <ListContacts/>}
    </main>
  )
}
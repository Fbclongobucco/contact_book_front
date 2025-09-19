"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "../ui/input";
import { Contact } from "@/types/contacts";
import Cookies from "js-cookie";
import { TokenPayload } from "@/types/token-payload";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";


export function FindContact() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [cardHidden, setCardHidden] = useState(false)

  const fetchContacts = useCallback(
    async (search: string) => {
      const token = Cookies.get("accessToken");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const payload: TokenPayload = jwtDecode<TokenPayload>(token);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/contact/user/${payload.sub}/search?q=${encodeURIComponent(
            search
          )}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Erro ao buscar contatos");

        const data: Contact[] = await res.json();
        setContacts(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os contatos.");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchContacts(query);
      } else {
        setContacts([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [query, fetchContacts]);

  const handleSelect = (id: string) => {
    const contact = contacts.find((c) => c.id.toString() === id);
    if (contact) {
      setSelectedContact(contact);
      setContacts([]); 
      setQuery("");
      handleCloseCard() 
    }
  };

  function handleCloseCard(){
    setCardHidden(!cardHidden)
  }

  return (
    <div className="w-full p-3 shadow-2xl bg-zinc-100 rounded-lg flex flex-col gap-3 text-md font-extrabold relative">
      <div className="flex justify-end items-center gap-3">
        <p className="text-cyan-950 text-lg">Busque um contato:</p>
        <Input
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedContact(null); 
          }}
          value={query}
          className="w-1/3 border-2 border-cyan-950"
          placeholder="Digite o nome..."
        />
      </div>

      {loading && <p className="text-cyan-900">🔄 Buscando...</p>}
      {error && <p className="text-red-600">{error}</p>}


      {contacts.length > 0 && !selectedContact && (
        <select
          className="absolute w-1/3 left-[434px] top-14 bg-white rounded-md p-2 shadow-md border border-cyan-950 outline-none"
          size={Math.min(contacts.length, 5)}
          onChange={(e) => handleSelect(e.target.value)}
        >
          {contacts.map((item) => (
            <option
              className="font-bold text-cyan-900"
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>
      )}


      {selectedContact && (
        <div className={`p-2 bg-white border border-cyan-950 rounded-md shadow-md w-1/3 ml-auto mr-[34px] ${cardHidden ? 'hidden' : 'flex'} gap-16 `}>
         <div> <p className="text-cyan-900 text-lg font-bold">
            {selectedContact.name}
          </p>
          <p className="text-cyan-800 text-md">{selectedContact.number}</p>
          </div>
          <button onClick={handleCloseCard} className="bg-zinc-300 self-start cursor-pointer"><X/></button>
        </div>
      )}
    </div>
  );
}

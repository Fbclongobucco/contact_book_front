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
  const [cardVisible, setCardVisible] = useState(false);

  /** Busca contatos do usuário logado */
  const fetchContacts = useCallback(async (search: string) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = jwtDecode<TokenPayload>(token);
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
  }, [router]);

  useEffect(() => {
    if (!query.trim()) {
      setContacts([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchContacts(query.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, fetchContacts]);

  const handleSelect = (id: string) => {
    const contact = contacts.find((c) => String(c.id) === id);
    if (!contact) return;

    setSelectedContact(contact);
    setContacts([]);
    setQuery("");
    setCardVisible(true);
  };

  const handleCloseCard = () => {
    setCardVisible(false);
    setSelectedContact(null);
  };

  return (
    <div className="w-full p-3 shadow-2xl bg-zinc-100 rounded-lg flex flex-col gap-3 text-md font-extrabold relative">
      <div className="flex justify-end items-center gap-3 relative w-full">
        <p className="text-cyan-950 text-lg">Busque um contato:</p>
        <div className="relative w-1/3">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedContact(null);
            }}
            className="w-full border-2 border-cyan-950"
            placeholder="Digite o nome..."
          />

          {contacts.length > 0 && (
            <ul className="absolute left-0 right-0 mt-1 bg-white border border-cyan-950 rounded-md shadow-md z-50">
              {contacts.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.id.toString())}
                    className="w-full text-left px-3 py-2 hover:bg-cyan-100 font-bold text-cyan-900 focus:bg-cyan-200 focus:outline-none"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {loading && <p className="text-cyan-900">🔄 Buscando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {selectedContact && cardVisible && (
        <div className="p-1 bg-white border border-cyan-950 rounded-md shadow-md w-1/3 ml-auto mr-[34px] flex gap-16">
          <div>
            <p className="text-cyan-900 text-sm font-bold">
              {selectedContact.name}
            </p>
            <p className="text-cyan-800 text-sm">{selectedContact.number}</p>
          </div>
          <button
            onClick={handleCloseCard}
            className="bg-zinc-300 p-1 rounded hover:bg-zinc-400 self-start ml-5"
          >
            <X  size={12}/>
          </button>
        </div>
      )}
    </div>
  );
}

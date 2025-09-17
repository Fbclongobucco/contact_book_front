import { useState } from "react";
import { Input } from "../ui/input";
import { Contact } from "@/types/contacts";

export function FindContact(){

    const [contact, setContact] = useState<Contact | null> (null)

    return(
        <div className="w-full h-20 p-3 shadow-2xl bg-zinc-100 rounded-lg flex text-md font-extrabold justify-end items-center">
            <p className="text-cyan-950 text-lg px-3">busque um contato: </p>
            <Input className="w-1/3 border-3 border-cyan-950 "/>
        </div>
    )
}
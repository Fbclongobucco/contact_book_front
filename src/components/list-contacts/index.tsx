"use client"
import { Contact } from "@/types/contacts";
import { ContactItem } from "../contact";
import { useState, useEffect } from "react";

export function ListContacts({ contacts }: { contacts?: Contact[] }) {

    const [contactList, setContactList] = useState<Contact[]>([]);

    useEffect(() => {
        if (contacts) {
            setContactList(contacts);
        }
    }, [contacts]); 


    function handleDelete(id: number) {
        setContactList(prev => prev.filter(c => c.id !== id));
    }

    return (
        <div className="w-[1000px] p-3 shadow-2xl bg-zinc-100 rounded-lg font-bold flex flex-col gap-5">
            {contactList.map(item => (
                <ContactItem 
                    key={item.id} 
                    contact={item} 
                    onDelete={handleDelete} 
                />
            ))}
        </div>
    )
}

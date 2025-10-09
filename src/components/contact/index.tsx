import { Contact } from "@/types/contacts";
import { Edit, Trash } from "lucide-react";
import { Roboto } from "next/font/google"
import Link from "next/link";
import Cookies from "js-cookie";


const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500", "700"],
})

export function ContactItem({ contact, onDelete }: { contact: Contact; onDelete: (id: number) => void }) {

    const accessToken = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")

    const ddd = contact.number.slice(0, 2) 
    const formatedNumber = `(${ddd})`

  async function deleteContact() {
    if (!accessToken) return alert("Você precisa estar logado");

    const confirmDelete = confirm(`Deseja realmente deletar ${contact.name}?`);
    if (!confirmDelete) return;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/contact/${contact.id}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            const refreshRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: refreshToken }),
                }
            );

            if (!refreshRes.ok) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                alert("Sua sessão expirou. Faça login novamente.");
                return;
            }

            const { accessToken: newAccessToken } = await refreshRes.json();
            Cookies.set("accessToken", newAccessToken);
        }

        alert("Contato deletado com sucesso!");
        onDelete(contact.id)

    } catch (err) {
        console.error(err);
        alert("Erro ao deletar contato");
    }
}


    return (
        <div className="flex justify-between  w-full items-center ">
            <div className={`flex border-b sm:w-[50%] w-[80%] sm:justify-between justify-between mr-5 sm:mr-0 ${roboto.className}`}>
                <p className="sm:text-[18px] text-[14px] max-w-[38%] sm:w-72  text-cyan-900 truncate">{contact.name}:</p>
                <p className="sm:text-[16px] text-[12px] min-w-11 text-cyan-900 ">{formatedNumber} {contact.number.slice(2)}</p>
            </div>
            <div className="flex gap-4 border-b">
                <Link className="flex items-center justify-center" href={`/update/${contact.id}`}><Edit color="#164E63"/></Link>
                <button onClick={deleteContact} className="flex items-center justify-center"><Trash className="cursor-pointer" color="#164E63"/></button>
            </div>
        </div>
    )
}
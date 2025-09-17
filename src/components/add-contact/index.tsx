import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import Cookies from "js-cookie"
import { TokenPayload } from "@/types/token-payload";
import { jwtDecode } from "jwt-decode";


const schema = z.object({
    name: z.string().min(3, "o nome do contato deve ter pelo menos 3 letras").max(100, "o nome do contato deve ter até 100 letras"),
    number: z.string()
        .min(11, "O número deve ter pelo menos 11 dígitos")
        .max(11, "O número deve ter no máximo 11 dígitos")
        .regex(/^\d+$/, "O número deve conter apenas dígitos")
})

export function AddContact({ onContactAdded }: { onContactAdded: () => void }) {

    type FormInputs = z.infer<typeof schema>


    const {
        register,
        handleSubmit,
        formState: { errors }, reset
    } = useForm<FormInputs>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", number: "" },
    })



    const [enable, setEnable] = useState(false)
    const accessToken = Cookies.get("accessToken")


    function setVisible() {
        setEnable(!enable)
    }

    async function submitForm(data: FormInputs) {

        if (!accessToken) return

        const payload: TokenPayload = jwtDecode<TokenPayload>(accessToken)

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contact/${payload.sub}`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: data.name, number: data.number })
                }
            );

            if (res.status !== 201) {
                alert("erro ao enviar!")
            }

            setEnable(!enable)
            alert("contato criado com sucesso!")
            reset({ name: "", number: "" })

            onContactAdded()

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="bg-white rounded-2xl w-2/4 mr-2 flex justify-center items-center relative">
            <Button disabled={enable} className="text-lg font-extrabold text-cyan-950 cursor-pointer" onClick={setVisible} variant="outline">Adicionar contato <Plus /> </Button>
            <div className={`absolute w-[450px] h-48 bg-white top-20 z-50 rounded-2xl p-2 justify-center flex-col ${enable ? "flex" : "hidden"}`}>
                <button className="self-end border m-1 cursor-pointer" onClick={()=> setEnable(false)}><X/></button>
                <form onSubmit={handleSubmit((submitForm))} className="flex flex-col">
                    <Input {...register("name")} placeholder="Nome"  className="text-cyan-900 font-bold placeholder:text-zinc-400 autofill:bg-white autofill:text-cyan-900" />
                    <div className="h-5">{errors.name?.message && <p className="text-red-500 text-sm" >{errors.name.message}</p>}</div>
                    <Input {...register("number")} placeholder="Número" className="text-cyan-900 font-bold placeholder:text-zinc-400 autofill:bg-white autofill:text-cyan-900" />
                    <div className="h-5">{errors.number?.message && <p className="text-red-500 text-sm" >{errors.number.message}</p>}</div>
                    <Button disabled={!!errors.name?.message || !!errors.number?.message} variant="outline" className="text-cyan-50 font-extrabold bg-cyan-700 cursor-pointer hover:bg-cyan-900 hover:text-cyan-200">salvar</Button>
                </form>
            </div>
        </div>
    )
}
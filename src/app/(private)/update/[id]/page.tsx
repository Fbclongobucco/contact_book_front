"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect} from "react"
import Cookies from "js-cookie"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    number: z
        .string()
        .max(11, "O número precisa ter até 11 dígitos")
        .min(8, "O número precisa ter pelo menos 8 dígitos"),
})

export default function UpdateContact() {
    type FormInputs = z.infer<typeof schema>
  
    const params = useParams()
    const accessToken = Cookies.get("accessToken")
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormInputs>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", number: "" },
    })

    useEffect(() => {
        if (!accessToken) return

        const fetchData = async () => {
            try {
                const contactsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/contact/${params.id}`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                )

                const data = await contactsRes.json()
             
                reset({ name: data.name, number: data.number }) 
            } catch (err) {
                console.error(err)
                alert("falha ao atualizar")
            }
        }
        fetchData()
    }, [params.id, accessToken, reset])

    async function updateForm(data: FormInputs) {
        if (!accessToken) return

        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/contact/${params.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(data),
                }
            )
            alert("Contato atualizado com sucesso!")
            router.push("/dashboard")
            
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main className="w-full h-[calc(100vh-112px)] bg-gradient-to-b from-cyan-200 to-zinc-300 flex justify-center items-center">
            <div className="w-[600px] h-80 bg-zinc-100 rounded-md p-5 text-center shadow-md">
                <h2 className="text-xl font-bold mb-4">Atualizar contato</h2>
                <form
                    onSubmit={handleSubmit(updateForm)}
                    className="flex flex-col gap-5 justify-center items-center h-full"
                >
                    <div className="w-full">
                        <Input placeholder="Nome" {...register("name")} />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Input placeholder="Número" {...register("number")} />
                        {errors.number && (
                            <p className="text-red-500 text-sm">{errors.number.message}</p>
                        )}
                    </div>

                    <button
                        className="px-7 py-2.5 bg-cyan-950 text-zinc-200 font-bold rounded-md hover:bg-cyan-800"
                        type="submit"
                    >
                        Atualizar
                    </button>
                </form>
            </div>
        </main>
    )
}

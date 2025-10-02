"use client"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import Cookies from "js-cookie"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import Link from "next/link"

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
        <main className="w-full min-h-screen bg-gradient-to-b from-cyan-200 to-zinc-300 flex justify-center items-center p-4">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-zinc-100 rounded-xl p-6 sm:p-8 text-center shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-cyan-950">Atualizar contato</h2>
                <form
                    onSubmit={handleSubmit(updateForm)}
                    className="flex flex-col gap-5 sm:gap-6 justify-center items-center"
                >
                    <div className="w-full">
                        <Input
                            placeholder="Nome"
                            {...register("name")}
                            className="text-base sm:text-lg md:text-xl h-12 sm:h-14 px-4 font-bold text-cyan-800 placeholder:text-zinc-500"
                        />

                        {errors.name && (
                            <p className="text-red-500 text-base sm:text-lg mt-2 font-medium">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Input
                            placeholder="Número"
                            {...register("number")}
                            className="text-lg h-12 sm:h-14 px-4 font-bold text-cyan-800 placeholder:text-zinc-500"
                        />
                        {errors.number && (
                            <p className="text-red-500 text-base sm:text-lg mt-2 font-medium">{errors.number.message}</p>
                        )}
                    </div>

                    <div className="flex justify-between items-center w-full sm:w-4/5 md:w-3/5 gap-4 mt-4">
                        <button
                            className="px-6 sm:px-8 py-3 bg-cyan-950 text-zinc-200 font-bold rounded-lg hover:bg-cyan-800 transition-colors text-lg w-full sm:w-auto"
                            type="submit"
                        >
                            Atualizar
                        </button>
                        <Link
                            className="underline font-bold text-lg sm:text-xl text-cyan-950 hover:text-cyan-800 transition-colors whitespace-nowrap"
                            href="/dashboard"
                        >
                            voltar
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    )
}
"use client"
import z from "zod";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation"

const schema = z.object({
    name: z.string().min(3, " o nome deve possuir pelo menos 3 letras"),
    cpf: z.string()
        .min(1, "o numero deve conter 11 dígitos")
        .max(11, "o numero deve conter 11 dígitos")
        .regex(/^\d+$/, "O número deve conter apenas dígitos"),
    email: z.email("email inválido").transform((val) => val.toLowerCase()),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres"),
    repeatPassword: z.string().min(6, "A senha deve conter pelo menos 6 caracteres"),
    birthday: z.string()
        .refine((val) => new Date(val) < new Date(), {
            message: "A data deve estar no passado",
        })
}).refine((data) => data.password === data.repeatPassword, {
    message: "As senhas devem ser iguais",
    path: ["repeatPassword"],
});

export function FormRegister() {

    const router = useRouter()

    type FormInputs = z.infer<typeof schema>

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>({
        resolver: zodResolver(schema)
    })

    async function registerFormSubmit(data: FormInputs) {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: data.name, email: data.email, cpf: data.cpf, password: data.password, birthday: data.birthday })
                }
            );

            alert("usuário criado com sucesso!")

            router.push("/")


        } catch (error) {
            console.log(error)
            alert("erro ao criar usuário!")
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(registerFormSubmit)} className="w-[560px] h-[600px] bg-white p-3 flex justify-center items-center flex-col rounded-2xl">
                <h2 className="text-center text-cyan-950 font-bold text-2xl">Cadastro</h2>
                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="name">NOME</Label>
                <Input className="text-lg text-cyan-950 font-semibold" {...register("name")} />
                <div className="h-6 p-2">{errors.name?.message && <p className="text-sm text-red-400 ">{errors.name.message}</p>}</div>
                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="email">EMAIL</Label>
                <Input className="text-lg text-cyan-950 font-semibold"  {...register("email")} />
                <div className="h-6 p-2">{errors.email?.message && <p className="text-sm text-red-400 ">{errors.email.message}</p>}</div>
                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="cpf">CPF</Label>
                <Input className="text-lg text-cyan-950 font-semibold"  {...register("cpf")} />
                <div className="h-6 p-2">{errors.cpf?.message && <p className="text-sm text-red-400 ">{errors.cpf.message}</p>}</div>
                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="password">CRIE UMA SENHA</Label>
                <Input className="text-lg text-cyan-950 font-semibold" type="password" {...register("password")} />
                <div className="h-6 p-2">{errors.password?.message && <p className="text-sm text-red-400 ">{errors.password.message}</p>}</div>
                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="repeatePassword">REPITA A SENHA</Label>
                <Input className="text-lg text-cyan-950 font-semibold" type="password" {...register("repeatPassword")} />
                <div className="h-6 p-2">{errors.repeatPassword?.message && <p className="text-sm text-red-400 ">{errors.repeatPassword.message}</p>}</div>
                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="birthday">DATA DE ANIVERSÁRIO</Label>
                <Input className="text-lg text-cyan-950 font-semibold"  {...register("birthday")} type="date" />
                <div className="h-6 p-2">{errors.birthday?.message && <p className="text-sm text-red-400 ">{errors.birthday.message}</p>}</div>
                <Button className="bg-cyan-700 text-cyan-50 hover:bg-cyan-900 transition-all duration-500 cursor-pointer" variant="secondary" type="submit">cadastrar</Button>
            </form>
        </div>
    )
}
"use client"
import z from "zod";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { TokenPayload } from "@/types/token-payload";
import { jwtDecode } from "jwt-decode";

const schema = z.object({
    name: z.string().min(3, "o nome deve possuir pelo menos 3 letras"),
    cpf: z.string()
        .min(11, "o número deve conter 11 dígitos")
        .max(11, "o número deve conter 11 dígitos")
        .regex(/^\d+$/, "O número deve conter apenas dígitos"),
    birthday: z.string()
        .refine((val) => new Date(val) < new Date(), {
            message: "A data deve estar no passado",
        }),
});

export function EditProfile() {
    const router = useRouter();
    const accessToken = Cookies.get("accessToken");

    type FormInputs = z.infer<typeof schema>;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const token = Cookies.get("accessToken");
        if (!token) return router.push("/");

        const payload: TokenPayload = jwtDecode<TokenPayload>(token);

        const fetchData = async () => {
            try {
                const userRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/${payload.sub}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const userData = await userRes.json();

                const [day, month, year] = userData.birthday.split("/");

                reset({
                    name: userData.name,
                    cpf: userData.cpf,
                    birthday: `${year}-${month}-${day}`,

                });
            } catch (err) {
                console.error(err);
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                router.push("/");
            }
        };
        fetchData();
    }, [router, reset]);

    async function registerFormSubmit(data: FormInputs) {
        try {
            const payload: TokenPayload = jwtDecode<TokenPayload>(accessToken!);

            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/${payload.sub}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        name: data.name,
                        cpf: data.cpf,
                        birthday: data.birthday,
                    }),
                }
            );

            alert("Usuário atualizado com sucesso!");
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar usuário!");
        }
    }

    return (
        <div className="w-full mx-1 sm:flex justify-center items-center my-4">
            <form
                onSubmit={handleSubmit(registerFormSubmit)}
                className="sm:w-[560px] sm:h-[600px] w-full bg-white p-5 flex justify-center items-center flex-col rounded-2xl gap-5"
            >
                <h2 className="text-center text-cyan-950 font-bold text-2xl">
                    Atualizar usuário
                </h2>

                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="name">
                    NOME
                </Label>
                <Input className="lg:text-3xl md:text-3xl text-cyan-950 font-semibold" {...register("name")} />
                <div className="h-6 p-2">
                    {errors.name?.message && <p className="text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="cpf">
                    CPF
                </Label>
                <Input className="lg:text-lg  text-cyan-950 font-semibold" {...register("cpf")} />
                <div className="h-6 p-2">
                    {errors.cpf?.message && <p className="text-sm text-red-400">{errors.cpf.message}</p>}
                </div>

                <Label className="text-left w-full text-cyan-950 font-semibold" htmlFor="birthday">
                    DATA DE ANIVERSÁRIO
                </Label>
                <Input
                    className="text-lg text-cyan-950 font-semibold"
                    {...register("birthday")}
                    type="date"
                />
                <div className="h-6 p-2">
                    {errors.birthday?.message && (
                        <p className="text-sm text-red-400">{errors.birthday.message}</p>
                    )}
                </div>

                <Button
                    className="bg-cyan-700 text-cyan-50 hover:bg-cyan-900 transition-all duration-500 cursor-pointer"
                    variant="secondary"
                    type="submit"
                >
                    atualizar
                </Button>
            </form>
        </div>
    );
}

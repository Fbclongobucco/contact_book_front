"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.email("email inválido!"),
  password: z.string().min(6, "senha deve conter pelo menos 6 caractares!")
})

export function Login() {
  type LoginFormInputs = z.infer<typeof schema>;

  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("Dados enviados:", data);


      if (!response.ok) throw new Error("Credenciais inválidas");

      const tokens = await response.json();

      Cookies.set("accessToken", tokens.accessToken, { secure: true, sameSite: "strict" });
      Cookies.set("refreshToken", tokens.refreshToken, { secure: true, sameSite: "strict" });

      reset();
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Falha ao logar, verifique email e senha.");
    }
  };

  return (
    <Card className="w-[400px] h-[500px] bg-gradient-to-b from-cyan-200 to-zinc-50 flex justify-start shadow-2xl">
      <CardHeader>
        <CardTitle className="self-center text-[26px]">Bem vindo ao <span className="text-cyan-800">Contact Book</span></CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
          <div className="h-28 flex flex-col mt-11">
            <Input {...register("email")} placeholder="digite seu email..." className="italic h-14 bg-zinc-200 !text-[19px] text-cyan-950 font-semibold" />
            <div className="h-6 text-sm text-red-400">{errors.email?.message}</div>
            <Input {...register("password")} type="password" placeholder="digite sua senha..." className="italic bg-zinc-200 h-14 !text-[19px] text-cyan-950 font-semibold" />
            <div className="h-6 text-sm text-red-400">{errors.password?.message}</div>
          </div>
          <div className="flex justify-center flex-col">
            <Button type="submit" className="w-full cursor-pointer text-lg">login</Button>
            <Link className="text-sm self-end" href="/password-forgot">esqueceu a senha?</Link>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link className="italic underline font-bold text-sm text-cyan-900" href="/register">AINDA NÃO TEM CADASTRO? FAÇA AGORA!</Link>
      </CardFooter>
    </Card>
  )
}

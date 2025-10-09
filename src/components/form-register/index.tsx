"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

const schema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100, "O nome deve ter no máximo 100 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string()
    .min(11, "O CPF deve ter 11 dígitos")
    .max(11, "O CPF deve ter 11 dígitos")
    .regex(/^\d+$/, "O CPF deve conter apenas números"),
  birthday: z.string().min(1, "A data de nascimento é obrigatória"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

type FormInputs = z.infer<typeof schema>

export function FormRegister() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<FormInputs>({
    resolver: zodResolver(schema)
  })

  async function submitForm(data: FormInputs) {
    setLoading(true)
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          birthday: data.birthday,
          password: data.password
        })
      })

      if (res.status === 409) {
        setError("email", { message: "Email já cadastrado" })
        return
      }

      if (!res.ok) {
        throw new Error("Erro ao cadastrar")
      }

      const { accessToken, refreshToken } = await res.json()
      
      Cookies.set("accessToken", accessToken)
      Cookies.set("refreshToken", refreshToken)
      
      router.push("/")
    } catch (error) {
      console.error(error)
      setError("root", { message: "Erro ao realizar cadastro" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
      <h1 className="text-4xl font-bold text-cyan-950 text-center mb-10">
        Criar Conta
      </h1>

      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-6">
        <div>
          <Input
            {...register("name")}
            placeholder="Nome completo"
            className="w-full text-cyan-900 font-semibold placeholder:text-zinc-500  lg:text-[20px] md:text-[16px] h-16 text-2xl px-4"
          />
          {errors.name?.message && (
            <p className="text-red-600 text-lg font-medium mt-2">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full text-cyan-900 font-semibold placeholder:text-zinc-500 text-xl h-16 px-4 lg:text-[20px] md:text-[16px]"
          />
          {errors.email?.message && (
            <p className="text-red-600 text-lg font-medium mt-2">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Input
              {...register("cpf")}
              placeholder="CPF"
              className="w-full text-cyan-900 font-semibold placeholder:text-zinc-500 text-xl h-16 px-4 lg:text-[20px] md:text-[16px]"
            />
            {errors.cpf?.message && (
              <p className="text-red-600 text-lg font-medium mt-2">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("birthday")}
              type="date"
              className="w-full text-cyan-900 font-semibold placeholder:text-zinc-500 text-xl h-16 px-4 lg:text-[20px] md:text-[16px]"
            />
            {errors.birthday?.message && (
              <p className="text-red-600 text-lg font-medium mt-2">{errors.birthday.message}</p>
            )}
          </div>
        </div>

        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            className="w-full text-cyan-900 font-semibold placeholder:text-zinc-500 text-xl h-16 px-4 pr-14 lg:text-[20px] md:text-[16px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-600 hover:text-zinc-800"
          >
            {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
          </button>
          {errors.password?.message && (
            <p className="text-red-600 text-lg font-medium mt-2">{errors.password.message}</p>
          )}
        </div>

        <div className="relative">
          <Input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar senha"
            className="w-full text-cyan-900 font-semibold placeholder:text-zinc-500 text-xl h-16 px-4 pr-14 lg:text-[20px] md:text-[16px]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-600 hover:text-zinc-800"
          >
            {showConfirmPassword ? <EyeOff size={28} /> : <Eye size={28} />}
          </button>
          {errors.confirmPassword?.message && (
            <p className="text-red-600 text-lg font-medium mt-2">{errors.confirmPassword.message}</p>
          )}
        </div>

        {errors.root?.message && (
          <p className="text-red-600 text-lg font-medium text-center mt-2">{errors.root.message}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-700 text-white font-bold py-5 text-2xl hover:bg-cyan-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>

      <p className="text-center text-zinc-700 mt-10 text-xl">
        Já tem uma conta?{" "}
        <a href="/contact-book" className="text-cyan-700 hover:text-cyan-800 font-bold text-xl">
          Fazer login
        </a>
      </p>
    </div>
  )
}
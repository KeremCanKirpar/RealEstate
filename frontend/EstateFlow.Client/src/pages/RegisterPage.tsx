import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../hooks/useAuth";

const schema = z.object({
  fullName: z.string().min(2, "Ad soyad gerekli"),
  email: z.string().email("Geçerli bir e-posta gerekli"),
  password: z.string().min(8, "En az 8 karakter kullanın"),
});

type RegisterValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { register: registerUser, isAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
  });

  if (isAuthenticated) {
    return <Navigate to="/panel/dashboard" replace />;
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-primary px-6 py-10">
      <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3" alt="Gayrimenkul ofisi" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(253,213,137,0.18),transparent_36%)]" />

      <section className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 shadow-modal backdrop-blur-xl sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white shadow-luxury">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-black text-primary">EstateFlow</h1>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Danışman erişimi oluştur</p>
            </div>
          </div>

          <form
            className="grid gap-4"
            onSubmit={handleSubmit(async (values) => {
              setError("");
              try {
                await registerUser(values);
              } catch (exception) {
                setError(exception instanceof Error ? exception.message : "Kayıt başarısız");
              }
            })}
          >
            <Input label="Ad soyad" error={errors.fullName?.message} {...register("fullName")} />
            <Input label="E-posta" error={errors.email?.message} {...register("email")} />
            <Input label="Şifre" type="password" error={errors.password?.message} {...register("password")} />
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
            <Button type="submit" className="mt-2 bg-secondary text-white shadow-luxury hover:bg-secondary/90" disabled={isSubmitting}>
              Hesap oluştur
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Zaten hesabınız var mı?{" "}
            <Link className="font-bold text-primary hover:text-secondary" to="/panel/login">
              Giriş yap
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

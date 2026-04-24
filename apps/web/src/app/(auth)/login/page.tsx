import Link from "next/link";
import { Hexagon } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Dynamic background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md px-8 py-10 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-4">
            <Hexagon size={28} className="fill-primary/20" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Добро пожаловать</h1>
          <p className="text-sm text-zinc-400 text-center">
            Войдите в свой аккаунт HexaCash для управления продажами и сделками
          </p>
        </div>

        <form className="space-y-4" action="">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-zinc-600"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                Пароль
              </label>
              <Link href="#" className="text-xs text-primary hover:underline">
                Забыли пароль?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-zinc-600"
              required
            />
          </div>
          <button
            type="button"
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-colors shadow-lg shadow-primary/25 mt-2"
          >
            Войти в систему
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-400">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Подать заявку
          </Link>
        </div>
      </div>
    </div>
  );
}

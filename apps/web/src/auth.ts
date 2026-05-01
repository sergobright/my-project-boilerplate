import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/db";
// import bcrypt from "bcryptjs"; // Раскомментировать когда будет реальная логика входа

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;

          // TODO: Реализовать проверку bcrypt
          // const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
          // if (passwordsMatch) return user;
          
          // Временная заглушка для Boilerplate
          if (password === "password") {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              // Можно передавать дополнительные параметры в токен
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login', // TODO: создать страницу логина
  },
  session: { strategy: "jwt" }
});

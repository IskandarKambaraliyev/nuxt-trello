import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "~/server/models/User.model";

async function getUser(id: string) {
  const user = await User.findById(id);
  return user?.toJSON();
}

export default NuxtAuthHandler({
  secret: useRuntimeConfig().auth.secret,
  pages: {
    signIn: "/auth/signin"
  },
  providers: [
    // @ts-ignore
    CredentialsProvider.default({
      name: "credentials",
      origin: useRuntimeConfig().auth.origin,

      async authorize(credentials: { email: string; password: string }) {
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await user.comparePassword(credentials.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return user.toObject();
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, user}) {
      if(user) {
        token = {
          ...token,
          ...user
        }
      }

      return token;
    },
    async session({session, token}) {
      // @ts-expect-error
      const refreshedUser = await getUser(token._id);

      session.user = {
        ...token,
        ...session.user,
        ...refreshedUser
      }

      return session;
    }
  }
});

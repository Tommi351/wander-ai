import { checkUser } from "./lib/checkUser";

export async function requireUser() {
  const user = await checkUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

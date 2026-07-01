import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "../lib/db";

export const checkUser = async () => {
  const user = await currentUser();
  // Check for current logged in Clerk user
  if (!user) return null;

  // Check if user is in the database
  const loggedInUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });
  // If user is in database, return user
  if (loggedInUser) {
    return loggedInUser;
  }
  // 3. Extract the primary email from Clerk's array structure safely
  const emailAddress = user.emailAddresses?.[0]?.emailAddress;
  if (!emailAddress) {
    throw new Error("No primary email address found for this Clerk user.");
  }
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  // If not in database, create the new user
  const newUser = await prisma.user.create({
    data: { clerkId: user.id, email: emailAddress, fullName: fullName },
  });
  return newUser;
};

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";

export async function updateCountry(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const country = formData.get("country");
  if (typeof country !== "string" || !isValidCountry(country)) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { countryCode: country },
  });
  cookies().set(COUNTRY_COOKIE, country, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/account");
}

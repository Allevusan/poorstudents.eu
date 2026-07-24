import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { COUNTRY_COOKIE, isValidCountry } from "@/lib/countries";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const country = body?.country;
  if (!isValidCountry(country)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }

  cookies().set(COUNTRY_COOKIE, country, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  const user = await getCurrentUser();
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { countryCode: country },
    });
  }

  return NextResponse.json({ ok: true });
}

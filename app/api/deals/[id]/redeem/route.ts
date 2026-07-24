import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getViewer } from "@/lib/viewer";
import { canAccess, isAvailableIn } from "@/lib/access";

/**
 * The only place codes and redemption URLs ever leave the server.
 * Reveals the deal's code (assigning a unique one if needed), logs a
 * Redemption, and returns { code, url }.
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
    include: { merchant: { select: { isActive: true, availableCountries: true } } },
  });
  if (!deal || !deal.merchant.isActive) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  const { user, country } = await getViewer();

  if (!isAvailableIn(deal.merchant.availableCountries, user?.countryCode || country)) {
    return NextResponse.json({ error: "Not available in your country" }, { status: 403 });
  }
  if (!canAccess(user, deal, country)) {
    if (deal.requiresAccount && !user) {
      return NextResponse.json({ requiresAccount: true }, { status: 401 });
    }
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  let code: string | null = null;
  let codeId: string | null = null;

  if (deal.redemptionType === "STATIC_CODE") {
    code = deal.staticCode ?? null;
  } else if (deal.redemptionType === "UNIQUE_CODE") {
    // Unique codes are personal, so they need someone to assign them to.
    if (!user) {
      return NextResponse.json({ requiresAccount: true }, { status: 401 });
    }

    // If this user was already assigned a code, always return that same one.
    const existing = await prisma.couponCode.findFirst({
      where: { dealId: deal.id, assignedToUserId: user.id },
    });
    if (existing) {
      code = existing.code;
      codeId = existing.id;
    } else {
      // Claim the first unassigned code atomically. SKIP LOCKED means two
      // students clicking at the same moment can never get the same code.
      const claimed = await prisma.$queryRaw<{ id: string; code: string }[]>`
        UPDATE "CouponCode"
        SET "assignedToUserId" = ${user.id}, "assignedAt" = NOW()
        WHERE id = (
          SELECT id FROM "CouponCode"
          WHERE "dealId" = ${deal.id} AND "assignedToUserId" IS NULL
          ORDER BY id
          LIMIT 1
          FOR UPDATE SKIP LOCKED
        )
        RETURNING id, code
      `;
      if (claimed.length === 0) {
        return NextResponse.json({ outOfCodes: true }, { status: 200 });
      }
      code = claimed[0].code;
      codeId = claimed[0].id;
    }
  }
  // LINK_ONLY: no code, just the URL.

  await prisma.redemption.create({
    data: {
      userId: user?.id ?? null,
      dealId: deal.id,
      codeId,
      countryCode: user?.countryCode || country || "",
    },
  });

  return NextResponse.json({ code, url: deal.redemptionUrl });
}

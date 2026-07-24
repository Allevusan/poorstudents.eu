"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Category, RedemptionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { isCategory } from "@/lib/categories";

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/** "ALL" or a comma/space separated list of ISO codes -> string[] */
function parseCountries(input: string): string[] {
  const cleaned = input.trim().toUpperCase();
  if (!cleaned || cleaned === "ALL") return ["ALL"];
  return Array.from(
    new Set(
      cleaned
        .split(/[\s,;]+/)
        .map((c) => c.trim())
        .filter((c) => /^[A-Z]{2}$/.test(c))
    )
  );
}

function parseCategory(input: string): Category {
  if (!isCategory(input)) throw new Error(`Invalid category: ${input}`);
  return input;
}

// ---------- Merchants ----------

export async function upsertMerchant(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    name: str(formData, "name"),
    slug: str(formData, "slug").toLowerCase(),
    logoUrl: str(formData, "logoUrl") || null,
    websiteUrl: str(formData, "websiteUrl"),
    description: str(formData, "description"),
    category: parseCategory(str(formData, "category")),
    availableCountries: parseCountries(str(formData, "availableCountries")),
    contactEmail: str(formData, "contactEmail"),
    isActive: formData.get("isActive") === "on",
  };
  if (!data.name || !data.slug) throw new Error("Name and slug are required");

  if (id) {
    await prisma.merchant.update({ where: { id }, data });
  } else {
    await prisma.merchant.create({ data });
  }
  revalidatePath("/admin/merchants");
  redirect("/admin/merchants");
}

export async function deleteMerchant(formData: FormData) {
  await requireAdmin();
  await prisma.merchant.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/merchants");
}

// ---------- Deals ----------

export async function upsertDeal(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const expiresAtRaw = str(formData, "expiresAt");
  const data = {
    merchantId: str(formData, "merchantId"),
    title: str(formData, "title"),
    description: str(formData, "description"),
    discountLabel: str(formData, "discountLabel"),
    category: parseCategory(str(formData, "category")),
    redemptionType: str(formData, "redemptionType") as RedemptionType,
    staticCode: str(formData, "staticCode") || null,
    redemptionUrl: str(formData, "redemptionUrl"),
    terms: str(formData, "terms"),
    availableCountries: parseCountries(str(formData, "availableCountries")),
    requiresAccount: formData.get("requiresAccount") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    isActive: formData.get("isActive") === "on",
  };
  if (!["STATIC_CODE", "UNIQUE_CODE", "LINK_ONLY"].includes(data.redemptionType)) {
    throw new Error("Invalid redemption type");
  }
  if (!data.title || !data.merchantId) throw new Error("Title and merchant are required");

  if (id) {
    await prisma.deal.update({ where: { id }, data });
  } else {
    await prisma.deal.create({ data });
  }
  revalidatePath("/admin/deals");
  redirect("/admin/deals");
}

export async function deleteDeal(formData: FormData) {
  await requireAdmin();
  await prisma.deal.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/deals");
}

/** Paste a newline-separated list of codes into a deal's coupon pool. */
export async function uploadCoupons(formData: FormData) {
  await requireAdmin();
  const dealId = str(formData, "dealId");
  const codes = Array.from(
    new Set(
      str(formData, "codes")
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean)
    )
  );
  if (codes.length > 0) {
    await prisma.couponCode.createMany({
      data: codes.map((code) => ({ dealId, code })),
      skipDuplicates: true,
    });
  }
  revalidatePath(`/admin/deals/${dealId}`);
  redirect(`/admin/deals/${dealId}`);
}

// ---------- Institutions ----------

export async function upsertInstitution(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const data = {
    name: str(formData, "name"),
    countryCode: str(formData, "countryCode").toUpperCase(),
    emailDomains: Array.from(
      new Set(
        str(formData, "emailDomains")
          .toLowerCase()
          .split(/[\s,;\n]+/)
          .map((d) => d.trim())
          .filter(Boolean)
      )
    ),
    isActive: formData.get("isActive") === "on",
  };
  if (!data.name || data.emailDomains.length === 0) {
    throw new Error("Name and at least one domain are required");
  }

  if (id) {
    await prisma.institution.update({ where: { id }, data });
  } else {
    await prisma.institution.create({ data });
  }
  revalidatePath("/admin/institutions");
  redirect("/admin/institutions");
}

export async function deleteInstitution(formData: FormData) {
  await requireAdmin();
  await prisma.institution.delete({ where: { id: str(formData, "id") } });
  revalidatePath("/admin/institutions");
}

/**
 * Promote an unknown domain to a proper institution and mark it resolved.
 * Retro-tags existing users on that domain as academic.
 */
export async function resolveDomain(formData: FormData) {
  await requireAdmin();
  const domainId = str(formData, "domainId");
  const name = str(formData, "name");
  const countryCode = str(formData, "countryCode").toUpperCase();

  const unknown = await prisma.unknownDomain.findUnique({ where: { id: domainId } });
  if (!unknown || !name) throw new Error("Domain not found or name missing");

  const institution = await prisma.institution.create({
    data: { name, countryCode, emailDomains: [unknown.domain] },
  });
  await prisma.unknownDomain.update({
    where: { id: domainId },
    data: { resolvedInstitutionId: institution.id },
  });
  await prisma.user.updateMany({
    where: { email: { endsWith: `@${unknown.domain}` } },
    data: { isAcademicEmail: true, institutionId: institution.id },
  });
  revalidatePath("/admin/domains");
}

import { prisma } from "@/lib/prisma";

/**
 * Soft verification: we never block anyone, we just measure a signal.
 *
 * Matches the email domain (and its parent domains, so
 * jane@student.tudelft.nl matches tudelft.nl) against the Institution table.
 * On a match the user gets isAcademicEmail = true and a linked institution;
 * otherwise the domain is counted in UnknownDomain. Either way, full access.
 */
export async function classifyEmailDomain(email: string): Promise<{
  isAcademicEmail: boolean;
  institutionId: string | null;
  institutionCountry: string | null;
}> {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) {
    return { isAcademicEmail: false, institutionId: null, institutionCountry: null };
  }

  // "student.tudelft.nl" -> ["student.tudelft.nl", "tudelft.nl"]
  const parts = domain.split(".");
  const candidates: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) {
    candidates.push(parts.slice(i).join("."));
  }

  const institution = await prisma.institution.findFirst({
    where: { isActive: true, emailDomains: { hasSome: candidates } },
  });

  if (institution) {
    return {
      isAcademicEmail: true,
      institutionId: institution.id,
      institutionCountry: institution.countryCode,
    };
  }

  await prisma.unknownDomain.upsert({
    where: { domain },
    create: { domain },
    update: { sightings: { increment: 1 }, lastSeenAt: new Date() },
  });

  return { isAcademicEmail: false, institutionId: null, institutionCountry: null };
}

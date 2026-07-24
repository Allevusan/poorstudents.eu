import { prisma } from "@/lib/prisma";
import DealForm from "../DealForm";

export default async function NewDealPage() {
  const merchants = await prisma.merchant.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-extrabold">New deal</h2>
      <DealForm merchants={merchants} />
    </div>
  );
}

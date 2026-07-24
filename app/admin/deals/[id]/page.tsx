import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DealForm from "../DealForm";
import { deleteDeal, uploadCoupons } from "../../actions";

export default async function EditDealPage({ params }: { params: { id: string } }) {
  const [deal, merchants] = await Promise.all([
    prisma.deal.findUnique({ where: { id: params.id } }),
    prisma.merchant.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!deal) notFound();

  const [poolTotal, poolAssigned] = await Promise.all([
    prisma.couponCode.count({ where: { dealId: deal.id } }),
    prisma.couponCode.count({ where: { dealId: deal.id, assignedToUserId: { not: null } } }),
  ]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold">Edit: {deal.title}</h2>
        <form action={deleteDeal}>
          <input type="hidden" name="id" value={deal.id} />
          <button
            type="submit"
            className="rounded-chunky border-2 border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Delete deal
          </button>
        </form>
      </div>
      <DealForm deal={deal} merchants={merchants} />

      {deal.redemptionType === "UNIQUE_CODE" && (
        <div className="card mt-6 max-w-2xl p-6">
          <h3 className="font-display text-lg font-extrabold">Coupon pool</h3>
          <p className="mt-1 text-sm text-ink/60">
            {poolTotal - poolAssigned} unassigned of {poolTotal} total.{" "}
            {poolTotal - poolAssigned === 0 && poolTotal > 0 && (
              <strong className="text-red-600">
                Pool empty — students see &quot;temporarily out of codes&quot;.
              </strong>
            )}
          </p>
          <form action={uploadCoupons} className="mt-4 flex flex-col gap-3">
            <input type="hidden" name="dealId" value={deal.id} />
            <textarea
              name="codes"
              rows={6}
              placeholder={"CODE-0001\nCODE-0002\nCODE-0003"}
              className="input font-mono text-sm"
            />
            <button type="submit" className="btn-primary self-start px-4 py-2 text-sm">
              Add codes (one per line, duplicates skipped)
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

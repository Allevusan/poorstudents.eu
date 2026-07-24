import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MerchantForm from "../MerchantForm";
import { deleteMerchant } from "../../actions";

export default async function EditMerchantPage({ params }: { params: { id: string } }) {
  const merchant = await prisma.merchant.findUnique({ where: { id: params.id } });
  if (!merchant) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold">Edit: {merchant.name}</h2>
        <form action={deleteMerchant}>
          <input type="hidden" name="id" value={merchant.id} />
          <button
            type="submit"
            className="rounded-chunky border-2 border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            Delete (removes its deals)
          </button>
        </form>
      </div>
      <MerchantForm merchant={merchant} />
    </div>
  );
}

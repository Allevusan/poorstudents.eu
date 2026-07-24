import type { Deal, Merchant } from "@prisma/client";
import { CATEGORIES } from "@/lib/categories";
import { upsertDeal } from "../actions";

export default function DealForm({
  deal,
  merchants,
}: {
  deal?: Deal;
  merchants: Pick<Merchant, "id" | "name">[];
}) {
  return (
    <form action={upsertDeal} className="card flex max-w-2xl flex-col gap-4 p-6">
      {deal && <input type="hidden" name="id" value={deal.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Merchant</label>
          <select name="merchantId" required defaultValue={deal?.merchantId ?? ""} className="input">
            <option value="" disabled>Pick a merchant</option>
            {merchants.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Discount label (loud!)</label>
          <input name="discountLabel" required defaultValue={deal?.discountLabel} className="input" placeholder="50% OFF" />
        </div>
      </div>
      <div>
        <label className="label">Title</label>
        <input name="title" required defaultValue={deal?.title} className="input" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" rows={3} required defaultValue={deal?.description} className="input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <select name="category" defaultValue={deal?.category ?? "STUDY_NOTES"} className="input">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Redemption type</label>
          <select name="redemptionType" defaultValue={deal?.redemptionType ?? "STATIC_CODE"} className="input">
            <option value="STATIC_CODE">Static code (same for everyone)</option>
            <option value="UNIQUE_CODE">Unique codes (from pool)</option>
            <option value="LINK_ONLY">Link only (no code)</option>
          </select>
        </div>
        <div>
          <label className="label">Static code (STATIC_CODE only)</label>
          <input name="staticCode" defaultValue={deal?.staticCode ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Redemption URL</label>
          <input name="redemptionUrl" type="url" required defaultValue={deal?.redemptionUrl} className="input" />
        </div>
        <div>
          <label className="label">Countries (&quot;ALL&quot; or &quot;SE, DK&quot;)</label>
          <input name="availableCountries" defaultValue={deal?.availableCountries.join(", ") ?? "ALL"} className="input" />
        </div>
        <div>
          <label className="label">Expires (optional)</label>
          <input
            name="expiresAt"
            type="date"
            defaultValue={deal?.expiresAt ? deal.expiresAt.toISOString().slice(0, 10) : ""}
            className="input"
          />
        </div>
      </div>
      <div>
        <label className="label">Terms</label>
        <textarea name="terms" rows={2} required defaultValue={deal?.terms} className="input" />
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" name="requiresAccount" defaultChecked={deal?.requiresAccount ?? false} className="h-5 w-5 accent-accent" />
          Requires account
        </label>
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" name="isFeatured" defaultChecked={deal?.isFeatured ?? false} className="h-5 w-5 accent-accent" />
          Featured on home
        </label>
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" name="isActive" defaultChecked={deal?.isActive ?? true} className="h-5 w-5 accent-accent" />
          Active
        </label>
      </div>
      <button type="submit" className="btn-primary self-start">
        {deal ? "Save changes" : "Create deal"}
      </button>
    </form>
  );
}

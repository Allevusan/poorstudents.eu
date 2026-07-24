import type { Merchant } from "@prisma/client";
import { CATEGORIES } from "@/lib/categories";
import { upsertMerchant } from "../actions";

export default function MerchantForm({ merchant }: { merchant?: Merchant }) {
  return (
    <form action={upsertMerchant} className="card flex max-w-2xl flex-col gap-4 p-6">
      {merchant && <input type="hidden" name="id" value={merchant.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input name="name" required defaultValue={merchant?.name} className="input" />
        </div>
        <div>
          <label className="label">Slug</label>
          <input name="slug" required defaultValue={merchant?.slug} className="input" placeholder="acme-notes" />
        </div>
        <div>
          <label className="label">Website URL</label>
          <input name="websiteUrl" type="url" required defaultValue={merchant?.websiteUrl} className="input" />
        </div>
        <div>
          <label className="label">Logo URL (optional)</label>
          <input name="logoUrl" type="url" defaultValue={merchant?.logoUrl ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Category</label>
          <select name="category" defaultValue={merchant?.category ?? "STUDY_NOTES"} className="input">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Contact email</label>
          <input name="contactEmail" type="email" required defaultValue={merchant?.contactEmail} className="input" />
        </div>
      </div>
      <div>
        <label className="label">Countries (&quot;ALL&quot; or codes like &quot;SE, DK&quot;)</label>
        <input
          name="availableCountries"
          defaultValue={merchant?.availableCountries.join(", ") ?? "ALL"}
          className="input"
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" rows={3} required defaultValue={merchant?.description} className="input" />
      </div>
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" name="isActive" defaultChecked={merchant?.isActive ?? true} className="h-5 w-5 accent-accent" />
        Active
      </label>
      <button type="submit" className="btn-primary self-start">
        {merchant ? "Save changes" : "Create merchant"}
      </button>
    </form>
  );
}

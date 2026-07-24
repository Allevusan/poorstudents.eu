/* eslint-disable @next/next/no-img-element */

const PALETTE = [
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700",
  "bg-lime-100 text-lime-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

export default function MerchantLogo({
  name,
  logoUrl,
  size = "md",
}: {
  name: string;
  logoUrl?: string | null;
  size?: "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "h-16 w-16 text-2xl" : "h-10 w-10 text-lg";
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className={`${sizeClass} rounded-xl border-2 border-ink/5 bg-white object-contain`}
      />
    );
  }
  const hue = PALETTE[name.length % PALETTE.length];
  return (
    <div
      aria-hidden
      className={`${sizeClass} ${hue} flex items-center justify-center rounded-xl font-display font-extrabold`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

"use client";

interface PriceListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRICE_LIST = [
  { item: "Lululemon Sets", price: "$120" },
  { item: "Godspeed", price: "$60" },
  { item: "Beanies + Socks", price: "$20–$55" },
  { item: "Supreme Sets", price: "$120" },
  { item: "Supreme Joggers", price: "$60" },
  { item: "Valley", price: "$55" },
  { item: "Alo Sets", price: "$100" },
  { item: "Gallery Dept", price: "$60" },
  { item: "Chrome Hearts", price: "$65" },
  { item: "Jeans", price: "$90" },
  { item: "Winter Coats", price: "$150" },
];

export default function PriceListModal({
  isOpen,
  onClose,
}: PriceListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0"
        aria-label="Close price list"
      />

      <section className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-5 sm:p-7">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
              DaPlugTay
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Price List</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-white"
          >
            Close
          </button>
        </header>

        <div className="divide-y divide-zinc-800">
          {PRICE_LIST.map((entry) => (
            <div
              key={entry.item}
              className="flex items-center justify-between gap-5 py-4"
            >
              <p className="font-medium text-zinc-200">{entry.item}</p>
              <p className="shrink-0 text-lg font-black text-white">
                {entry.price}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          DM @daplugtay to confirm pricing and availability.
        </p>
      </section>
    </div>
  );
}
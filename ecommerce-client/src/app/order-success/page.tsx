"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  productId: number;
  productVariantId: number;
  sizeId: number;
};

type OrderSummary = {
  message: string;
  totals: { subtotal: number; fees: number; shipping: number; total: number };
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
};

export default function OrderSuccessPage() {
  const [summary, setSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) setSummary(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Order Completed</h1>
        <p className="mt-2 text-base">
          {summary?.message || "Congrats! Your order is done."}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          {summary?.items?.length ? (
            <div className="divide-y">
              {summary.items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-base-content/70">
                      Qty: {it.quantity} • Variant #{it.productVariantId} • Size #{it.sizeId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>${it.price.toFixed(2)}</p>
                    <p className="text-xs text-base-content/70">
                      x {it.quantity} = ${(it.price * it.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm">No items available.</p>
          )}
        </div>

        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Totals</h2>
          <div className="text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${summary?.totals?.subtotal?.toFixed(2) ?? "0.00"}</span></div>
            <div className="flex justify-between"><span>Fees</span><span>${summary?.totals?.fees?.toFixed(2) ?? "0.00"}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${summary?.totals?.shipping?.toFixed(2) ?? "0.00"}</span></div>
            <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>${summary?.totals?.total?.toFixed(2) ?? "0.00"}</span></div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Delivery & Payment</h2>
          <p className="text-sm"><span className="font-medium">Address:</span> {summary?.shippingAddress || "N/A"}</p>
          <p className="text-sm"><span className="font-medium">Payment Method:</span> {summary?.paymentMethod || "N/A"}</p>
          <p className="text-xs text-base-content/70 mt-1">Placed at: {summary?.createdAt ? new Date(summary.createdAt).toLocaleString() : "N/A"}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/" className="btn">Return Home</Link>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateOrderDTO, PaymentMethod } from "@/types/order";
import { jwtDecode } from "jwt-decode";

type BagItem = {
  id: number;
  customerId: number;
  product: {
    id: number;
    name: string;
    price: number;
    productVariants: Array<{
      id: number;
      color: string;
    }>;
  };
  productVariantId: number;
  sizeId: number;
  quantity: number;
};

interface CheckoutFormProps {
  items: BagItem[];
  token: string;
}

function extractCustomerId(token: string): number | null {
  try {
    const decoded: Record<string, any> = jwtDecode(token);
    const nameIdKey = Object.keys(decoded).find(
      (k) =>
        k.toLowerCase().includes("nameidentifier") ||
        k.toLowerCase().includes("nameid")
    );
    const val = nameIdKey
      ? decoded[nameIdKey]
      : decoded["sub"] || decoded["id"];
    const num = parseInt(String(val), 10);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

export default function CheckoutForm({ items, token }: CheckoutFormProps) {
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CreditCard
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addressTouched, setAddressTouched] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, it) => sum + it.product.price * it.quantity,
      0
    );
    const fees = Math.round(subtotal * 0.01 * 100) / 100; // 1% fee example
    const shipping = subtotal > 0 ? 10 : 0; // flat shipping example
    const total = Math.round((subtotal + fees + shipping) * 100) / 100;
    return { subtotal, fees, shipping, total };
  }, [items]);

  const addressError =
    addressTouched && shippingAddress.trim().length < 10
      ? "Please enter a more detailed shipping address (min 10 characters)."
      : null;
  const itemsError = items.length === 0 ? "Your bag is empty." : null;
  const canSubmit =
    !addressError &&
    !itemsError &&
    shippingAddress.trim().length >= 10 &&
    items.length > 0 &&
    !submitting;

  async function placeOrder() {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const customerId = extractCustomerId(token);
    if (!customerId) {
      setSubmitting(false);
      setError("Unable to detect customer from token.");
      return;
    }

    const orderPayload: CreateOrderDTO = {
      customerId,
      totalAmount: totals.total,
      paymentMethod,
      shippingAddress,
      items: items.map((it) => ({
        productId: it.product.id,
        productVariantId: it.productVariantId,
        sizeId: it.sizeId,
        quantity: it.quantity,
        unitPrice: it.product.price,
      })),
    };

    // Bypass server for now: show immediate success feedback
    setTimeout(() => {
      const summary = {
        message: "Congrats! Your order is done.",
        totals,
        items: items.map((it) => ({
          name: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
          productId: it.product.id,
          productVariantId: it.productVariantId,
          sizeId: it.sizeId,
        })),
        shippingAddress,
        paymentMethod,
        createdAt: new Date().toISOString(),
      };
      try {
        sessionStorage.setItem("lastOrder", JSON.stringify(summary));
      } catch {}
      setSuccess(summary.message);
      setSubmitting(false);
      router.push("/order-success");
    }, 300);
  }

  const supportedPaymentMethods = [
    PaymentMethod.CreditCard,
    PaymentMethod.PayPal,
    PaymentMethod.CashOnDelivery,
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="border rounded-md p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Shipping address
            </label>
            <textarea
              className={`textarea textarea-bordered w-full ${
                addressError ? "textarea-error" : ""
              }`}
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              onBlur={() => setAddressTouched(true)}
              placeholder="Street, City, State/Province, Postal Code, Country"
            />
            {addressError && (
              <p className="text-xs text-red-600 mt-1">{addressError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment method
            </label>
            <div className="flex flex-wrap gap-3">
              {supportedPaymentMethods.map((pm) => (
                <label
                  key={pm}
                  className={`cursor-pointer label gap-2 border rounded-md px-3 py-2 ${
                    paymentMethod === pm ? "border-primary" : "border-base-300"
                  }`}
                >
                  <input
                    type="radio"
                    className="radio radio-primary"
                    checked={paymentMethod === pm}
                    onChange={() => setPaymentMethod(pm as PaymentMethod)}
                  />
                  <span className="label-text">{pm}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="border rounded-md p-4 space-y-3">
          <h3 className="font-semibold">Order Summary</h3>
          {itemsError && <p className="text-xs text-red-600">{itemsError}</p>}
          <div className="max-h-64 overflow-auto divide-y">
            {items.map((it) => (
              <div
                key={`${it.product.id}-${it.productVariantId}-${it.sizeId}`}
                className="py-2 flex items-center justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium">{it.product.name}</p>
                  <p className="text-xs text-base-content/70">
                    Variant #{it.productVariantId} • Size #{it.sizeId}
                  </p>
                  <p className="text-xs">Qty: {it.quantity}</p>
                </div>
                <div className="text-right">
                  <p>${it.product.price.toFixed(2)}</p>
                  <p className="text-xs text-base-content/70">
                    x {it.quantity} = $
                    {(it.product.price * it.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm pt-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Fees</span>
              <span>${totals.fees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${totals.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button
            disabled={!canSubmit}
            onClick={placeOrder}
            className="btn w-full"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

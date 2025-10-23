import { cookies } from "next/headers";
import CheckoutForm from "@/components/CheckoutForm";
import { getBag } from "@/api/bageAPI";

export default async function CheckoutPage() {
  const token = (await cookies()).get("auth-token-ecommerce")?.value;

  if (!token) {
    return (
      <div className="container">
        <h1 className="mt-4 text-2xl font-semibold">Checkout</h1>
        <p className="mt-2 text-sm">You must be signed in to checkout.</p>
      </div>
    );
  }

  const bagRes = await getBag(token);
  const items = Array.isArray(bagRes?.data) ? bagRes.data : [];

  return (
    <div className="container">
      <h1 className="mt-4 text-2xl font-semibold">Checkout</h1>
      <div className="mt-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <CheckoutForm items={items as any} token={token} />
        </div>
      </div>
    </div>
  );
}

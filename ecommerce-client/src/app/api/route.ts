"use server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  console.log("here");
  try {
    // Trigger revalidation of the /products path
    await revalidatePath("/products");
    await revalidatePath("/wishlist");
    return NextResponse.json({
      message: "Revalidation triggered for /products",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error triggering revalidation" },
      { status: 500 }
    );
  }
}

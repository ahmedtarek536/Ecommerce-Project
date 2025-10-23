export async function DeleteProduct(id: number) {
  // const serverUrl = process.env.SERVER_URL;

  const response = await fetch(`https://localhost:44352/api/Products/${id}`, {
    method: "DELETE",
  });

  // Check if the response is OK
  if (!response.ok) {
    const errorDetails = await response.json();
    return errorDetails;
    // throw new Error(
    //   `Failed to delete product: ${errorDetails.message || response.statusText}`
    // );
  }

  // Return the parsed JSON if successful
  return await response.json();
}

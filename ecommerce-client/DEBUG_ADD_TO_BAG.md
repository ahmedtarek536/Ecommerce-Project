# Debug Guide: Add to Bag Not Working

## Issues Found & Fixed

### 1. Collections API Response Mismatch ✅ FIXED
**Problem:** Backend returns `imageUrl` but client expected `image`

**Solution:** Updated `src/api/collectionAPI.ts` to map the response correctly:
```typescript
image: collection.imageUrl || collection.image
```

### 2. Add to Bag Requires Authentication with "User" Role
**Problem:** Backend endpoint requires `[Authorize(Roles = "User")]`

**Backend Requirements:**
- Valid JWT token
- Token must have `ClaimTypes.Role = "User"`
- Token must have valid `ClaimTypes.NameIdentifier` (customer ID)

## Testing Steps

### Step 1: Verify Authentication
1. Open browser DevTools → Console
2. Login or signup
3. Check if token is stored:
```javascript
// In console
document.cookie.split(';').find(c => c.includes('auth-token-ecommerce'))
```

4. Decode the JWT token at https://jwt.io
5. Verify it contains:
   - `nameid` (customer ID)
   - `role: "User"`
   - `email`

### Step 2: Test Add to Bag
1. Navigate to any product details page
2. Select a size
3. Click "Add To Bag"
4. Open DevTools → Console
5. Look for these logs:
   ```
   Adding to bag: { productId, variantId, sizeId, quantity }
   Add to bag response: { success, message, data }
   ```

### Step 3: Check Network Tab
1. Open DevTools → Network tab
2. Click "Add To Bag"
3. Find the request to `/api/Bags`
4. Check:
   - **Status Code:** Should be 201 (Created) or 200 (OK)
   - **Request Headers:** Should include `Authorization: Bearer <token>`
   - **Request Body:** Should have productId, productVariantId, sizeId, quantity
   - **Response:** Should have `{ success: true, message: "..." }`

## Common Issues & Solutions

### Issue 1: 401 Unauthorized
**Symptoms:**
- Network tab shows 401 status
- Console shows "Failed to add item to bag"

**Causes:**
1. No token (not logged in)
2. Token expired (tokens expire after 5 hours)
3. Token doesn't have "User" role

**Solutions:**
1. Login again
2. Check token in cookies
3. Verify token has correct role at jwt.io

### Issue 2: 400 Bad Request
**Symptoms:**
- Network tab shows 400 status
- Response message indicates validation error

**Possible Causes:**
- Invalid product ID
- Invalid variant ID
- Invalid size ID
- Invalid quantity

**Solutions:**
1. Check console logs for the data being sent
2. Verify all IDs are numbers (not strings)
3. Verify size is selected before clicking Add to Bag

### Issue 3: Token Not Being Sent
**Symptoms:**
- Network tab shows no Authorization header
- 401 error

**Solutions:**
1. Check if token exists in Zustand store:
```javascript
// In console
JSON.parse(localStorage.getItem('app-store'))
```

2. Check if token exists in cookies:
```javascript
// In console
document.cookie
```

3. If token is missing, login again

### Issue 4: CORS Error
**Symptoms:**
- Console shows CORS error
- Request blocked by browser

**Solutions:**
1. Verify backend is running on `https://localhost:44352`
2. Check backend CORS configuration allows `http://localhost:3000`
3. Verify `AllowLocalhostPolicy` in backend `Program.cs`

## Backend Validation Checks

The backend performs these validations:
1. ✅ Customer ID exists (from JWT token)
2. ✅ Product ID is valid
3. ✅ Product Variant ID is valid
4. ✅ Size ID is valid
5. ✅ Quantity is positive

If any validation fails, you'll get a 400 Bad Request with a specific error message.

## Testing with Different Scenarios

### Test 1: Add New Item
1. Login
2. Go to product page
3. Select size
4. Click Add to Bag
5. **Expected:** Success message

### Test 2: Add Duplicate Item
1. Add item to bag (Test 1)
2. Add same item again (same product, variant, size)
3. **Expected:** Quantity should increase (not create duplicate)

### Test 3: Add Without Size
1. Go to product page
2. Don't select size
3. Click Add to Bag
4. **Expected:** Alert "Please Select a Size"

### Test 4: Add Without Login
1. Logout
2. Go to product page
3. Select size
4. Click Add to Bag
5. **Expected:** Auth modal opens

## Debugging Checklist

- [ ] Backend server is running on port 44352
- [ ] User is logged in (token exists in cookies)
- [ ] Token has "User" role (check at jwt.io)
- [ ] Token is not expired (check exp claim)
- [ ] Product ID is valid
- [ ] Variant ID is valid
- [ ] Size is selected
- [ ] Size ID is valid
- [ ] Network request includes Authorization header
- [ ] Request body has all required fields
- [ ] Backend returns 201/200 status

## Quick Test Script

Run this in browser console after logging in:

```javascript
// Get token from store
const store = JSON.parse(localStorage.getItem('app-store'));
const token = store?.state?.token;

console.log('Token:', token ? 'Found' : 'Missing');

// Test add to bag API directly
if (token) {
  fetch('https://localhost:44352/api/Bags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      productId: 1,  // Replace with actual product ID
      productVariantId: 1,  // Replace with actual variant ID
      sizeId: 1,  // Replace with actual size ID
      quantity: 1
    })
  })
  .then(r => r.json())
  .then(data => console.log('Response:', data))
  .catch(err => console.error('Error:', err));
}
```

## Expected API Response

### Success Response:
```json
{
  "success": true,
  "message": "Item added to bag successfully.",
  "data": null
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Invalid product ID.",
  "data": null
}
```

## If Still Not Working

1. **Check Backend Logs:**
   - Look for any exceptions
   - Check database connection
   - Verify migrations are applied

2. **Verify Database:**
   - Check if Products table has data
   - Check if ProductVariants table has data
   - Check if Sizes table has data
   - Check if Customers table has your user

3. **Test Backend Directly:**
   - Use Postman or Swagger
   - Test `/api/Bags` POST endpoint
   - Verify it works outside the client app

4. **Check Token Claims:**
   - Decode token at jwt.io
   - Verify `nameid` matches your customer ID in database
   - Verify `role` is exactly "User" (case-sensitive)

## Contact/Report

If issue persists, provide:
1. Browser console screenshot
2. Network tab screenshot (request & response)
3. Decoded JWT token (from jwt.io)
4. Backend logs
5. Steps to reproduce

# Quick Start Guide - E-commerce Client

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://localhost:44352
```

### 3. Start Backend Server
Make sure your ASP.NET Core backend is running on `https://localhost:44352`

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📋 What's Been Optimized

### Performance Improvements
✅ **Centralized API Client** - All API calls now use a unified client with:
- Automatic retries on failure
- Request deduplication
- Timeout handling (10s default)
- Consistent error handling

✅ **Better Caching** - Product details cached for 5 minutes

✅ **Optimized Re-renders** - Products page uses `useCallback` to prevent unnecessary re-renders

✅ **React Strict Mode** - Enabled for better development experience

✅ **Image Optimization** - Next.js image optimization configured

### API Modules Updated
- `src/api/productsAPI.ts` ✅
- `src/api/authAPI.ts` ✅
- `src/api/bageAPI.ts` ✅
- `src/api/wishlistAPI.ts` ✅
- `src/api/collectionAPI.ts` ✅

## 🧪 Testing the Improvements

### 1. Check API Performance
Open Chrome DevTools → Network tab:
- Navigate to products page
- Apply filters
- **Expected:** No duplicate API calls
- **Expected:** Fast response times (<1s)

### 2. Test Error Handling
Stop the backend server and try:
- Loading products page
- **Expected:** User-friendly error message
- **Expected:** No app crash

### 3. Test Caching
- Visit a product details page
- Navigate away
- Come back to the same product
- **Expected:** Instant load (cached)

### 4. Test Retry Logic
Throttle your network (DevTools → Network → Slow 3G):
- Try loading products
- **Expected:** Automatic retries
- **Expected:** Eventually loads or shows error

## 🔍 Monitoring Performance

### Browser DevTools
1. **Network Tab**
   - Monitor API call times
   - Check for duplicate requests
   - Verify caching

2. **Performance Tab**
   - Record page load
   - Check for long tasks
   - Identify bottlenecks

3. **React DevTools Profiler**
   - Record component renders
   - Identify unnecessary re-renders
   - Optimize components

### Key Metrics to Watch
- **API Response Time:** Should be <1s for most calls
- **Page Load Time:** Should be <3s
- **Time to Interactive:** Should be <5s
- **Failed Requests:** Should be <1%

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch products"
**Cause:** Backend not running or wrong URL
**Solution:**
1. Check backend is running on `https://localhost:44352`
2. Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. Check browser console for detailed error

### Issue: "401 Unauthorized"
**Cause:** Invalid or expired token
**Solution:**
1. Clear cookies and login again
2. Check token in browser DevTools → Application → Cookies
3. Verify backend JWT configuration

### Issue: Slow page loads
**Cause:** Backend performance or network issues
**Solution:**
1. Check Network tab for slow API calls
2. Verify backend database queries are optimized
3. Check if caching is working

### Issue: App crashes on error
**Cause:** Missing error handling
**Solution:**
1. Check browser console for errors
2. Verify all API calls have try-catch blocks
3. Report issue with error details

## 📊 Performance Comparison

### Before Optimization:
- ❌ No error handling
- ❌ Duplicate API calls
- ❌ No retry logic
- ❌ Inconsistent error messages
- ❌ No caching
- ❌ Unnecessary re-renders

### After Optimization:
- ✅ Comprehensive error handling
- ✅ Request deduplication
- ✅ Automatic retries (2x)
- ✅ User-friendly error messages
- ✅ 5-minute product cache
- ✅ Optimized re-renders with useCallback

## 📚 Additional Resources

- **Performance Guide:** See `PERFORMANCE_IMPROVEMENTS.md`
- **API Testing:** See `test-api.md`
- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev

## 🎯 Next Steps

1. **Test all features** - Go through the app and test each feature
2. **Monitor performance** - Use DevTools to check metrics
3. **Report issues** - Document any problems found
4. **Consider additional optimizations:**
   - React Query for advanced caching
   - Service Worker for offline support
   - Image lazy loading
   - Code splitting

## 💡 Tips for Development

1. **Keep DevTools open** - Monitor network and console
2. **Use React DevTools** - Profile component renders
3. **Check error logs** - Both browser and backend
4. **Test edge cases** - Network failures, invalid data, etc.
5. **Profile regularly** - Use Lighthouse for audits

## 🔧 Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Review Network tab for failed requests
3. Verify environment variables
4. Check backend logs
5. Review documentation files

---

**Happy coding! 🎉**

# 🔧 **Connection Error Troubleshooting Guide**

## 🚨 **Error: "Failed to fetch" / "net::ERR_NAME_NOT_RESOLVED"**

This error means your app can't connect to Supabase. Here are the most common causes and solutions:

### **🔍 Step 1: Check Connection Diagnostics**

1. **Open your app**: `http://localhost:3000`
2. **Look for the "Connection Diagnostics" box** at the top
3. **Check the status**:
   - ✅ **Network: Connected** - Good!
   - ✅ **Supabase: Connected** - Good!
   - ❌ **Any red X** - Problem found!

### **🔧 Step 2: Common Solutions**

#### **Solution 1: Check Internet Connection**
- Make sure you have internet access
- Try opening https://atzybuvffuflfcruonkq.supabase.co in your browser
- If it doesn't load, you have a network issue

#### **Solution 2: Check Supabase Project Status**
1. Go to: https://supabase.com/dashboard/project/atzybuvffuflfcruonkq
2. Check if your project is active
3. Look for any error messages or warnings

#### **Solution 3: Verify Supabase Credentials**
The credentials in your code are:
- **URL**: `https://atzybuvffuflfcruonkq.supabase.co`
- **Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**To verify these are correct:**
1. Go to your Supabase dashboard
2. Click **"Settings"** → **"API"**
3. Compare the URL and anon key with what's in your code

#### **Solution 4: Check Browser Console**
1. Open browser Developer Tools (F12)
2. Go to **"Console"** tab
3. Look for detailed error messages
4. The ConnectionStatus component will show specific errors

#### **Solution 5: Try Different Browser**
- Sometimes browser extensions block requests
- Try opening your app in an incognito/private window
- Try a different browser (Chrome, Firefox, Edge)

#### **Solution 6: Check Firewall/Antivirus**
- Some firewalls block API requests
- Temporarily disable antivirus/firewall to test
- Check if your company/school network blocks external APIs

### **🧪 Step 3: Test Manually**

**Test 1: Direct API Call**
Open this URL in your browser:
```
https://atzybuvffuflfcruonkq.supabase.co/rest/v1/
```

**Test 2: Check Supabase Status**
Visit: https://status.supabase.com/

### **📞 Step 4: If Still Not Working**

**Check these in order:**
1. ✅ Internet connection working
2. ✅ Supabase project is active
3. ✅ Credentials are correct
4. ✅ No firewall blocking requests
5. ✅ Browser allows external requests

**If all above are correct, the issue might be:**
- Supabase project is paused/suspended
- API key has been regenerated
- Project has been deleted

### **🔄 Step 5: Quick Fix**

**If you need to update credentials:**
1. Go to Supabase dashboard
2. Get new URL and anon key
3. Update `src/lib/supabase.js` with new credentials
4. Restart your React app

**The ConnectionStatus component will show you exactly what's wrong!** 🔍

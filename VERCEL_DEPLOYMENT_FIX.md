# 🚀 Vercel Deployment Fix Guide

## 🚨 **CURRENT ERROR:**
```
Environment Variable "VITE_API_URL" references Secret "vite_api_url", which does not exist.
```

## ✅ **STEP-BY-STEP FIX:**

### **Step 1: Fix Environment Variable**

1. In Vercel dashboard, find the **Environment Variables** section
2. Look for `VITE_API_URL` in the table
3. **Click on the variable** to edit it
4. **IMPORTANT:** Make sure it's set as **"Value"** not **"Secret"**
5. Set the value to:
   ```
   https://crm-backend-1-qyl1.onrender.com/v1/
   ```
   ⚠️ **Note:** Must end with `/v1/` (your code expects this)

6. **Remove any Secret reference** - it should be a direct value
7. Click **"Save"**

### **Step 2: Fix Root Directory**

1. Find **"Root Directory"** field (currently shows `./`)
2. Click **"Edit"** button
3. Change it to: `crm_ticket`
   - This tells Vercel to deploy from the `crm_ticket` folder
4. Click **"Save"**

### **Step 3: Verify Framework**

- Framework Preset should be: **Vite** ✅ (already correct)

### **Step 4: Deploy**

1. Click **"Deploy"** button
2. Wait for build to complete
3. Your app will be live!

---

## 📋 **CORRECT CONFIGURATION:**

### **Environment Variables:**
```
Key: VITE_API_URL
Value: https://crm-backend-1-qyl1.onrender.com/v1/
Type: Plain Text (not Secret)
```

### **Root Directory:**
```
crm_ticket
```

### **Framework:**
```
Vite
```

---

## 🔍 **VERIFICATION:**

After deployment:

1. **Check Build Logs:**
   - Should show successful build
   - No environment variable errors

2. **Test Your App:**
   - Visit your Vercel URL
   - Try logging in
   - API calls should work

3. **Check Browser Console:**
   - Open DevTools → Network tab
   - API calls should go to: `https://crm-backend-1-qyl1.onrender.com/v1/...`

---

## ⚠️ **COMMON MISTAKES:**

1. ❌ **Wrong:** Using Secret reference instead of direct value
2. ❌ **Wrong:** Missing `/v1/` at end of API URL
3. ❌ **Wrong:** Root Directory set to `./` instead of `crm_ticket`
4. ✅ **Correct:** Direct value with full URL ending in `/v1/`

---

## 📝 **QUICK CHECKLIST:**

- [ ] `VITE_API_URL` is set as **direct value** (not Secret)
- [ ] Value is: `https://crm-backend-1-qyl1.onrender.com/v1/`
- [ ] Root Directory is: `crm_ticket`
- [ ] Framework is: `Vite`
- [ ] Deployed successfully
- [ ] App loads without errors

---

## 🎯 **AFTER FIX:**

Once configured correctly:
- ✅ Environment variable error will disappear
- ✅ Frontend will connect to backend API
- ✅ Login/registration will work
- ✅ All API calls will function correctly


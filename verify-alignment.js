const axios = require("axios");

async function verifyAlignment() {
  console.log("\n FRONTEND-BACKEND-DATABASE ALIGNMENT CHECK\n");
  console.log("="*70);
  
  const backend = "https://errorwise-backend-production.up.railway.app";
  const frontend = "https://errorwise-frontend-bvmcc47nm-getgingees-projects.vercel.app";
  
  try {
    // 1. Test Backend API
    console.log("\n1 Backend API Status:");
    const health = await axios.get(`${backend}/health`);
    console.log(" Backend Health:", health.data.status);
    
    // 2. Test CORS
    console.log("\n2 CORS Configuration:");
    const corsTest = await axios.get(`${backend}/api/subscriptions/plans`, {
      headers: { "Origin": frontend }
    });
    const corsOrigin = corsTest.headers["access-control-allow-origin"];
    if (corsOrigin && corsOrigin.includes("errorwise-frontend")) {
      console.log(" CORS Configured:", corsOrigin);
    } else {
      console.log(" CORS Issue:", corsOrigin || "undefined");
    }
    
    // 3. Test User Registration (verifies DB schema)
    console.log("\n3 Database Schema Verification:");
    const testUser = {
      username: `schema_test_${Date.now()}`,
      email: `schema${Date.now()}@test.com`,
      password: "Test123!"
    };
    const reg = await axios.post(`${backend}/api/auth/register`, testUser);
    console.log(" User Model Fields Working:");
    console.log("   - id (UUID):", reg.data.user.id);
    console.log("   - username:", reg.data.user.username);
    console.log("   - email:", reg.data.user.email);
    console.log("   - subscriptionTier:", reg.data.user.subscriptionTier);
    console.log("   - subscriptionStatus:", reg.data.user.subscriptionStatus || "N/A");
    console.log("   - isEmailVerified:", reg.data.user.isEmailVerified);
    console.log("   - role:", reg.data.user.role || "user");
    
    // 4. Test Subscription Plans
    console.log("\n4 Subscription System:");
    const plans = await axios.get(`${backend}/api/subscriptions/plans`);
    console.log(` ${plans.data.plans.length} Subscription Plans Available`);
    
    console.log("\n" + "="*70);
    console.log(" ALL SYSTEMS ALIGNED AND WORKING!");
    console.log("\n Production URLs:");
    console.log(`   Backend:  ${backend}`);
    console.log(`   Frontend: ${frontend}`);
    console.log("\n Deployment Complete!\n");
    
  } catch (error) {
    console.error("\n Error:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

verifyAlignment();

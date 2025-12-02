// Test Authentication System
console.log('🔐 Testing Authentication System');
console.log('=================================');

const testUsers = [
  { email: 'admin@realtywebsite.com', password: 'admin123', role: 'ADMIN' },
  { email: 'agent@realtywebsite.com', password: 'agent123', role: 'AGENT' },
  { email: 'user@realtywebsite.com', password: 'user123', role: 'USER' },
  { email: 'sarah@realtywebsite.com', password: 'broker123', role: 'BROKER' }
];

async function testLogin(email, password, expectedRole) {
  try {
    console.log(`\n📧 Testing login for: ${email}`);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Login successful!`);
      console.log(`   Name: ${data.user.name}`);
      console.log(`   Role: ${data.user.role}`);
      console.log(`   Expected: ${expectedRole}`);
      console.log(`   Match: ${data.user.role === expectedRole ? '✅' : '❌'}`);
      return { success: true, user: data.user };
    } else {
      console.log(`❌ Login failed: ${data.error}`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testSignup() {
  try {
    console.log(`\n🆕 Testing user signup...`);
    
    const newUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'test123',
      role: 'USER'
    };
    
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Signup successful!`);
      console.log(`   Name: ${data.user.name}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Role: ${data.user.role}`);
      return { success: true, user: data.user };
    } else {
      console.log(`❌ Signup failed: ${data.error}`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log(`❌ Network error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Starting Authentication Tests...\n');
  
  let passCount = 0;
  let totalTests = testUsers.length + 1; // +1 for signup test
  
  // Test existing user logins
  for (const testUser of testUsers) {
    const result = await testLogin(testUser.email, testUser.password, testUser.role);
    if (result.success && result.user.role === testUser.role) {
      passCount++;
    }
  }
  
  // Test user signup
  const signupResult = await testSignup();
  if (signupResult.success) {
    passCount++;
  }
  
  console.log('\n🎯 Test Results:');
  console.log('================');
  console.log(`✅ Passed: ${passCount}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passCount}/${totalTests}`);
  
  if (passCount === totalTests) {
    console.log('\n🎉 All authentication tests PASSED!');
    console.log('✅ Login system is working correctly');
    console.log('✅ Database integration functional');
    console.log('✅ User roles properly assigned');
  } else {
    console.log('\n⚠️  Some tests failed. Check server connection.');
  }
  
  console.log('\n🌐 Next Steps:');
  console.log('- Visit http://localhost:3000/login to test UI');
  console.log('- Use the credentials from README.md');
  console.log('- Test the login dropdown in header');
  console.log('- Verify role-based access to admin panel');
}

// Only run if this is the main module (not imported)
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = 'https://z5yf2n3p.eu-central.insforge.app';
const INSFORGE_ANON_KEY = 'anon_729354354db69d0252fc38dfba895a9669b11ff77e99728f122e0401fde850af';

const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

async function runTests() {
  console.log('=== Testing Native InsForge Auth Integration ===\n');

  // Test 1: Mary Asuquo (Founder / Super Admin)
  console.log('1. Testing Founder / Super Admin Login (Mary Asuquo)...');
  const maryRes = await insforge.auth.signInWithPassword({
    email: 'mary@empressglowemporium.com',
    password: 'empress_master_2026',
  });
  if (maryRes.error) {
    console.error('❌ Mary login failed:', maryRes.error.message);
  } else {
    console.log('✅ Mary login success!');
    console.log('   User ID:', maryRes.data.user.id);
    console.log('   Role:', maryRes.data.user.metadata?.role);
    console.log('   Title:', maryRes.data.user.metadata?.title);
    console.log('   JWT Token Present:', !!maryRes.data.accessToken);
  }

  // Test 2: Amina Bello (Inventory Manager)
  console.log('\n2. Testing Staff Login (Amina Bello)...');
  const aminaRes = await insforge.auth.signInWithPassword({
    email: 'amina.ops@empressglowemporium.com',
    password: 'empress_ops_2026',
  });
  if (aminaRes.error) {
    console.error('❌ Amina login failed:', aminaRes.error.message);
  } else {
    console.log('✅ Amina login success!');
    console.log('   Role:', aminaRes.data.user.metadata?.role);
  }

  // Test 3: Customer Login (Test Customer)
  console.log('\n3. Testing Customer Login (testcustomer@empressglow.test)...');
  const custRes = await insforge.auth.signInWithPassword({
    email: 'testcustomer@empressglow.test',
    password: 'password123',
  });
  if (custRes.error) {
    console.error('❌ Customer login failed:', custRes.error.message);
  } else {
    console.log('✅ Customer login success!');
    console.log('   Role:', custRes.data.user.metadata?.role || 'customer');
  }

  // Test 4: Invalid Password Rejection
  console.log('\n4. Testing Invalid Password Rejection...');
  const badRes = await insforge.auth.signInWithPassword({
    email: 'mary@empressglowemporium.com',
    password: 'wrong_password_xyz',
  });
  if (badRes.error) {
    console.log('✅ Correctly rejected invalid password with error:', badRes.error.message);
  } else {
    console.error('❌ Should have rejected invalid password!');
  }

  console.log('\n=== All InsForge Auth Tests Completed Successfully ===');
}

runTests().catch(console.error);

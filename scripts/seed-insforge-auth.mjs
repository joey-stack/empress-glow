import { execFileSync } from 'child_process';
import { createClient } from '@insforge/sdk';

const INSFORGE_URL = 'https://z5yf2n3p.eu-central.insforge.app';
const INSFORGE_ANON_KEY = 'anon_729354354db69d0252fc38dfba895a9669b11ff77e99728f122e0401fde850af';

const insforge = createClient({
  baseUrl: INSFORGE_URL,
  anonKey: INSFORGE_ANON_KEY,
});

const STAFF_MEMBERS = [
  {
    name: 'Mary Asuquo',
    email: 'mary@empressglowemporium.com',
    password: 'empress_master_2026',
    role: 'super_admin',
    title: 'Founder & Master Formulator',
  },
  {
    name: 'Amina Bello',
    email: 'amina.ops@empressglowemporium.com',
    password: 'empress_ops_2026',
    role: 'inventory_manager',
    title: 'Botanical Inventory & Workshop Lead',
  },
  {
    name: 'Chukwudi Eze',
    email: 'chukwudi.care@empressglowemporium.com',
    password: 'empress_care_2026',
    role: 'support_staff',
    title: 'Client Care & WhatsApp Lead',
  },
  {
    name: 'Regulatory Inspector',
    email: 'compliance@empressglowemporium.com',
    password: 'empress_audit_2026',
    role: 'read_only',
    title: 'NAFDAC & NDPA Compliance Inspector',
  },
];

async function seed() {
  console.log('--- Registering and Verifying InsForge Staff Accounts ---');
  for (const staff of STAFF_MEMBERS) {
    try {
      console.log(`Signing up ${staff.email}...`);
      const res = await insforge.auth.signUp({
        email: staff.email,
        password: staff.password,
        name: staff.name,
      });
      console.log(`Signup result for ${staff.email}:`, res.error ? res.error.message : 'OK');
    } catch (e) {
      console.log(`Signup notice for ${staff.email}:`, e.message);
    }

    // Set email_verified = true, is_project_admin = true, and set metadata via SQL
    const metadataJson = JSON.stringify({
      role: staff.role,
      title: staff.title,
      name: staff.name,
    });

    const sql = `UPDATE auth.users SET email_verified = true, is_project_admin = true, profile = jsonb_build_object('name', '${staff.name.replace("'", "''")}'), metadata = '${metadataJson.replace(/'/g, "''")}'::jsonb WHERE email = '${staff.email}';`;

    try {
      const out = execFileSync('npx.cmd', ['-y', '@insforge/cli', 'db', 'query', sql], {
        encoding: 'utf-8',
        cwd: process.cwd(),
        shell: true,
      });
      console.log(`Verified & updated ${staff.email} in InsForge auth.users.`);
    } catch (sqlErr) {
      console.error(`SQL update failed for ${staff.email}:`, sqlErr.message);
    }
  }

  // Also make sure testcustomer@empressglow.test is verified
  const customerSql = `UPDATE auth.users SET email_verified = true, profile = jsonb_build_object('name', 'Test Customer'), metadata = '{"role": "customer"}'::jsonb WHERE email = 'testcustomer@empressglow.test';`;
  try {
    execFileSync('npx.cmd', ['-y', '@insforge/cli', 'db', 'query', customerSql], {
      encoding: 'utf-8',
      cwd: process.cwd(),
      shell: true,
    });
    console.log('Verified testcustomer@empressglow.test in InsForge.');
  } catch (e) {
    console.warn('Customer verification notice:', e.message);
  }

  console.log('\n--- Testing insforge.auth.signInWithPassword for Mary Asuquo ---');
  const loginRes = await insforge.auth.signInWithPassword({
    email: 'mary@empressglowemporium.com',
    password: 'empress_master_2026',
  });

  if (loginRes.error) {
    console.error('Sign-in test failed:', loginRes.error);
  } else {
    console.log('Sign-in SUCCESSFUL!');
    console.log('User ID:', loginRes.data?.user?.id);
    console.log('User Email:', loginRes.data?.user?.email);
    console.log('Profile:', loginRes.data?.user?.profile);
    console.log('Access token length:', loginRes.data?.accessToken?.length);
  }
}

seed().catch(console.error);

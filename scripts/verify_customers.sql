UPDATE auth.users 
SET email_verified = true, 
    profile = jsonb_build_object('name', 'Amina Bello'), 
    metadata = '{"role": "customer", "name": "Amina Bello"}'::jsonb 
WHERE email = 'amina.bello@example.com';

UPDATE auth.users 
SET email_verified = true, 
    profile = jsonb_build_object('name', 'Chidinma Okafor'), 
    metadata = '{"role": "customer", "name": "Chidinma Okafor"}'::jsonb 
WHERE email = 'chidinma.okafor@example.com';

UPDATE auth.users 
SET email_verified = true, 
    profile = jsonb_build_object('name', 'Test Customer'), 
    metadata = '{"role": "customer", "name": "Test Customer"}'::jsonb 
WHERE email = 'testcustomer@empressglow.test';

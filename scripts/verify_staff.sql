UPDATE auth.users 
SET email_verified = true, 
    is_project_admin = true, 
    profile = jsonb_build_object('name', 'Mary Asuquo'), 
    metadata = '{"role": "super_admin", "title": "Founder & Master Formulator", "name": "Mary Asuquo"}'::jsonb 
WHERE email = 'mary@empressglowemporium.com';

UPDATE auth.users 
SET email_verified = true, 
    is_project_admin = true, 
    profile = jsonb_build_object('name', 'Amina Bello'), 
    metadata = '{"role": "inventory_manager", "title": "Botanical Inventory & Workshop Lead", "name": "Amina Bello"}'::jsonb 
WHERE email = 'amina.ops@empressglowemporium.com';

UPDATE auth.users 
SET email_verified = true, 
    is_project_admin = true, 
    profile = jsonb_build_object('name', 'Chukwudi Eze'), 
    metadata = '{"role": "support_staff", "title": "Client Care & WhatsApp Lead", "name": "Chukwudi Eze"}'::jsonb 
WHERE email = 'chukwudi.care@empressglowemporium.com';

UPDATE auth.users 
SET email_verified = true, 
    is_project_admin = true, 
    profile = jsonb_build_object('name', 'Regulatory Inspector'), 
    metadata = '{"role": "read_only", "title": "NAFDAC & NDPA Compliance Inspector", "name": "Regulatory Inspector"}'::jsonb 
WHERE email = 'compliance@empressglowemporium.com';

UPDATE auth.users 
SET email_verified = true, 
    profile = jsonb_build_object('name', 'Test Customer'), 
    metadata = '{"role": "customer"}'::jsonb 
WHERE email = 'testcustomer@empressglow.test';

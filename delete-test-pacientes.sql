DELETE FROM pacientes 
WHERE nome ILIKE 'E2E Test%' OR nome ILIKE '%teste%' OR email ILIKE '%test%' OR email ILIKE '%e2e%';


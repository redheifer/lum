-- Replace 'user-uuid-here' with the actual UUID of the user you want to make an admin
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING; 
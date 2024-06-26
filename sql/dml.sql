INSERT INTO users (user_name, user_email, user_password) VALUES
('alice', 'alice@example.com', '$2b$10$MaopVz4FiuZFMgsf.amE.Omqf5qTgBTzqtzXddNoznoVYO1DW9EWO'),
('bob', 'bob@example.com', '$2b$10$MaopVz4FiuZFMgsf.amE.Omqf5qTgBTzqtzXddNoznoVYO1DW9EWO'),
('charlie', 'charlie@example.com', '$2b$10$MaopVz4FiuZFMgsf.amE.Omqf5qTgBTzqtzXddNoznoVYO1DW9EWO'),
('david', 'david@example.com', '$2b$10$MaopVz4FiuZFMgsf.amE.Omqf5qTgBTzqtzXddNoznoVYO1DW9EWO');

INSERT INTO posts (content, author_id) VALUES
('this is my first post', 1),
('the first post sucks', 2),
('wonderfull app', 3),
('this is my second post', 1),
('this app sucks', 2);
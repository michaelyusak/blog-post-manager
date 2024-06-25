CREATE DATABASE blog_post_manager_db;-- 

DROP TABLE IF EXISTS users, posts;

CREATE TABLE users (
	user_id BIGINT AUTO_INCREMENT,
    user_name VARCHAR(25) NOT NULL,
    user_email VARCHAR(50) NOT NULL,
    user_password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE posts (
	post_id BIGINT AUTO_INCREMENT,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (post_id)
);
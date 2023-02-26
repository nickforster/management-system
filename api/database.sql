CREATE DATABASE `management_System`;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id)
);


CREATE TABLE categories (
    category_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (category_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE allergies (
    allergy_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (allergy_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE tables (
    table_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    amount_people INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (table_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE allergy_food (
    food_id INT NOT NULL,
    allergy_id INT NOT NULL,
    CONSTRAINT allergy_foodPK PRIMARY KEY (food_id, allergy_id),
    FOREIGN KEY (food_id) REFERENCES foods(food_id),
    FOREIGN KEY (allergy_id) REFERENCES allergies(allergy_id)
);

CREATE TABLE foods (
    food_id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(7,2) NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (food_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT,
    table_id INT NOT NULL,
    complete BOOLEAN NOT NULL DEFAULT FALSE,
    last_update DATETIME NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (table_id) REFERENCES tables(table_id)
);

CREATE TABLE order_food (
    order_food_id INT NOT NULL AUTO_INCREMENT,
    food_id INT NOT NULL,
    order_id INT NOT NULL,
    PRIMARY KEY (order_food_id),
    FOREIGN KEY (food_id) REFERENCES foods(food_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
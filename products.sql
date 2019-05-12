CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
	item_id INT NOT NULL,
	product_name VARCHAR(200),
	department_name VARCHAR(200),
	price FLOAT,
	stock_quantity INT,
	PRIMARY KEY(item_id)
);

INSERT INTO products (item_id, product_name, department_name, stock_quantity, price) 
VALUES (1001, "Pen Red", "Office Products", 5000, 1.23),
		(1002, "Pen Blue", "Office Products", 8000, 1.25),
		(1003, "Pen Black", "Office Products", 2000, 1.25),
		(1004, "Pencil 2B", "Office Products", 10000, 0.48),
		(1005, "Pencil 2H", "Office Products", 8000, 0.49),
        (1006, "Ink Red", "Office Products", 5000, 2.23),
		(1007, "Ink Blue", "Office Products", 8000, 2.25),
		(1008, "Ink Black", "Office Products", 2000, 2.25),
		(1009, "Ruler A", "Office Products", 10000, 1.48),
		(1010, "Ruler B", "Office Products", 8000, 1.49)
;

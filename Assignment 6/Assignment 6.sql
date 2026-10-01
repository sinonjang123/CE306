
CREATE TABLE customers (
    customer_id   VARCHAR(10) PRIMARY KEY,
    customer_name VARCHAR(100)
);

CREATE TABLE Employee (
    employee_id  VARCHAR(10) PRIMARY KEY,
    first_name   VARCHAR(100),
    last_name    VARCHAR(100),
    address      TEXT,
    phone_number VARCHAR(10),
    salary       DECIMAL(10, 2)
);
 

CREATE TABLE Product (
    product_id   VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(200),
    description  TEXT,
    category     VARCHAR(100),
    price        DECIMAL(10, 2)
);
 

CREATE TABLE orders (
    order_id    VARCHAR(10) PRIMARY KEY,
    customer_id VARCHAR(10),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_id   VARCHAR(10),
    product_id VARCHAR(10),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id)   REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);
 
 
INSERT INTO customers (customer_id, customer_name) VALUES
    ('C001', 'สมศักดิ์'),
    ('C002', 'มานี');
 
INSERT INTO Product (product_id, product_name, description, category, price) VALUES
    ('P001', 'หูฟังบลูทูธ', 'หูฟังไร้สาย', 'Electronics', 1500.00),
    ('P002', 'สายชาร์จ',    'สาย USB-C',   'Electronics', 300.00),
    ('P003', 'หนังสือ SQL', 'ตำราฐานข้อมูล', 'Books',       200.00),
    ('P004', 'สินค้าเสีย',  'ราคาผิดพลาด',  'Other',        0.00);
 
INSERT INTO Employee (employee_id, first_name, last_name, address, phone_number, salary) VALUES
    ('EMP002', 'สมศรี', 'ทองดี', 'เชียงใหม่', '0898765432', 30000.00);
 
INSERT INTO orders (order_id, customer_id) VALUES
    ('O001', 'C001'),
    ('O002', 'C001'),
    ('O003', 'C001'),
    ('O004', 'C002');
 
INSERT INTO order_items (order_id, product_id) VALUES
    ('O001', 'P001'),
    ('O001', 'P002'),
    ('O002', 'P003'),
    ('O003', 'P001'),
    ('O004', 'P002');
 
 

INSERT INTO Employee (employee_id, first_name, last_name, address, phone_number, salary)
VALUES ('EMP001', 'สมชาย', 'ใจดี', 'กรุงเทพมหานคร', '0812345678', 25000.00);

UPDATE Employee
SET salary = salary * 1.10
WHERE employee_id = 'EMP001';
 
DELETE FROM Product
WHERE price <= 0 OR product_name IS NULL;
 
 
SELECT product_id, product_name, price
FROM Product
WHERE category = 'Electronics' AND price > 500
ORDER BY price DESC;
 

SELECT AVG(salary) AS avg_salary,
       COUNT(*)    AS total_employees
FROM Employee;
 

SELECT *
FROM Employee
WHERE last_name LIKE 'ทอง%';
 

SELECT o.order_id, c.customer_name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
 
SELECT o.order_id, p.product_name, p.price
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN Product p      ON oi.product_id = p.product_id
ORDER BY o.order_id;
 

SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 3;
 

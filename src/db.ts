import { Database } from 'duckdb'

export function initializeDatabase(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY,
      date DATE,
      product VARCHAR,
      category VARCHAR,
      quantity INTEGER,
      unit_price DECIMAL(10, 2),
      total_price DECIMAL(10, 2)
    );

    -- Insert sample data only if the table is empty
    INSERT INTO sales (id, date, product, category, quantity, unit_price, total_price)
    SELECT * FROM (VALUES
      (1, '2024-01-01', 'Laptop', 'Electronics', 5, 999.99, 4999.95),
      (2, '2024-01-02', 'Smartphone', 'Electronics', 10, 599.99, 5999.90),
      (3, '2024-01-03', 'T-shirt', 'Clothing', 20, 19.99, 399.80),
      (4, '2024-01-04', 'Book', 'Books', 15, 14.99, 224.85),
      (5, '2024-01-05', 'Headphones', 'Electronics', 8, 79.99, 639.92)
    ) AS new_data
    WHERE NOT EXISTS (SELECT 1 FROM sales);
  `)
}

export const QUERIES = {
  allSales: 'SELECT * FROM sales',
  salesSummary: `
    SELECT
      category,
      COUNT(*) as total_transactions,
      SUM(quantity) as total_quantity,
      SUM(total_price) as total_revenue
    FROM sales
    GROUP BY category
  `,
  dailySales: `
    SELECT
      date,
      COUNT(*) as transactions,
      SUM(total_price) as daily_revenue
    FROM sales
    GROUP BY date
    ORDER BY date
  `
}
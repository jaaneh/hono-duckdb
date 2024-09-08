import { Hono, type Context } from 'hono'
import { Database } from 'duckdb'
import { QUERIES } from './db'

interface SalesRecord {
  id: number
  date: string
  product: string
  category: string
  quantity: number
  unit_price: number
  total_price: number
}

interface SalesSummary {
  category: string
  total_transactions: number
  total_quantity: number
  total_revenue: number
}

interface DailySales {
  date: string
  transactions: number
  daily_revenue: number
}

export function setupRoutes(app: Hono, db: Database): void {
  app.get('/', (c) => c.text('DuckDB Analytics API'))

  const executeQuery = async <T>(query: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      db.all(query, (err: Error | null, rows: any[]) => {
        if (err) reject(err)
        resolve(rows as T[])
      })
    })
  }

  const sendJsonResponse = <T>(c: Context, data: T) => {
    const jsonString = JSON.stringify(data, (_, value) => typeof value === 'bigint' ? value.toString() : value)
    return c.json(JSON.parse(jsonString))
  }

  app.get('/sales', async (c) => {
    const rows = await executeQuery<SalesRecord>(QUERIES.allSales)
    return sendJsonResponse(c, rows)
  })

  app.get('/sales/summary', async (c) => {
    const rows = await executeQuery<SalesSummary>(QUERIES.salesSummary)
    return sendJsonResponse(c, rows)
  })

  app.get('/sales/daily', async (c) => {
    const rows = await executeQuery<DailySales>(QUERIES.dailySales)
    return sendJsonResponse(c, rows)
  })
}
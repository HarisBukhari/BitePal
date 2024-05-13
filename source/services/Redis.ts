import Redis from "ioredis"

export const client = new Redis({
  password: process.env.redis_password,
  host: process.env.redis_host,
  port: parseInt(process.env.redis_port)
})


export async function cnt() {
  await client.connect()
}
// Utility functions for Redis operations
export async function get(key: string) {
  try {
    const value = await client.get(key)
    return JSON.parse(value)
  } catch (error) {
    console.error('Error getting value from Redis:', error)
    return null // Or throw an error if needed
  }
}

export async function set(key: string, value: string, expiration?: number) {
  try {
    if (expiration) {
      await client.set(key, JSON.stringify(value))
      await client.expire(key, expiration)
    } else {
      await client.set(key, value)
    }
    return true
  } catch (error) {
    console.error('Error setting value in Redis:', error)
    return false // Or throw an error if needed
  }
}

export async function del(key: string) {
  try {
    const deleted = await client.del(key)
    return deleted // Number of keys deleted (usually 1)
  } catch (error) {
    console.error('Error deleting key from Redis:', error)
    return 0 // Or throw an error if needed
  }
}

export async function closeC() {
  await client.quit()
}
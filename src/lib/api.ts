export async function fetchShops() {
  const base = import.meta.env.BASE_URL
  const url = base.endsWith("/") ? `${base}shops.json` : `${base}/shops.json`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch shops")
  }
  return response.json()
}

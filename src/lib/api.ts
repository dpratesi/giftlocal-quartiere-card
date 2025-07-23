export async function fetchShops() {
  const url = `${import.meta.env.BASE_URL}api/shops`
  const base = import.meta.env.BASE_URL
  const url = base.endsWith("/") ? `${base}api/shops` : `${base}/api/shops`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch shops")
  }
  return response.json()
}
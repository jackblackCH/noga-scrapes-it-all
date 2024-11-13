export async function getCategories() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categories = await response.json();
  return categories;
}

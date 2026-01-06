export function validateEditKey(key: string | null): boolean {
  const expectedKey = process.env.EDIT_KEY;

  if (!expectedKey) {
    console.warn('EDIT_KEY not set in environment variables');
    return false;
  }

  return key === expectedKey;
}

export function getEditKeyFromRequest(request: Request): string | null {
  const url = new URL(request.url);
  return url.searchParams.get('key');
}

export async function copyText(text, status, success, failure) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    status.textContent = success;
    return true;
  } catch {
    status.textContent = failure;
    return false;
  }
}

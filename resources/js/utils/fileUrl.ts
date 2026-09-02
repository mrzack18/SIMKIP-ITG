/**
 * Build preview/download URLs for stored file attachments.
 *
 * The backend FileController resolves the actual file by type+id+field and
 * serves it with role-based access control (admin, warek, prodi, mahasiswa).
 */
export function filePreviewUrl(type: string, id: number | string, field: string): string {
  return `/api/files/${type}/${id}/${field}/preview`;
}

export function fileDownloadUrl(type: string, id: number | string, field: string): string {
  return `/api/files/${type}/${id}/${field}/download`;
}

/**
 * Trigger a browser download for an authenticated file by resolving it through
 * the API (which attaches the Bearer token) and saving the returned blob.
 */
export async function downloadFile(type: string, id: number | string, field: string): Promise<void> {
  const token = localStorage.getItem("simkip_token");

  const res = await fetch(fileDownloadUrl(type, id, field), {
    headers: token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="?([^";]+)"?/i);
  const filename = match ? match[1] : `file_${id}.bin`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

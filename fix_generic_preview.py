import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\admin\DokumenQueue.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_card = """          <DocPlaceholderCard
            icon={typeIcon(doc.jenis, "text-gray-400")}
            label={doc.jenis}
            fileUrl={data?.fileUrl}
            downloadUrl={data?.id != null ? fileDownloadUrl("dokumen", data.id, "path_file") : undefined}
          />"""

new_card = """          <DocPlaceholderCard
            icon={typeIcon(doc.jenis, "text-gray-400")}
            label={doc.jenis}
            fileUrl={data?.fileUrl}
            downloadType="dokumen"
            downloadId={data?.id}
            downloadField="path_file"
          />"""

content = content.replace(old_card, new_card)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated GenericPreview DocPlaceholderCard")

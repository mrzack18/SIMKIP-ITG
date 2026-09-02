import os

filepath = r'c:\laragon\www\SIMKIP-ITG\resources\js\pages\admin\DokumenQueue.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('fileUrl={data?.fileUrl}', 'fileUrl={data?.file_url}')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated file_url mapping")

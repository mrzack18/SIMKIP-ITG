import os
import re

dir_path = r'c:\laragon\www\SIMKIP-ITG\resources\js'
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content
            
            # Replace:
            # var !== getCurrentTahunAjaran() -> true (or just let it be true for if conditions)
            # Actually, `if (var !== getCurrentTahunAjaran())` -> `if (var)`
            content = re.sub(r'([a-zA-Z0-9_]+)\s*!==\s*getCurrentTahunAjaran\(\)', r'\1', content)
            
            # Replace:
            # var === getCurrentTahunAjaran() ? undefined : var -> var
            content = re.sub(r'([a-zA-Z0-9_]+)\s*===\s*getCurrentTahunAjaran\(\)\s*\?\s*undefined\s*:\s*\1', r'\1', content)
            
            # For data fetching objects, e.g., { tahun_ajaran: filterTahunAjaran === getCurrentTahunAjaran() ? undefined : filterTahunAjaran }
            # is already covered by the above!
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated logic {filepath}')

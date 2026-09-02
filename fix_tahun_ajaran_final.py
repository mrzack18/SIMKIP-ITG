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
            
            # Find the state variable used in TahunAjaranFilter
            matches = re.findall(r'<TahunAjaranFilter[^>]*value=\{([a-zA-Z0-9_]+)\}', content)
            
            for var in matches:
                # 1. Replace useState("Semua")
                # pattern: const [var, setVar] = useState("Semua")
                content = re.sub(rf'(const\s+\[{var},\s*[a-zA-Z0-9_]+\]\s*=\s*useState(?:<string>)?\()\s*[\'\"]Semua[\'\"]\s*(\))', r'\1getCurrentTahunAjaran()\2', content)
                
                # 2. Replace === "Semua" or !== "Semua"
                content = re.sub(rf'{var}\s*===\s*[\'\"]Semua[\'\"]', f'{var} === getCurrentTahunAjaran()', content)
                content = re.sub(rf'{var}\s*!==\s*[\'\"]Semua[\'\"]', f'{var} !== getCurrentTahunAjaran()', content)

                # 3. Replace === getCurrentTahunAjaran() ? undefined : var -> var
                content = re.sub(rf'{var}\s*===\s*getCurrentTahunAjaran\(\)\s*\?\s*(?:undefined|\"\"|\'\')\s*:\s*{var}', f'{var}', content)
                # 4. Replace !== getCurrentTahunAjaran() ? var : undefined -> var
                content = re.sub(rf'{var}\s*!==\s*getCurrentTahunAjaran\(\)\s*\?\s*{var}\s*:\s*(?:undefined|\"\"|\'\')', f'{var}', content)

            if content != original_content:
                if 'getCurrentTahunAjaran' not in content or (content.count('getCurrentTahunAjaran') > 0 and 'import { getCurrentTahunAjaran' not in content and 'import {getCurrentTahunAjaran' not in content and 'import {  getCurrentTahunAjaran' not in content):
                    import_match = re.search(r'import\s+\{[^}]*TahunAjaranFilter[^}]*\}\s+from\s+[\'\"]@/components/ui/TahunAjaranFilter[\'\"];?', content)
                    if import_match:
                        new_import = import_match.group(0).replace('{', '{ getCurrentTahunAjaran, ')
                        content = content.replace(import_match.group(0), new_import)
                    else:
                        content = 'import { getCurrentTahunAjaran } from "@/components/ui/TahunAjaranFilter";\n' + content
                        
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {filepath}')

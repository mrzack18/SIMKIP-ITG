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
                # Replace useState("Semua") for this variable
                # Usually it looks like: const [varName, setVarName] = useState("Semua")
                setter_match = re.search(rf'const\s+\[{var},\s*([a-zA-Z0-9_]+)\]\s*=\s*useState(?:<string>)?\([\'\"]Semua[\'\"]\)', content)
                if setter_match:
                    setter = setter_match.group(1)
                    content = re.sub(rf'const\s+\[{var},\s*{setter}\]\s*=\s*useState(?:<string>)?\([\'\"]Semua[\'\"]\)', f'const [{var}, {setter}] = useState(getCurrentTahunAjaran())', content)
                    content = re.sub(rf'{setter}\([\'\"]Semua[\'\"]\)', f'{setter}(getCurrentTahunAjaran())', content)
                
                content = re.sub(rf'{var}\s*!==\s*[\'\"]Semua[\'\"]', f'{var} !== getCurrentTahunAjaran()', content)
                content = re.sub(rf'{var}\s*===\s*[\'\"]Semua[\'\"]', f'{var} === getCurrentTahunAjaran()', content)
                
                # Check for other initializers where setter isn't on the same line, or just handle all useState("Semua") if the var matches but this is already handled above mostly.
                
                # If there's an object property (e.g. data.tahun_ajaran === "Semua")
                
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

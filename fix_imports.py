import os
import re

dir_path = r'c:\laragon\www\SIMKIP-ITG\resources\js'
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if 'getCurrentTahunAjaran' in content:
                new_content = content
                
                # More robust generic deduplication
                match = re.search(r'import\s+\{([^}]*TahunAjaranFilter[^}]*)\}\s+from\s+[\'\"]@/components/ui/TahunAjaranFilter[\'\"];?', new_content)
                if match:
                    imports = [x.strip() for x in match.group(1).split(',')]
                    unique_imports = list(dict.fromkeys(imports))
                    if len(unique_imports) < len(imports):
                        new_import_str = 'import { ' + ', '.join(filter(None, unique_imports)) + ' } from "@/components/ui/TahunAjaranFilter";'
                        new_content = new_content.replace(match.group(0), new_import_str)

                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Fixed duplicate import in {filepath}')

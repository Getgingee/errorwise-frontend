import os
import re
from pathlib import Path

# Find all TSX/TS files
all_files = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
            all_files.append(os.path.join(root, file))

# Map of uppercase to lowercase components
component_map = {
    'Button': 'button',
    'Input': 'input',
    'Modal': 'modal',
    'Toast': 'toast',
    'LoadingSpinner': 'loadingspinner'
}

fixed_files = []

for file_path in all_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix all UI component imports
        for old, new in component_map.items():
            # Match: from '../UI/Button' or from '../../components/UI/Button'
            content = re.sub(
                rf"from (['\"])(.*/UI/){old}(['\"])",
                rf"from \1\g<2>{new}\3",
                content
            )
            # Match: from './Button'
            content = re.sub(
                rf"from (['\"])\./{old}(['\"])",
                rf"from \1./{new}\2",
                content
            )
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            fixed_files.append(file_path)
            print(f'✅ {file_path}')
    except Exception as e:
        print(f'❌ Error in {file_path}: {e}')

if fixed_files:
    print(f'\n🎉 Fixed {len(fixed_files)} files!')
else:
    print('ℹ️ No files needed fixing')

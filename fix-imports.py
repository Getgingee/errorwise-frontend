import os
import re

files_to_fix = [
    'src/components/auth/AccountDeletionDialog.tsx',
    'src/components/auth/EmailChangeDialog.tsx',
    'src/components/auth/SessionManagement.tsx',
    'src/components/subscription/ProrationPreview.tsx',
    'src/components/subscription/SubscriptionManagement.tsx',
    'src/pages/LoginPage-new.tsx',
    'src/pages/auth/RestoreAccount.tsx',
    'src/pages/auth/VerifyEmailChange.tsx',
    'src/components/UI/Modal.tsx'
]

for file_path in files_to_fix:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix imports - change uppercase to lowercase
        content = re.sub(r"from (['\"])(.*/UI/)Button\1", r"from \1\2button\1", content)
        content = re.sub(r"from (['\"])(.*/UI/)Input\1", r"from \1\2input\1", content)
        content = re.sub(r"from (['\"])(.*/UI/)Modal\1", r"from \1\2modal\1", content)
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'✅ Fixed: {file_path}')
        else:
            print(f'ℹ️ No changes needed: {file_path}')
    else:
        print(f'⚠️ Not found: {file_path}')

print('\n✅ All imports fixed!')

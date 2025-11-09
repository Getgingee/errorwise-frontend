import re

# Read the file
with open(r'c:\Users\panka\Getgingee\errorwise-frontend\src\pages\LandingPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Process line by line to properly comment sections
in_social_section = False
in_company_section = False
in_support_section = False
in_trust_section = False
in_support_email_section = False

output_lines = []
skip_until_div_close = 0

i = 0
while i < len(lines):
    line = lines[i]
    
    # Check for section markers
    if '/* Social Icons with Enhanced Glow */' in line:
        in_social_section = True
        output_lines.append('              {/* Social Icons - Hidden for deployment */}\n')
        output_lines.append('              {/*\n')
        i += 1
        continue
        
    if '/* Company Section */' in line:
        in_company_section = True
        output_lines.append('            {/* Company Section - Hidden for deployment */}\n')
        output_lines.append('            {/*\n')
        i += 1
        continue
        
    if '/* Support Section */' in line:
        in_support_section = True
        output_lines.append('            {/* Support Section - Hidden for deployment */}\n')
        output_lines.append('            {/*\n')
        i += 1
        continue
    
    # End sections when we hit closing div + closing div
    if in_social_section and '</div>' in line and i + 1 < len(lines) and '              </div>' not in lines[i+1]:
        output_lines.append(line)
        output_lines.append('              */}\n')
        in_social_section = False
        i += 1
        continue
        
    if in_company_section and '</ul>' in line and '</div>' in lines[i+1] if i + 1 < len(lines) else False:
        output_lines.append(line)
        output_lines.append(lines[i+1])  # closing div
        output_lines.append('            */}\n')
        in_company_section = False
        i += 2
        continue
        
    if in_support_section and '</ul>' in line and '</div>' in lines[i+1] if i + 1 < len(lines) else False:
        output_lines.append(line)
        output_lines.append(lines[i+1])  # closing div
        output_lines.append('            */}\n')
        in_support_section = False
        i += 2
        continue
    
    # Skip invalid comment markers from previous run
    if line.strip() in ['/*', '*/'] and (in_social_section or in_company_section or in_support_section):
        i += 1
        continue
    
    output_lines.append(line)
    i += 1

# Write back
with open(r'c:\Users\panka\Getgingee\errorwise-frontend\src\pages\LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("✅ Fixed landing page comments!")

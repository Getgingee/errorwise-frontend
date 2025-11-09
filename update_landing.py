import re

# Read the file
with open(r'c:\Users\panka\Getgingee\errorwise-frontend\src\pages\LandingPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Comment out "Get Started Free" button text in mobile menu
content = re.sub(
    r'Get Started Free',
    'Sign In',
    content
)

# 2. Comment out Trust Indicators section (Trusted by developers at...)
content = re.sub(
    r'(\s+{/\* Trust Indicators \*/}.*?</div>\s+</div>)\s+({/\* Additional Trust Elements \*/})',
    r'          {/* Trust Indicators - Hidden for deployment */}\n          /*\1\n          */\n\n          \2',
    content,
    flags=re.DOTALL
)

# 3. Comment out support@errorwise.com section
content = re.sub(
    r'({/\* Additional Trust Elements \*/}\s+<div className="mt-8.*?support@errorwise\.com.*?</div>)',
    r'/* \1 */',
    content,
    flags=re.DOTALL
)

# 4. Comment out Social Icons section
content = re.sub(
    r'(\s+{/\* Social Icons with Enhanced Glow \*/}.*?</div>)',
    r'\n              {/* Social Icons - Hidden for deployment */}\n              /*\1\n              */',
    content,
    flags=re.DOTALL
)

# 5. Comment out Company Section
content = re.sub(
    r'(\s+{/\* Company Section \*/}.*?</ul>\s+</div>)',
    r'\n            {/* Company Section - Hidden for deployment */}\n            /*\1\n            */',
    content,
    flags=re.DOTALL
)

# 6. Comment out Support Section  
content = re.sub(
    r'(\s+{/\* Support Section \*/}.*?</ul>\s+</div>)',
    r'\n            {/* Support Section - Hidden for deployment */}\n            /*\1\n            */',
    content,
    flags=re.DOTALL
)

# Write back
with open(r'c:\Users\panka\Getgingee\errorwise-frontend\src\pages\LandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Landing page updated successfully!")
print("Changes made:")
print("1. Changed 'Get Started' and 'Get Started Free' to 'Sign In'")
print("2. Commented out Trust Indicators section")
print("3. Commented out support@errorwise.com contact")
print("4. Commented out Social Icons (GitHub, Twitter, LinkedIn, Email)")
print("5. Commented out Company section (About, Blog)")
print("6. Commented out Support section (Help Center, Community, Feedback, Contact Us)")

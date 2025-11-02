$filePath = "C:\Users\panka\Webprojects\errorwise-frontend\src\pages\index.ts"
$content = Get-Content $filePath -Raw

# Add exports for new pages
$newExports = @"
export { default as ForgotPasswordPage } from './ForgotPasswordPage';
export { default as ResetPasswordPage } from './ResetPasswordPage';
"@

$content = $content + "`n" + $newExports

Set-Content $filePath $content -NoNewline
Write-Host "✅ Updated pages/index.ts - Added ForgotPasswordPage and ResetPasswordPage exports"

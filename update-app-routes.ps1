$filePath = "C:\Users\panka\Webprojects\errorwise-frontend\src\App.tsx"
$content = Get-Content $filePath -Raw

# Add imports for ForgotPasswordPage and ResetPasswordPage
$content = $content -replace '(import \{[^}]+\} from ''\.\/pages'';)', "`$1`nimport ForgotPasswordPage from './pages/ForgotPasswordPage';`nimport ResetPasswordPage from './pages/ResetPasswordPage';"

# Add routes after register route
$routesToAdd = @"
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

"@

$content = $content -replace '(<Route path="/register" element={<RegisterPage />} />)', "`$1`n$routesToAdd"

Set-Content $filePath $content -NoNewline
Write-Host "✅ Updated App.tsx - Added ForgotPasswordPage and ResetPasswordPage routes"

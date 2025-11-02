$content = Get-Content FIX_401_ERROR.md -Raw
$content = $content -replace 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTA\.ABC123\.XYZ789-abcdefghijklmnopqrstuvwxyz', 'YOUR_BOT_TOKEN_HERE_REPLACE_THIS_WITH_REAL_TOKEN'
$content = $content -replace 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTA\.ABC123\.XYZ789\.\.\.', 'YOUR_ACTUAL_BOT_TOKEN_FROM_DISCORD_PORTAL'
$content | Set-Content FIX_401_ERROR.md


Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\brain\0b342011-0d5f-4992-82bc-19a7f0eb27cd\.user_uploaded\media_1792942007339.png"
$destDir = "c:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\scratch\Sakhimaa\public\images\yoga"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Output "Image loaded. Width=$($bmp.Width), Height=$($bmp.Height)"
$bmp.Dispose()

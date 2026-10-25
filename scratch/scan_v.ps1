Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\brain\0b342011-0d5f-4992-82bc-19a7f0eb27cd\.user_uploaded\media_1792942007339.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Scan column 1 around x=100 vertically to find top and bottom of photo 1
Write-Output "--- Vertical scan at x=100 ---"
for ($y = 0; $y -lt 350; $y += 10) {
    $c = $bmp.GetPixel(100, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

Write-Output "--- Vertical scan at x=100 (row 2) ---"
for ($y = 300; $y -lt 625; $y += 10) {
    $c = $bmp.GetPixel(100, $y)
    Write-Output "y=$y : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$bmp.Dispose()

Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\brain\0b342011-0d5f-4992-82bc-19a7f0eb27cd\.user_uploaded\media_1792942007339.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Let's inspect horizontal scan at y=100 (where row 1 images should be)
# And y=400 (where row 2 images should be)
Write-Output "Image size: $($bmp.Width) x $($bmp.Height)"

# Sample horizontal pixels at y=100
for ($x = 0; $x -lt $bmp.Width; $x += 20) {
    $c = $bmp.GetPixel($x, 100)
    Write-Output "x=$x : R=$($c.R), G=$($c.G), B=$($c.B)"
}

$bmp.Dispose()

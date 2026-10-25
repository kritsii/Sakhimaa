Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\brain\0b342011-0d5f-4992-82bc-19a7f0eb27cd\.user_uploaded\media_1792942007339.png"
$destDir = "c:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\scratch\Sakhimaa\public\images\yoga"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

$crops = @(
    @{ Name = "supported-easy-pose.png"; X = 20; Y = 17; W = 308; H = 160 },
    @{ Name = "seated-side-stretch.png"; X = 360; Y = 15; W = 302; H = 162 },
    @{ Name = "gentle-cat-cow.png"; X = 697; Y = 16; W = 300; H = 161 },
    @{ Name = "supported-butterfly.png"; X = 21; Y = 333; W = 305; H = 152 },
    @{ Name = "wall-supported-mountain.png"; X = 360; Y = 333; W = 297; H = 152 },
    @{ Name = "supported-bridge.png"; X = 698; Y = 333; W = 304; H = 150 }
)

foreach ($item in $crops) {
    $rect = New-Object System.Drawing.Rectangle($item.X, $item.Y, $item.W, $item.H)
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $outPath = Join-Path $destDir $item.Name
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Output "Saved: $outPath ($($item.W)x$($item.H))"
}

$bmp.Dispose()
Write-Output "All 6 images cropped successfully."

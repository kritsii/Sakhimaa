Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\brain\0b342011-0d5f-4992-82bc-19a7f0eb27cd\.user_uploaded\media_1792942007339.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function Find-Box($cx, $cy) {
    # Scan left
    $x1 = $cx
    while ($x1 -gt 0 -and (-not ($bmp.GetPixel($x1, $cy).R -gt 248 -and $bmp.GetPixel($x1, $cy).G -gt 245 -and $bmp.GetPixel($x1, $cy).B -gt 238))) {
        $x1--
    }
    # Scan right
    $x2 = $cx
    while ($x2 -lt 1023 -and (-not ($bmp.GetPixel($x2, $cy).R -gt 248 -and $bmp.GetPixel($x2, $cy).G -gt 245 -and $bmp.GetPixel($x2, $cy).B -gt 238))) {
        $x2++
    }
    # Scan up
    $y1 = $cy
    while ($y1 -gt 0 -and (-not ($bmp.GetPixel($cx, $y1).R -gt 248 -and $bmp.GetPixel($cx, $y1).G -gt 245 -and $bmp.GetPixel($cx, $y1).B -gt 238))) {
        $y1--
    }
    # Scan down
    $y2 = $cy
    while ($y2 -lt 624 -and (-not ($bmp.GetPixel($cx, $y2).R -gt 248 -and $bmp.GetPixel($cx, $y2).G -gt 245 -and $bmp.GetPixel($cx, $y2).B -gt 238))) {
        $y2++
    }
    return "$($x1 + 1),$($y1 + 1),$($x2 - $x1 - 1),$($y2 - $y1 - 1)"
}

Write-Output "Box 1: $(Find-Box 150 100)"
Write-Output "Box 2: $(Find-Box 500 100)"
Write-Output "Box 3: $(Find-Box 850 100)"
Write-Output "Box 4: $(Find-Box 150 420)"
Write-Output "Box 5: $(Find-Box 500 420)"
Write-Output "Box 6: $(Find-Box 850 420)"

$bmp.Dispose()

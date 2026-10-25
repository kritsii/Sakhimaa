Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Kanishka Bhardwaj\.gemini\antigravity-ide\brain\0b342011-0d5f-4992-82bc-19a7f0eb27cd\.user_uploaded\media_1792942007339.png"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Function to find horizontal bounds of an image in a row given an interior y
function Get-HBounds($y, $startX) {
    # Scan left
    $left = $startX
    while ($left -gt 0) {
        $c = $bmp.GetPixel($left, $y)
        # Background of card around photo is approx white/cream (R > 248, G > 245, B > 238)
        if ($c.R -gt 248 -and $c.G -gt 245 -and $c.B -gt 238) { break }
        $left--
    }
    # Scan right
    $right = $startX
    while ($right -lt ($bmp.Width - 1)) {
        $c = $bmp.GetPixel($right, $y)
        if ($c.R -gt 248 -and $c.G -gt 245 -and $c.B -gt 238) { break }
        $right++
    }
    return @($left + 1, $right - 1)
}

# Function to find vertical bounds given an interior x
function Get-VBounds($x, $startY) {
    # Scan up
    $top = $startY
    while ($top -gt 0) {
        $c = $bmp.GetPixel($x, $top)
        if ($c.R -gt 248 -and $c.G -gt 245 -and $c.B -gt 238) { break }
        $top--
    }
    # Scan down
    $bottom = $startY
    while ($bottom -lt ($bmp.Height - 1)) {
        $c = $bmp.GetPixel($x, $bottom)
        if ($c.R -gt 248 -and $c.G -gt 245 -and $c.B -gt 238) { break }
        $bottom++
    }
    return @($top + 1, $bottom - 1)
}

$p1H = Get-HBounds 100 100
$p1V = Get-VBounds 100 100
Write-Output "Image 1: X=$($p1H[0]) to $($p1H[1]), Y=$($p1V[0]) to $($p1V[1]), W=$($p1H[1]-$p1H[0]+1), H=$($p1V[1]-$p1V[0]+1)"

$p2H = Get-HBounds 100 500
$p2V = Get-VBounds 500 100
Write-Output "Image 2: X=$($p2H[0]) to $($p2H[1]), Y=$($p2V[0]) to $($p2V[1]), W=$($p2H[1]-$p2H[0]+1), H=$($p2V[1]-$p2V[0]+1)"

$p3H = Get-HBounds 100 850
$p3V = Get-VBounds 850 100
Write-Output "Image 3: X=$($p3H[0]) to $($p3H[1]), Y=$($p3V[0]) to $($p3V[1]), W=$($p3H[1]-$p3H[0]+1), H=$($p3V[1]-$p3V[0]+1)"

$p4H = Get-HBounds 420 100
$p4V = Get-VBounds 100 420
Write-Output "Image 4: X=$($p4H[0]) to $($p4H[1]), Y=$($p4V[0]) to $($p4V[1]), W=$($p4H[1]-$p4H[0]+1), H=$($p4V[1]-$p4V[0]+1)"

$p5H = Get-HBounds 420 500
$p5V = Get-VBounds 500 420
Write-Output "Image 5: X=$($p5H[0]) to $($p5H[1]), Y=$($p5V[0]) to $($p5V[1]), W=$($p5H[1]-$p5H[0]+1), H=$($p5V[1]-$p5V[0]+1)"

$p6H = Get-HBounds 420 850
$p6V = Get-VBounds 850 420
Write-Output "Image 6: X=$($p6H[0]) to $($p6H[1]), Y=$($p6V[0]) to $($p6V[1]), W=$($p6H[1]-$p6H[0]+1), H=$($p6V[1]-$p6V[0]+1)"

$bmp.Dispose()

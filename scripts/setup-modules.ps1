$targetModules = "C:\career\Antigravity IDE\resources\app\node_modules"
$localModules = Join-Path (Get-Location) "node_modules"

if (-not (Test-Path $localModules)) {
    New-Item -ItemType Directory -Path $localModules | Out-Null
}

$packages = @(
    "react",
    "react-dom",
    "react-refresh",
    "lucide-react",
    "vite",
    "@vitejs",
    "tailwindcss",
    "postcss",
    "autoprefixer",
    "esbuild",
    "@esbuild",
    "typescript"
)

foreach ($pkg in $packages) {
    $source = Join-Path $targetModules $pkg
    $dest = Join-Path $localModules $pkg

    if ($pkg.StartsWith("@")) {
        $parent = Split-Path $dest
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent | Out-Null
        }
    }

    if (Test-Path $source) {
        if (-not (Test-Path $dest)) {
            cmd.exe /c "mklink /J ""$dest"" ""$source"""
        }
    }
}

Write-Host "Local node_modules linked successfully."


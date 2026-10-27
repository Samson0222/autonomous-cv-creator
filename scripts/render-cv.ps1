[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$requirementsPath = Join-Path $projectRoot "requirements-rendercv.txt"
$cvSourcePath = Join-Path $projectRoot "cv\cv.yaml"
$renderOutputDirectory = Join-Path $projectRoot "cv\rendercv_output"
$trackedPdfPath = Join-Path $projectRoot "cv\Samson_CV.pdf"
$versionDirectory = Join-Path $projectRoot "cv_version"

$renderCvRequirement = Get-Content -LiteralPath $requirementsPath |
    ForEach-Object { $_.Trim() } |
    Where-Object { $_ -match '^rendercv(?:\[[^]]+\])?==[^\s;]+$' } |
    Select-Object -First 1

if (-not $renderCvRequirement) {
    throw "No exact RenderCV pin was found in $requirementsPath"
}

$expectedVersion = ($renderCvRequirement -split '==', 2)[1]
$schemaDeclaration = Get-Content -LiteralPath $cvSourcePath -TotalCount 1
$expectedSchemaFragment = "/refs/tags/v$expectedVersion/schema.json"

if (-not $schemaDeclaration.Contains($expectedSchemaFragment)) {
    throw "The cv.yaml schema must match RenderCV $expectedVersion"
}

Push-Location $projectRoot
try {
    & uvx --from $renderCvRequirement rendercv render $cvSourcePath -nomd -nohtml -nopng --quiet
    if ($LASTEXITCODE -ne 0) {
        throw "RenderCV failed with exit code $LASTEXITCODE"
    }

    $generatedPdf = Get-ChildItem -LiteralPath $renderOutputDirectory -Filter "*.pdf" -File |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $generatedPdf) {
        throw "RenderCV did not create a PDF in $renderOutputDirectory"
    }

    New-Item -ItemType Directory -Force -Path $versionDirectory | Out-Null
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $versionedPdfPath = Join-Path $versionDirectory "cv_$timestamp.pdf"

    Copy-Item -LiteralPath $generatedPdf.FullName -Destination $trackedPdfPath -Force
    Copy-Item -LiteralPath $generatedPdf.FullName -Destination $versionedPdfPath

    Write-Host "Generated with $renderCvRequirement"
    Write-Host "Current PDF: $trackedPdfPath"
    Write-Host "Versioned PDF: $versionedPdfPath"
}
finally {
    Pop-Location
}

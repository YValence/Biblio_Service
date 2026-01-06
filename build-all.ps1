# build-all.ps1
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "BUILD DE TOUS LES MICROSERVICES" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Liste des microservices
$services = @("eureka-register", "apiGateWay", "ms-users", "ms-livre", "ms-emprunt")

# Compteurs
$success = 0
$failed = 0
$startTime = Get-Date

# Builder chaque service
foreach ($service in $services) {
    Write-Host "Building $service..." -ForegroundColor Yellow
    Write-Host "--------------------------------------"

    # Vérifier que le dossier existe
    if (!(Test-Path $service)) {
        Write-Host "ERREUR: Dossier $service introuvable" -ForegroundColor Red
        $failed++
        continue
    }

    # Aller dans le dossier
    Set-Location $service

    # Exécuter Maven
    mvn clean package -DskipTests -q

    # Vérifier le résultat
    if ($LASTEXITCODE -eq 0) {
        # Vérifier que le JAR existe
        $jarFile = Get-ChildItem -Path "target" -Filter "*.jar" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($jarFile) {
            $jarSize = "{0:N2} MB" -f ($jarFile.Length / 1MB)
            Write-Host "$service - BUILD REUSSI ($jarSize)" -ForegroundColor Green
            $success++
        } else {
            Write-Host "$service - JAR non trouve" -ForegroundColor Red
            $failed++
        }
    } else {
        Write-Host "$service - BUILD ECHOUE" -ForegroundColor Red
        $failed++
    }

    # Retour à la racine
    Set-Location ..
    Write-Host ""
}

# Calculer le temps total
$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

# Afficher le résumé
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "RESULTATS DU BUILD" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Succes: $success / $($success + $failed)" -ForegroundColor Green
Write-Host "Echecs: $failed / $($success + $failed)" -ForegroundColor Red
Write-Host "Temps: $([math]::Round($duration, 2))s" -ForegroundColor Yellow
Write-Host ""

if ($failed -eq 0) {
    Write-Host "TOUS LES BUILDS ONT REUSSI!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Localisation des JARs:" -ForegroundColor Cyan
    foreach ($service in $services) {
        $jarPath = "$service\target\$service-0.0.1-SNAPSHOT.jar"
        if (Test-Path $jarPath) {
            Write-Host "  -> $jarPath" -ForegroundColor White
        }
    }
    Write-Host ""
    Write-Host "Prochaine etape: docker-compose up -d" -ForegroundColor Cyan
} else {
    Write-Host "Certains builds ont echoue" -ForegroundColor Red
    Write-Host "Verifiez les erreurs ci-dessus" -ForegroundColor Red
    exit 1
}
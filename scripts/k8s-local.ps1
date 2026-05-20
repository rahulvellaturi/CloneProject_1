# Deploy to local minikube (requires minikube + kubectl)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path "k8s\secrets.yaml")) {
    Copy-Item "k8s\secrets.example.yaml" "k8s\secrets.yaml"
    Write-Host "Created k8s\secrets.yaml — edit with your database credentials."
    exit 1
}

minikube start
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
minikube addons enable ingress
kubectl apply -f k8s/ingress.yaml

Write-Host "Add to hosts file: $(minikube ip) facebook-clone.local"
Write-Host "Then open http://facebook-clone.local"

minikube start
kubectl apply -f manifests.yaml
kubectl get pods -n sc-planner
kubectl port-forward -n sc-planner service/frontend 8080:80
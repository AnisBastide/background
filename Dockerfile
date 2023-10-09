FROM --platform=linux/amd64 node:16

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

RUN helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
RUN helm repo update

RUN helm install prometheus prometheus-community/prometheus  

COPY . .

EXPOSE 3000

RUN npx prisma generate

CMD [["export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=prometheus,app.kubernetes.io/instance=prometheus" -o jsonpath="{.items[0].metadata.name}")"], ["kubectl --namespace default port-forward $POD_NAME 9090"],"npm", "start"]
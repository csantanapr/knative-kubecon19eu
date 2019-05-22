
Installing knative 0.6 on IKS
1. Install Istio
2. Install Knative
Run first with `--selector knative.dev/crd-install=true`
```bash
kubectl apply --selector knative.dev/crd-install=true \
   --filename https://github.com/knative/serving/releases/download/v0.6.0/serving.yaml \
   --filename https://github.com/knative/build/releases/download/v0.6.0/build.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.6.0/release.yaml \
   --filename https://github.com/knative/eventing-sources/releases/download/v0.6.0/eventing-sources.yaml \
   --filename https://github.com/knative/serving/releases/download/v0.6.0/monitoring.yaml \
   --filename https://raw.githubusercontent.com/knative/serving/v0.6.0/third_party/config/build/clusterrole.yaml
```
Run a second time
```bash
   kubectl apply --filename https://github.com/knative/serving/releases/download/v0.6.0/serving.yaml  \
   --filename https://github.com/knative/build/releases/download/v0.6.0/build.yaml \
   --filename https://github.com/knative/eventing/releases/download/v0.6.0/release.yaml \
   --filename https://github.com/knative/eventing-sources/releases/download/v0.6.0/eventing-sources.yaml \
   --filename https://github.com/knative/serving/releases/download/v0.6.0/monitoring.yaml \
   --filename https://raw.githubusercontent.com/knative/serving/v0.6.0/third_party/config/build/clusterrole.yaml
```

Install the `event-display` service
```bash
kubectl apply -f https://github.com/knative/eventing-sources/releases/download/v0.6.0/event-display.yaml
```

Label the namespace `default` to auto inject a default broker
```bash
kubectl label namespace default knative-eventing-injection=enabled
```
Verify that a broker `default` is available on the namespace
```bash
kubectl get broker
```
```
NAME      READY   REASON   HOSTNAME                                   AGE
default   True             default-broker.default.svc.cluster.local   7s
```
Create a Cron Job that sends event to Broker
```bash
kubectl apply -f cronjob.yaml
```
Check the registry for the new events that are register and check their type and source
```bash
kubectl get eventtypes
```
```
NAME                              TYPE                        SOURCE                                                                  SCHEMA   BROKER    DESCRIPTION   READY   REASON
dev.knative.cronjob.event-z7th8   dev.knative.cronjob.event   /apis/v1/namespaces/default/cronjobsources/test-cronjob-source-broker            default                 True
```
Now create a trigger to listen to event with type `dev.knative.cronjob.event`
```bash
kubectl -f trigger.yaml
```
Use stern to get the logs for the service event-display
```bash
stern event-display -n default -c user-container
```
````
+ event-display-49fz6-deployment-85597dcf87-lwsfc › user-container
event-display-49fz6-deployment-85597dcf87-lwsfc user-container ☁️  cloudevents.Event
event-display-49fz6-deployment-85597dcf87-lwsfc user-container Validation: valid
event-display-49fz6-deployment-85597dcf87-lwsfc user-container Context Attributes,
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   specversion: 0.2
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   type: dev.knative.cronjob.event
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   source: /apis/v1/namespaces/default/cronjobsources/test-cronjob-source-service
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   id: f452faf9-3c50-4e87-8d57-1c7c37991861
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   time: 2019-05-22T00:02:00.000408478Z
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   contenttype: application/json
event-display-49fz6-deployment-85597dcf87-lwsfc user-container Data,
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   {
event-display-49fz6-deployment-85597dcf87-lwsfc user-container     "message": "Hello world!"
event-display-49fz6-deployment-85597dcf87-lwsfc user-container   }
````

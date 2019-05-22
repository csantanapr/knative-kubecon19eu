# Workflows

The purpose of this section of the Kn documentation is to list common workflows or use-cases for the Knative CLI. This is a live document, meant to be updated as we learn more about good ways to use `kn`.

## Basic

In this basic worflow we show the CRUD (create, read, update, delete) operations on a service. We use a well known [simple Hello World service](https://github.com/knative/docs/tree/master/docs/serving/samples/hello-world/helloworld-go) that reads the environment variable `TARGET` and prints it as output.

* **Create a service in the `default` namespace from an image**

```bash
kn service create hello --image docker.io/csantanapr/helloworld-go
Service 'hello' successfully created in namespace 'default'.
```

* **Get service**

```bash
kn service get
NAME            DOMAIN                                                                     GENERATION   AGE     CONDITIONS   READY
hello           hello-default.csantana-demos.us-south.containers.appdomain.cloud           1            12s     3 OK / 3     True

```

* **Curl service endpoint**

```bash
curl hello-default.csantana-demos.us-south.containers.appdomain.cloud
Hello Knative!!
```

Where `http://xxx.xx.xxx.xx` is your Knative installation ingress.

* **Update service**

```bash
kn service update hello  --env TARGET=KubeCon
```

The service's environment variable `TARGET` is now set to `KubeCon`.

* **Describe service**

```bash
kn service describe hello
```
```yaml
apiVersion: knative.dev/v1alpha1
kind: Service
metadata:
  annotations:
    serving.knative.dev/creator: IAM#csantana@us.ibm.com
    serving.knative.dev/lastModifier: IAM#csantana@us.ibm.com
  creationTimestamp: "2019-05-21T10:16:09Z"
  generation: 2
  name: hello
  namespace: default
  resourceVersion: "2962813"
  selfLink: /apis/serving.knative.dev/v1alpha1/namespaces/default/services/hello
  uid: 73a9227c-7bb1-11e9-adcb-eacd5fa39f6c
spec:
  runLatest:
    configuration:
      revisionTemplate:
        metadata:
          creationTimestamp: null
        spec:
          container:
            env:
            - name: TARGET
              value: KubeCon
            image: docker.io/csantanapr/helloworld-go
            name: ""
            resources:
              requests:
                cpu: 400m
          timeoutSeconds: 300
status:
  address:
    hostname: hello.default.svc.cluster.local
  conditions:
  - lastTransitionTime: "2019-05-21T10:18:09Z"
    status: "True"
    type: ConfigurationsReady
  - lastTransitionTime: "2019-05-21T10:18:09Z"
    status: "True"
    type: Ready
  - lastTransitionTime: "2019-05-21T10:18:09Z"
    status: "True"
    type: RoutesReady
  domain: hello-default.csantana-demos.us-south.containers.appdomain.cloud
  domainInternal: hello.default.svc.cluster.local
  latestCreatedRevisionName: hello-fqcp7
  latestReadyRevisionName: hello-fqcp7
  observedGeneration: 2
  traffic:
  - percent: 100
    revisionName: hello-fqcp7
```

* **Delete service**

```bash
kn service delete hello
Service 'hello' successfully deleted in namespace 'default'.
```

You can then verify that the 'hello' service is deleted by trying to `get` it again.

```bash
kn service get hello
No resources found.
```

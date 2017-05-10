//
// Jenkins pipeline configuration.
// Groovy code.
//
def developersConsoleProject = 'caglabs'
def projectPrefix = 'node-uservice'
def itConfigurationEnv = 'it'
def prodConfigurationEnv = 'prod'
def stageConfigurationEnv = 'stage'
def itNamespace = projectPrefix + '-' + itConfigurationEnv
def prodNamespace = projectPrefix + '-' + prodConfigurationEnv
def stageNamespace = projectPrefix + '-' + stageConfigurationEnv
def serverImageTag = "eu.gcr.io/${developersConsoleProject}/${clusterName}-${projectPrefix}-server:${env.BUILD_NUMBER}"
def testServerImageTag = "eu.gcr.io/${developersConsoleProject}/${clusterName}-${projectPrefix}-test-server:${env.BUILD_NUMBER}"
def deployTimestamp = '$(date -u +"%Y-%m-%dT%H:%M:%SZ")'

def configureK8s(String clusterName, String namespace, GString serverImageTag, String configurationEnv, String deployTimestamp) {
    // Configure Node.js container
    sh("sed -i.bak 's#PLACEHOLDER_IMAGE_TAG#${serverImageTag}#'         k8s/server.yaml")
    sh("sed -i.bak 's#PLACEHOLDER_NODE_ENV#${configurationEnv}#'        k8s/server.yaml")
    sh("sed -i.bak 's#PLACEHOLDER_VERSION#\\\"${env.BUILD_NUMBER}\\\"#' k8s/server.yaml")
    sh("sed -i.bak \"s#PLACEHOLDER_DEPLOY_TIMESTAMP#\\\"${deployTimestamp}\\\"#\"  k8s/server.yaml")

    // Configure mongodb container
    sh("sed -i.bak 's#PLACEHOLDER_VOLUME_PD_NAME#${clusterName}-${namespace}-mongodb#' k8s/mongodb.yaml")
}

def getPodName(namespace, label) {
    def podName = "";
    def n = 0;
    while (podName.size() == 0 || !isSinglePodName(podName)) {
        podName = getPodNamesInStateRunning(namespace, label)
        if (podName.size() == 0) {
            break; // No pods are up
        }
        if (++n > 60) {
            error("Timeout waiting for a single or none server pod running")
        }
        sleep 1
    }
    return podName
}

def waitForNewPodInStateRunning(namespace, label, oldPodName) {
    def podName = "";
    while (podName.size() == 0 || oldPodName == podName || !isSinglePodName(podName)) {
        def n = 0;
        podName = getPodNamesInStateRunning(namespace, label)
        if (podName.size() == 0) {
            println 'Waiting for pod to start'
        } else if (oldPodName == podName) {
            println 'Waiting for exiting pod to stop'
        } else if (!isSinglePodName(podName)) {
            println 'Two pods are up, waiting for one of them to stop'
        }
        if (++n > 60) {
            error("Timeout waiting for server pod with state=Running")
        }
        sleep 1
    }
    return podName
}

def getPodNamesInStateRunning(namespace, label) {
    sh(script: "kubectl --namespace=${namespace} get pods -l name=${label} -o go-template --template '{{range .items}}{{.metadata.name}}{{\" \"}}{{.status.phase}}{{\"\\n\"}}{{end}}'|grep Running|awk '{print \$1}'",
            returnStdout: true).trim()
}

def isSinglePodName(s) { !s.contains("\n") }

def createDiskIfNonExisting(diskName, diskSize) {
    def rc = sh(script: "gcloud compute disks list|grep ${diskName}", returnStatus: true)
    if (rc != 0) {
        println "Creating disk ${diskName}"
        if (sh(script: "gcloud compute disks create --size=${diskSize} --zone=europe-west1-d ${diskName}",
                returnStatus: true) != 0) {
            error("Failed to create disk ${diskName}");
        }
    } else {
        println "Disk ${diskName} exists"
    }
}

def clusterName = "${env.CLUSTER_NAME}"
if (clusterName == null) {
    clusterName = "lab-1"
}

stage 'Check branch'
if (env.BRANCH_NAME != 'master') {
    println 'No pipeline action for branch ' + env.BRANCH_NAME
    return
}

node {
    stage 'Test'
    sh("kubectl create namespace ${projectPrefix}-it && true");
    checkout scm
    sh("docker build -t ${testServerImageTag} --file Dockerfile-test .")
    sh("gcloud docker push ${testServerImageTag}")

    createDiskIfNonExisting("${clusterName}-${itNamespace}-mongodb", '1GB')

    // Substitute parameters in Kubernetes config files
    configureK8s(clusterName, itNamespace, testServerImageTag, itConfigurationEnv, deployTimestamp)

    // Record how the test environment looked like before deploying
    def existingServerPodName = getPodName(itNamespace, 'server')

    // Deploy test environment
    sh("kubectl --namespace=${itNamespace} apply -f k8s/mongodb.yaml")
    sh("kubectl --namespace=${itNamespace} apply -f k8s/server.yaml")

    // Wait for test environment to be ready for running the tests
    def serverPodName = waitForNewPodInStateRunning(itNamespace, 'server', existingServerPodName)
    println "Server pod started: '" + serverPodName + "'"

    // Test environment is ready, integration tests can be started
    if (sh(script: "kubectl --namespace=${itNamespace} exec ${serverPodName} npm test", returnStatus: true) != 0) {
        error("Integration test failed");
    }
    println 'Integration test succeeded'
    sh("kubectl delete namespace ${projectPrefix}-it");
}

node {
    stage 'Build'
    checkout scm
    sh("docker build -t ${serverImageTag} .")
    sh("gcloud docker push ${serverImageTag}")
}

stage 'Stage environment'
node {
    sh("kubectl create namespace ${projectPrefix}-stage");
    createDiskIfNonExisting("${clusterName}-${stageNamespace}-mongodb", '1GB')
    checkout scm

    // Substitute parameters in Kubernetes config files
    configureK8s(clusterName, stageNamespace, serverImageTag, stageConfigurationEnv, deployTimestamp)

    // Deploy
    sh("kubectl --namespace=${stageNamespace} apply -f k8s/")
}

stage 'Production checkpoint'
input message: 'Deploy to production?'

stage 'Production environment'
node {
    sh("kubectl create namespace ${projectPrefix}-prod");
    createDiskIfNonExisting("${clusterName}-${prodNamespace}-mongodb", '1GB')
    checkout scm

    // Substitute parameters in Kubernetes config files
    configureK8s(clusterName, prodNamespace, serverImageTag, prodConfigurationEnv, deployTimestamp)

    // Deploy
    sh("kubectl --namespace=${prodNamespace} apply -f k8s/")
}

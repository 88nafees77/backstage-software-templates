@Library('jsl') _

pipeline {
  agent any
  options {
      disableConcurrentBuilds()
      buildDiscarder(logRotator(numToKeepStr:'5',artifactNumToKeepStr: '5'))
  }

  environment {
    ProjectName = "user-profile"
    Team = "${{values.owner}}"
    ProjectKey = "TB"
    Assignee = "rohit"
    Cmr_id = "${env.Team}/${env.ProjectName}"
    EcrUrl = "230367374156.dkr.ecr.us-east-1.amazonaws.com"
    Version = readMavenPom().getVersion()
    BuildEnv = "production"
    EcrRepo = "platform-services"
    Current_tag = "v${env.Version}"
    Image = "${env.EcrUrl}/${env.EcrRepo}"
    BuildStatusNotifyChannel= "#platform-techbrew-team"
    JiraTicketNotifyChannel = "#platform-techbrew-team"
    TeamEmail = "platform-techbrew-team@miqdigital.com"
  }
  stages {
    stage('Jira Ticket status check and CMR Creation') {
      steps {
         script{
              common.jira_cmr_creation_prod(env.ProjectName,env.Team, env.Version, env.ProjectKey, env.Assignee, env.Cmr_id, env.Current_tag, env.JiraTicketNotifyChannel)
           }
        }
      }
     stage('Jira Ticket Status Polling') {
      steps {
        script{
           common.jira_cmr_status_approval_poll(env.Version, env.Cmr_id, 'release')
         }
      }
    }
    stage('Production Deployment') {
        steps {
            script {
            try {
                common.notifyBuild('STARTED',env.BuildStatusNotifyChannel, env.Team, env.ProjectName, env.Current_tag)
                def imageTag = 'userprofile-core-' + env.Current_tag
                def additionalArgs = '--wait --history-max 10 --set image.tag=' + imageTag
                common.kube_helm3_deploy('production', 'pt-userprofile-production' , 'userprofile', 'deployment/chart', 'eks-production', additionalArgs)
            }catch (e) {
           // If there was an exception thrown, the build failed
             currentBuild.result = "FAILED"
            } finally {
         // Success or failure, always send notifications
            common.notifyBuild(currentBuild.result,env.BuildStatusNotifyChannel, env.Team, env.ProjectName, env.Current_tag)
            common.prod_metric_collector('${env.Team}-${env.ProjectName}-${env.BuildEnv}-deployment', env.BuildEnv)
          }
        }
      }
    }
  }
  post {
    failure {
          emailext (
              subject: "Failed ${env.ProjectName} for ${env.Version}",
              to: '${env.TeamEmail}',
              body: "Check console output at ${env.BUILD_URL}",
          )
          }
      unstable {
          emailext (
              subject: "Failed ${env.ProjectName} for ${env.Version}",
              to: '${env.TeamEmail}',
              body: "Check console output at ${env.BUILD_URL}",
          )
      }
      always {
          cleanWs()
    }
  }
}

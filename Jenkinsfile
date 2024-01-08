pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dh_creden')
    }

    stages {
        stage('Checkout'){
            steps{
                checkout scm
            }
        }

        stage('test'){
              steps {
                  sh 'docker ps'
              }
          }

        stage('Init'){
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Build & Push'){
            steps {
                sh 'docker build -t $DOCKERHUB_CREDENTIALS_USR/np:$BUILD_ID .'
                sh 'docker push $DOCKERHUB_CREDENTIALS_USR/np:$BUILD_ID'
                sh 'docker rmi $DOCKERHUB_CREDENTIALS_USR/np:$BUILD_ID'

            }
        }

        stage('logout'){
            steps {
                sh 'docker logout'
            }
        }

    }
}
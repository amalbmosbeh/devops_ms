pipeline {
    agent any

    environment {
        // Ajouter la variable dh_cred comme variables d'authentification
        DOCKERHUB_CREDENTIALS = credentials('dh_creden')
    }

    triggers {
        pollSCM('*/5 * * * *') // Vérifier toutes les 5 minutes
    }

    stages {
        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Init') {
            steps {
                script {
                    // Utiliser le même nom pour les informations d'authentification
                    def registryCredentials = docker.registryCredentials('dh_creden')

                    // Créer un fichier de configuration Docker avec les informations d'authentification
                    sh "echo '{\"auths\":{\"${registryCredentials.url}\":{\"username\":\"${registryCredentials.username}\",\"password\":\"${registryCredentials.password}\",\"email\":\"${registryCredentials.email}\",\"auth\":\"${registryCredentials.token}\"}}}' > ~/.docker/config.json"

                    // Assurer que le fichier de configuration a les bonnes autorisations
                    sh 'chmod 0600 ~/.docker/config.json'
                }
            }
        }

        stage('Configure Docker') {
            steps {
                script {
                    // Ajoutez cette étape pour configurer Docker
                    wrap([$class: 'DockerConfiguration']) {
                    // Configure Docker
                    def dockerHome = tool 'Docker'
                    env.PATH = "${dockerHome}/bin:${env.PATH}"
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t $DOCKERHUB_CREDENTIALS_USR/devops-ms-app:$BUILD_ID .'
            }
        }

        stage('Deliver') {
            steps {
                sh 'docker push $DOCKERHUB_CREDENTIALS_USR/devops-ms-app:$BUILD_ID'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker rmi $DOCKERHUB_CREDENTIALS_USR/devops-ms-app:$BUILD_ID'
                sh 'docker logout'
            }
        }
    }
}

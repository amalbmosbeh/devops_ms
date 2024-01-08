pipeline {
    agent any

    environment {
        // Ajouter la variable dh_cred comme variables d'authentification
        DOCKERHUB_CREDENTIALS = credentials('dh_credentials')
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
                     def registryCredentials = docker.registryCredentials('dh_credentials')
            
            // Créez un fichier de configuration Docker avec les informations d'authentification
            sh "echo '{\"auths\":{\"${registryCredentials.url}\":{\"username\":\"${registryCredentials.username}\",\"password\":\"${registryCredentials.password}\",\"email\":\"${registryCredentials.email}\",\"auth\":\"${registryCredentials.token}\"}}}' > ~/.docker/config.json"
            
            // Assurez-vous que le fichier de configuration a les bonnes autorisations
            sh 'chmod 0600 ~/.docker/config.json'
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

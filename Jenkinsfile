pipeline {
    agent any

    environment {
        AWS_REGION     = 'us-east-1'
        AWS_ACCOUNT_ID = '843916760293'
        ECR_REPO_NAME  = 'my-app-repo'
        ECR_URI        = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        
        // AWS CLI automatically recognizes these standard variable names!
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check or Create ECR Repo') {
            steps {
                sh '''
                    echo "=== Checking / Creating ECR Repository ==="
                    if ! aws ecr describe-repositories --repository-names "${ECR_REPO_NAME}" --region "${AWS_REGION}" > /dev/null 2>&1; then
                        echo "ECR Repository '${ECR_REPO_NAME}' does not exist. Creating now..."
                        aws ecr create-repository --repository-name "${ECR_REPO_NAME}" --region "${AWS_REGION}"
                    else
                        echo "ECR Repository '${ECR_REPO_NAME}' already exists."
                    fi
                '''
            }
        }

        stage('ECR Login & Docker Build') {
            steps {
                sh '''
                    echo "=== Logging in to AWS ECR ==="
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

                    echo "=== Building Docker Image ==="
                    docker build -t ${ECR_REPO_NAME}:${IMAGE_TAG} .
                '''
            }
        }

        stage('Tag & Push Image') {
            steps {
                sh '''
                    echo "=== Tagging Image for ECR ==="
                    docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${ECR_URI}/${ECR_REPO_NAME}:${IMAGE_TAG}
                    docker tag ${ECR_REPO_NAME}:${IMAGE_TAG} ${ECR_URI}/${ECR_REPO_NAME}:latest

                    echo "=== Pushing Image to ECR ==="
                    docker push ${ECR_URI}/${ECR_REPO_NAME}:${IMAGE_TAG}
                    docker push ${ECR_URI}/${ECR_REPO_NAME}:latest
                '''
            }
        }
    }

    post {
        always {
            echo "=== Cleaning up local Docker images ==="
            sh "docker rmi ${env.ECR_REPO_NAME}:${env.IMAGE_TAG} || true"
            sh "docker rmi ${env.ECR_URI}/${env.ECR_REPO_NAME}:${env.IMAGE_TAG} || true"
            sh "docker rmi ${env.ECR_URI}/${env.ECR_REPO_NAME}:latest || true"
        }
        success {
            echo "Pipeline completed successfully! Docker image pushed to ECR."
        }
        failure {
            echo "Pipeline failed! Check the logs above for errors."
        }
    }
}

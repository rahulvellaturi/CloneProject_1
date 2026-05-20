// Free self-hosted Jenkins pipeline (run via infra/jenkins/docker-compose.yml)
pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker compose'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend — build & test') {
            steps {
                dir('backend') {
                    sh 'mvn -B verify'
                }
            }
        }

        stage('Frontend — build & test') {
            steps {
                dir('frontend') {
                    sh 'npm ci --no-fund --no-audit'
                    sh 'npm test -- --watchAll=false --passWithNoTests'
                    sh 'REACT_APP_API_URL=http://localhost:8080/api npm run build'
                }
            }
        }

        stage('Docker — build images') {
            steps {
                sh '${DOCKER_COMPOSE} build'
            }
        }

        stage('Docker — smoke test') {
            steps {
                sh '''
                    ${DOCKER_COMPOSE} up -d
                    sleep 90
                    curl -sf http://localhost:8080/actuator/health
                    curl -sf http://localhost:3000/
                    ${DOCKER_COMPOSE} down -v
                '''
            }
        }
    }

    post {
        always {
            sh '${DOCKER_COMPOSE} down -v || true'
            junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
        }
    }
}

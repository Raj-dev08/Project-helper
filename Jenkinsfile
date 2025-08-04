pipeline {
    agent any

    environment {
        ADMIN_PASSWORD = credentials('ADMIN_PASSWORD')
        API_KEY = credentials('API_KEY')
        ARCJET_KEY = credentials('ARCJET_KEY')
        CLOUDINARY_API_KEY = credentials('CLOUDINARY_API_KEY')
        CLOUDINARY_API_SECRET = credentials('CLOUDINARY_API_SECRET')
        CLOUDINARY_CLOUD_NAME = credentials('CLOUDINARY_CLOUD_NAME')
        JWT_SECRET = credentials('JWT_SECRET')
        MONGODB_URI = credentials('MONGODB_URI')
        PORT = '5000'
        STEAM_API_KEY = credentials('STEAM_API_KEY')
        STEAM_API_SECRET = credentials('STEAM_API_SECRET')
        UPSTASH_REDIS_URL = credentials('UPSTASH_REDIS_URL')
        VITE_API_KEY = credentials('VITE_API_KEY')
        VITE_STREAM_API_KEY = credentials('VITE_STREAM_API_KEY')
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning Jenkins workspace...'
                cleanWs()
            }
        }
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }


        stage('Setup Environment Files') {
            steps {
                dir('backend') {
                    writeFile file: '.env', text: """
MONGODB_URI=${env.MONGODB_URI}
PORT=${env.PORT}
JWT_SECRET=${env.JWT_SECRET}
CLOUDINARY_CLOUD_NAME=${env.CLOUDINARY_CLOUD_NAME}
CLOUDINARY_API_KEY=${env.CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${env.CLOUDINARY_API_SECRET}
UPSTASH_REDIS_URL=${env.UPSTASH_REDIS_URL}
ADMIN_PASSWORD=${env.ADMIN_PASSWORD}
ARCJET_KEY=${env.ARCJET_KEY}
STEAM_API_KEY=${env.STEAM_API_KEY}
STEAM_API_SECRET=${env.STEAM_API_SECRET}
"""
                }
                dir('frontend') {
                    writeFile file: '.env', text: """
VITE_STREAM_API_KEY=${env.STEAM_API_KEY}
VITE_API_KEY=${env.VITE_API_KEY}
"""
                }
            }
        }
        stage('Install Visual C++ Redistributable') {
            steps {
                bat '''
                    powershell -Command "Invoke-WebRequest -Uri 'https://aka.ms/vs/17/release/vc_redist.x64.exe' -OutFile vc_redist.x64.exe"
                    vc_redist.x64.exe /install /quiet /norestart
                '''
            }
        }


        stage('Install Backend for Testing and frontend for build') {
            environment{
                NODE_ENV="development"
            }
            steps {
                dir('backend') {
                    echo 'Installing backend with dev dependencies for testing...'
                    bat '''
                        if exist node_modules rmdir /s /q node_modules
                        npm install --include=dev
                    '''
                }
            }
        }

        stage('Run Backend Tests') {
             environment{
                NODE_ENV="test"
            }
            steps {
                dir('backend') {
                    bat '''
                        npm test
                    '''
                }
            }
        }
        stage('Install Frontend') {
             environment{
                NODE_ENV="development"
            }
            steps {
                dir('frontend') {
                    bat '''
                        if exist node_modules rmdir /s /q node_modules
                        npm install --include=dev
                       
                    '''
                }
            }
        }
        stage('Build Frontend') {
            environment {
                NODE_ENV = "development"
            }
            steps {
                dir('frontend') {
                    bat '''
                        npm run build || exit /b %errorlevel%
                        dir /s /b dist || echo "DIST folder missing!"
                    '''
                }
            }
        }

        //optional checking and adding

        // stage('Check Frontend Structure') {
        //     steps {
        //         dir('frontend') {
        //             bat 'dir /s /b'
        //         }
        //     }
        // }


        // stage('Move Frontend Build') {
        //     steps {
        //         bat 'if not exist backend\\public mkdir backend\\public'
        //         bat 'xcopy frontend\\dist backend\\public /E /I /Y'
        //     }
        // }

        stage('Run Application') {
             environment{
                NODE_ENV="production"
            }
            steps {
                dir('backend') {
                    bat '''
                        docker compose down || exit 0
                        docker compose up -d --build
                    '''
                }
            }
        }

    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed.'
        }
    }
}

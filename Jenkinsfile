pipeline {
    agent any

    environment {
        MONGODB_URI="mongodb://admin:password@mongo:27017/project-helper?authSource=admin"
        PORT=5000
        JWT_SECRET="3b4ab1987b62199a05274250638646f243be808c9d0e1df668d69b0a2e98fc33"
        NODE_ENV="production"
        CLOUDINARY_CLOUD_NAME="dnvmiiboh"
        CLOUDINARY_API_KEY="877159668992191"
        CLOUDINARY_API_SECRET="dN-tjFvgb7blUiaO26-OTELmwXo"
        UPSTASH_REDIS_URL="redis://redis:6379"
        ADMIN_PASSWORD="hailhitler123"
        ARCJET_KEY="ajkey_01jv6xz7xcfykvqvadsctbbwpq"
        STEAM_API_KEY="4fbycczcyynb"
        STEAM_API_SECRET="8gxz9yejcfqu5gwdgdrhnsbhjnrzy6mtgszmxkhfrb4r643bd4pm9qb9ckf9upq3"
        API_KEY="UM3AOh4LBkoUmqO5zHory0WjO9L8tP1m"
    }

    stages {
        stage('Clean Workspace') {
            steps {
                echo 'Cleaning Jenkins workspace...'
                cleanWs()
            }
        }

        stage('Setup Environment Files') {
            steps {
                dir('backend') {
                    writeFile file: '.env', text: """
MONGODB_URI=${env.MONGODB_URI}
PORT=${env.PORT}
JWT_SECRET=${env.JWT_SECRET}
NODE_ENV=${env.NODE_ENV}
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
VITE_API_KEY=${env.API_KEY}
"""
                }
            }
        }

        stage('Install Backend for Testing') {
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
            steps {
                dir('backend') {
                    bat '''
                        set NODE_ENV=test
                        npm test -- --runInBand
                    '''
                }
            }
        }

        stage('Build Application') {
            steps {
                echo 'Building full application (frontend + backend for production)...'
                bat 'npm run build'
            }
        }

        stage('Run Application') {
            steps {
                dir('backend') {
                    bat '''
                        set NODE_ENV=production
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

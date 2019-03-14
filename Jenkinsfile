pipeline {
    agent any 
    tools {
        maven "maven-3.x"
        nodejs "nodejs-10.x"
    }
    stages {
		stage('Clean'){
            steps {
                bat "mvn clean:clean"
            }
        }
        stage('Deploy And Test'){
            steps {
                script {
                    // feature branches are deployed to environment used for development
                    if(env.BRANCH_NAME.startsWith('feature')) {
                        profile = 'feature'
                    } else  {
                        profile = env.BRANCH_NAME    
                    }
                }
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'apigeeAIO-credentials',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {     
                     configFileProvider([configFile(fileId: 'apigee-settings-orange', variable: 'APIGEE_SETTINGS')]) {
                        bat "mvn install -s${APIGEE_SETTINGS} -P${profile} -Ddescription.suffix=\" branch: ${BRANCH_NAME} commit: ${GIT_COMMIT}\" -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
                    }
 
                }
            }
        }
    }
    post {
        always {
            
            cucumber 'test/integration/report.json'
        }
    }
}

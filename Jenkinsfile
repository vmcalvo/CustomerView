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
		stage('JsCode Quality'){
            steps {
                bat "mvn com.cj.jshintmojo:jshint-maven-plugin:1.6.0:lint@validate-proxy-sources"
            }
        }
		stage('JsUnit Test'){
            steps {
                bat "mvn org.codehaus.mojo:exec-maven-plugin:1.6.0:exec@install-unit-tests-node-packages"
				//bat "mvn org.codehaus.mojo:exec-maven-plugin:1.6.0:exec@run-unit-tests"
            }
        }
		stage('Copy Resources'){
            steps {
                bat "mvn org.apache.maven.plugins:maven-resources-plugin:2.6:copy-resources@copy-resources"
            }
			
        }
		stage('CreateConfig'){
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
                        bat "mvn org.apache.maven.plugins:maven-resources-plugin:2.6:copy-resources@copy-resources -s${APIGEE_SETTINGS} -P${profile} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
                    }
 
                }
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

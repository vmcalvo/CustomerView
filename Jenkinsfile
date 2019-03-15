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
				bat "mvn --version"
                //bat "mvn org.codehaus.mojo:exec-maven-plugin:1.6.0:exec@install-unit-tests-node-packages"
				//bat "mvn org.codehaus.mojo:exec-maven-plugin:1.6.0:exec@run-unit-tests"
            }
        }		
		stage('CreateConfig'){
            steps {
                script {
					suffix = ''
                    org = 'orange'
					enviroment = 'dev'
                    if(env.BRANCH_NAME.startsWith('develop')) {
                        enviroment = 'uat'
						suffix = '-jenkins'
                    } else if(env.BRANCH_NAME.startsWith('master')){
                        enviroment = 'prod'						
                    }
                }
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'apigeeAIO-credentials',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {     
                     configFileProvider([configFile(fileId: 'apigee-settings-orange', variable: 'APIGEE_SETTINGS')]) {
						bat "mvn org.apache.maven.plugins:maven-resources-plugin:2.6:copy-resources@copy-resources -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix}"
                        bat "mvn com.apigee.edge.config:apigee-config-maven-plugin:1.2.1:caches@create-config-cache -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn com.apigee.edge.config:apigee-config-maven-plugin:1.2.1:kvms@create-config-kvm -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn com.apigee.edge.config:apigee-config-maven-plugin:1.2.1:targetservers@targetservers -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"						
                    }
 
                }
            }
        }
		stage('Deploy'){
            steps {
               script {
					suffix = ''
                    org = 'orange'
                    if(env.BRANCH_NAME.startsWith('develop')) {
                        enviroment = 'uat'
						suffix = '-jenkins'
                    } else if(env.BRANCH_NAME.startsWith('master')){
                        enviroment = 'prod'						
                    }
                }
                withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'apigeeAIO-credentials',
                            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {     
                     configFileProvider([configFile(fileId: 'apigee-settings-orange', variable: 'APIGEE_SETTINGS')]) {
                        bat "mvn io.apigee.build-tools.enterprise4g:apigee-edge-maven-plugin:1.1.6:configure@config-json -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Ddescription.suffix=\" branch: ${BRANCH_NAME} commit: ${GIT_COMMIT}\" -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						 bat "mvn io.apigee.build-tools.enterprise4g:apigee-edge-maven-plugin:1.1.6:deploy@deploy-api-proxy -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Ddescription.suffix=\" branch: ${BRANCH_NAME} commit: ${GIT_COMMIT}\" -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
                    }
 
                }
            }
        }
		stage('CreateProducts'){
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
						bat "mvn com.apigee.edge.config:apigee-config-maven-plugin:1.2.1:apiproducts@create-config-apiproduct -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn com.apigee.edge.config:apigee-config-maven-plugin:1.2.1:developers@create-config-developer -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn org.codehaus.gmavenplus:gmavenplus-plugin:1.6:execute@update-apigee-config-options -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn org.apache.maven.plugins:maven-install-plugin:2.4:install"
						bat "mvn com.apigee.edge.config:apigee-config-maven-plugin:1.2.1:apps@create-config-app -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn com.apigee.edge.config:apigee-config-maven-plugin:1.2.1:exportAppKeys@export-app-keys -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
                    }
 
                }
            }
        }
        stage('IntegrationTest'){
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
						bat "mvn org.codehaus.gmavenplus:gmavenplus-plugin:1.6:execute@read-developer-app-credentials -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn org.codehaus.gmavenplus:gmavenplus-plugin:1.6:execute@set-test-world-parameters -s${APIGEE_SETTINGS} -Dapigee.org=${org} -Dapigee.env=${enviroment} -Ddeployment.suffix=${suffix} -Dentity.suffix=${suffix} -Dusername=${USERNAME} -Dpassword=${PASSWORD}"
						bat "mvn org.codehaus.mojo:exec-maven-plugin:1.6.0:exec@install-integration-tests-node-packages"
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

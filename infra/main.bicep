// Azure AI Webapp Infrastructure
param location string = resourceGroup().location
param projectName string = 'yolov8-detection'
param environmentName string = 'prod'

// Variables for resource naming
var prefix = '${projectName}-${environmentName}'
var acrName = replace('${prefix}acr', '-', '')
var appServicePlanName = '${prefix}-asp'
var frontendAppName = '${prefix}-fe'
var backendAppName = '${prefix}-be'
var mlProcessorAppName = '${prefix}-ml'
var postgresServerName = '${prefix}-postgres'
var postgresDbName = 'detection_db'
var postgresAdminLogin = 'postgres_admin'
@secure()
param postgresAdminPassword string

// Container Registry
resource acr 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// App Service Plan with GPU support for ML processing
resource mlAppServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: '${appServicePlanName}-ml'
  location: location
  sku: {
    name: 'P1v3'  // Consider P2v3 or P3v3 for better GPU performance, depending on need
    tier: 'PremiumV3'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Standard App Service Plan for Frontend and Backend
resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'P1v2'
    tier: 'PremiumV2'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Frontend Web App
resource frontendApp 'Microsoft.Web/sites@2021-02-01' = {
  name: frontendAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acr.properties.loginServer}/frontend:latest'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${acr.properties.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: acr.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: acr.listCredentials().passwords[0].value
        }
        {
          name: 'WEBSITES_PORT'
          value: '3000'
        }
        {
          name: 'REACT_APP_API_URL'
          value: 'https://${backendApp.properties.defaultHostName}'
        }
      ]
    }
  }
}

// Backend API App
resource backendApp 'Microsoft.Web/sites@2021-02-01' = {
  name: backendAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acr.properties.loginServer}/backend:latest'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${acr.properties.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: acr.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: acr.listCredentials().passwords[0].value
        }
        {
          name: 'WEBSITES_PORT'
          value: '8000'
        }
        {
          name: 'DATABASE_URL'
          value: 'postgresql://${postgresAdminLogin}@${postgresServer.name}:${postgresAdminPassword}@${postgresServer.properties.fullyQualifiedDomainName}:5432/${postgresDbName}'
        }
        {
          name: 'ML_SERVICE_URL'
          value: 'https://${mlProcessorApp.properties.defaultHostName}'
        }
      ]
    }
  }
}

// ML Processor App
resource mlProcessorApp 'Microsoft.Web/sites@2021-02-01' = {
  name: mlProcessorAppName
  location: location
  properties: {
    serverFarmId: mlAppServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acr.properties.loginServer}/ml-processor:latest'
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${acr.properties.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: acr.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: acr.listCredentials().passwords[0].value
        }
        {
          name: 'WEBSITES_PORT'
          value: '8001'
        }
        {
          name: 'MODEL_PATH'
          value: '/app/models/yolov8n.pt'
        }
      ]
    }
  }
}

// PostgreSQL Server
resource postgresServer 'Microsoft.DBforPostgreSQL/servers@2017-12-01' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'GP_Gen5_2'
    tier: 'GeneralPurpose'
    family: 'Gen5'
    capacity: 2
  }
  properties: {
    createMode: 'Default'
    version: '11'
    administratorLogin: postgresAdminLogin
    administratorLoginPassword: postgresAdminPassword
    sslEnforcement: 'Enabled'
  }
}

// PostgreSQL Firewall Rules
resource postgresFirewallRule 'Microsoft.DBforPostgreSQL/servers/firewallRules@2017-12-01' = {
  name: '${postgresServerName}/AllowAllAzureIPs'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
  dependsOn: [
    postgresServer
  ]
}

// PostgreSQL Database
resource postgresDB '
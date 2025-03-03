const fetch = require('node-fetch');

// Configuration
const WORKSPACE_ID = 'your-workspace-id';
const SECRET_KEY = 'your-webhook-secret-key';
const API_URL = `https://uselum.com/api/webhooks/${WORKSPACE_ID}`;

// Test payload
const payload = {
  call_id: `test-call-${Date.now()}`,
  status: 'completed',
  duration: Math.floor(Math.random() * 300),
  caller_number: '+15551234567',
  receiver_number: '+15559876543',
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'spring_sale',
  timestamp: new Date().toISOString()
};

// Send the webhook request
async function testWebhook() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': SECRET_KEY
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Webhook test successful!');
    } else {
      console.error('❌ Webhook test failed!');
    }
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testWebhook(); 
// test-auth.ts
import 'dotenv/config';
import { UiPath } from '@uipath/uipath-typescript';

async function testAuthentication() {
  const sdk = new UiPath({
    baseUrl: process.env.UIPATH_BASE_URL!,
    orgName: process.env.UIPATH_ORG_NAME!,
    tenantName: process.env.UIPATH_TENANT_NAME!,
    clientId: process.env.UIPATH_CLIENT_ID!,
    redirectUri: process.env.UIPATH_REDIRECT_URI!,
    scope: process.env.UIPATH_SCOPE!
  });

  try {
    // Initialize OAuth authentication
    console.log('🔄 Initializing OAuth authentication...');
    console.log('🌐 A browser window will open for authentication...');
    
    await sdk.initialize();
    
    // Wait a moment for OAuth callback to complete
    console.log('⏳ Waiting for OAuth callback...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if authentication was successful
    if (!sdk.isAuthenticated()) {
      console.log('❌ OAuth authentication failed or incomplete');
      console.log('💡 Please complete the OAuth flow in your browser and try again');
      console.log('🔗 Make sure your redirect URI is set to:', process.env.UIPATH_REDIRECT_URI);
      return;
    }
    
    console.log('✅ OAuth authentication successful!');
    
    // Test with a simple API call
    const assets = await sdk.assets.getAll();
    console.log('🎉 Authentication successful!');
    console.log(`✅ Connected to ${process.env.UIPATH_ORG_NAME}/${process.env.UIPATH_TENANT_NAME}`);
    console.log(`✅ Found ${assets.items.length} assets`);

  } catch (error) {
    console.error('❌ Authentication failed:');
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

testAuthentication();

const http = require('http');
const path = require('path');
const fs = require('fs');

console.log('🔍 Testing Image Access...\n');

// Test a few sample images
const testImages = [
  '/uploads/projects/MC HOUSE - RESI/1.png',
  '/uploads/projects/VILLA HOUSE - RESI/4.png',
  '/uploads/projects/LB NAGAR  - OFFICE  - COMM/1.png'
];

const testImageAccess = (imagePath) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: imagePath,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          path: imagePath,
          status: res.statusCode,
          accessible: res.statusCode === 200,
          size: data.length
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path: imagePath,
        status: 'ERROR',
        accessible: false,
        error: err.message
      });
    });

    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Testing image accessibility via backend...\n');
  
  for (const imagePath of testImages) {
    const result = await testImageAccess(imagePath);
    console.log(`${result.accessible ? '✅' : '❌'} ${imagePath}`);
    console.log(`   Status: ${result.status}`);
    if (result.accessible) {
      console.log(`   Size: ${result.size} bytes`);
    } else if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  }
  
  console.log('🎯 Frontend should now be able to load images from:');
  console.log('   http://localhost:3001/uploads/projects/...');
  console.log('\n📝 Make sure your frontend is running on port 5173 and backend on port 3001');
};

runTests(); 
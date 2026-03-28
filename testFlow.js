const http = require('http');

async function makeRequest(path, method, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting E2E Tests ---');
  try {
    // 1. Send OTP
    console.log('\n[1] Testing POST /api/auth/send-otp...');
    const sendOtpRes = await makeRequest('/api/auth/send-otp', 'POST', { identifier: 'admin@vitto.ai' });
    console.log('Status:', sendOtpRes.status, typeof sendOtpRes.data === 'string' ? '' : sendOtpRes.data);
    const mockOtp = sendOtpRes.data.mockOtp;

    // 2. Verify OTP
    console.log('\n[2] Testing POST /api/auth/verify-otp...');
    const verifyOtpRes = await makeRequest('/api/auth/verify-otp', 'POST', { identifier: 'admin@vitto.ai', otp: mockOtp });
    console.log('Status:', verifyOtpRes.status, typeof verifyOtpRes.data === 'string' ? '' : verifyOtpRes.data);

    // 3. Create Lead
    console.log('\n[3] Testing POST /api/leads...');
    const leadEmail = `test_${Date.now()}@vittobank.com`;
    const leadPhone = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const createLeadRes = await makeRequest('/api/leads', 'POST', {
      email: leadEmail,
      phone: leadPhone,
      institution_name: 'Vitto Demo Bank',
      institution_type: 'Bank',
      city: 'San Francisco',
      loan_book_size: 1500000
    });
    console.log('Status:', createLeadRes.status, typeof createLeadRes.data === 'string' ? '' : createLeadRes.data);
    const leadId = createLeadRes.data.lead?.id;

    // 4. Get Lead
    if (leadId) {
      console.log(`\n[4] Testing GET /api/leads/${leadId}...`);
      const getLeadRes = await makeRequest(`/api/leads/${leadId}`, 'GET');
      console.log('Status:', getLeadRes.status, typeof getLeadRes.data === 'string' ? '' : getLeadRes.data);
    } else {
      console.log('\n[4] Skipping GET Lead test because creation failed or ID was not returned.');
    }

    console.log('\n--- E2E Tests Completed ---');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

runTests();

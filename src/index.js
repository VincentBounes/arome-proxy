// Worker Cloudflare — arome-proxy v3
// Proxy CORS pour l'API WMS AROME Prévision Immédiate de Météo-France

const MF_KEY = 'eyJ4NXQiOiJZV0kxTTJZNE1qWTNOemsyTkRZeU5XTTRPV014TXpjek1UVmhNbU14T1RSa09ETXlOVEE0Tnc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJWaW5jZW50Qm91bmVzMzFAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJWaW5jZW50Qm91bmVzMzEiLCJ0aWVyUXVvdGFUeXBlIjpudWxsLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6IkRlZmF1bHRBcHBsaWNhdGlvbiIsImlkIjo0ODEzMywidXVpZCI6Ijg4MjJkZTAwLWYwODQtNDE5MC1iMWY4LTI2NmU5NjkzYjEzYiJ9LCJpc3MiOiJodHRwczpcL1wvcG9ydGFpbC1hcGkubWV0ZW9mcmFuY2UuZnI6NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsiNTBQZXJNaW4iOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6InNlYyJ9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJBUk9NRS1QSSIsImNvbnRleHQiOiJcL3B1YmxpY1wvYXJvbWVwaVwvMS4wIiwicHVibGlzaGVyIjoiYWRtaW5fbWYiLCJ2ZXJzaW9uIjoiMS4wIiwic3Vic2NyaXB0aW9uVGllciI6IjUwUGVyTWluIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRvbm5lZXNQdWJsaXF1ZXNNZXRlb0ZvcmV0cyIsImNvbnRleHQiOiJcL3B1YmxpY1wvRFBNZXRlb0ZvcmV0c1wvdjEiLCJwdWJsaXNoZXIiOiJtdXJpZWwuYXViaW4iLCJ2ZXJzaW9uIjoidjEiLCJzdWJzY3JpcHRpb25UaWVyIjoiNTBQZXJNaW4ifV0sImV4cCI6MTg4NDU2NTc1OCwidG9rZW5fdHlwZSI6ImFwaUtleSIsImlhdCI6MTc4OTg5Mjk1OCwianRpIjoiZmNjZTY5NDMtNjhiNC00NGZhLThjOWEtMDAwODYwOWFhMGZmIn0=.MOBdta5Czxj2etoRSLLj5eEEDWQ2K5cU5rOYksPl8Q9EgxIjp101kg2Q6MvqW9kSV26GSILNR57Ssw-BwiiWM8JdspJraQSPMbfB0w0V1GBnk3Zxb6XWOPTdoqxbuYwi6Gee7KeQKDMStJ3t0NODU8MfW9Z-IRo6z2Xwcnq4DEemxyXzvD-mjCTDr8Uj8Owq3TsXOy__GNqJSQD9p8z5MEwxlHhYiKn_je6RFyKFY8LSmfSSVHaupg8XeWETvHVpdjKwx-5r0Uir56mQTIgfbHtXsNtJwYDKTnC2bW6Uw3Tcu9eYpz8mtyKtMA4QGCffBv_P4bNjYoHuOVMYI9ZwOA=='

const MF_BASE = 'https://public-api.meteofrance.fr/public/aromepi/1.0/wms/MF-NWP-HIGHRES-AROMEPI-001-FRANCE-WMS'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    const incoming = new URL(request.url)
    const params = incoming.searchParams
    params.delete('apikey')
    params.set('apikey', MF_KEY)

    const mfUrl = MF_BASE + '?' + params.toString()

    try {
      const resp = await fetch(mfUrl)
      const headers = new Headers(CORS)
      const ct = resp.headers.get('content-type')
      if (ct) headers.set('Content-Type', ct)
      if (ct?.startsWith('image/')) {
        headers.set('Cache-Control', 'public, max-age=300')
      }
      return new Response(resp.body, { status: resp.status, headers })
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 502,
        headers: { ...CORS, 'Content-Type': 'application/json' }
      })
    }
  }
}

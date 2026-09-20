// Worker Cloudflare — arome-proxy v2
// Proxy CORS pour l'API WMS AROME Prévision Immédiate de Météo-France

const MF_KEY = 'eyJ4NXQiOiJZV0kxTTJZNE1qWTNOemsyTkRZeU5XTTRPV014TXpjek1UVmhNbU14T1RSa09ETXlOVEE0Tnc9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJWaW5jZW50Qm91bmVzMzFAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJWaW5jZW50Qm91bmVzMzEiLCJ0aWVyUXVvdGFUeXBlIjpudWxsLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6IkRlZmF1bHRBcHBsaWNhdGlvbiIsImlkIjo0ODEzMywidXVpZCI6Ijg4MjJkZTAwLWYwODQtNDE5MC1iMWY4LTI2NmU5NjkzYjEzYiJ9LCJpc3MiOiJodHRwczpcL1wvcG9ydGFpbC1hcGkubWV0ZW9mcmFuY2UuZnI6NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsiNTBQZXJNaW4iOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6InNlYyJ9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJBUk9NRS1QSSIsImNvbnRleHQiOiJcL3B1YmxpY1wvYXJvbWVwaVwvMS4wIiwicHVibGlzaGVyIjoiYWRtaW5fbWYiLCJ2ZXJzaW9uIjoiMS4wIiwic3Vic2NyaXB0aW9uVGllciI6IjUwUGVyTWluIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRvbm5lZXNQdWJsaXF1ZXNNZXRlb0ZvcmV0cyIsImNvbnRleHQiOiJcL3B1YmxpY1wvRFBNZXRlb0ZvcmV0c1wvdjEiLCJwdWJsaXNoZXIiOiJtdXJpZWwuYXViaW4iLCJ2ZXJzaW9uIjoidjEiLCJzdWJzY3JpcHRpb25UaWVyIjoiNTBQZXJNaW4ifV0sImV4cCI6MTg4NDU2MDE0MSwidG9rZW5fdHlwZSI6ImFwaUtleSIsImlhdCI6MTc4OTg4NzM0MSwianRpIjoiMjAyNTgxZjAtMDNmZS00MWE3LWEzZjUtNzRiZDdjZDVmZWQyIn0=.Qq6vjKucXRvhrIlbGv9-9b1JmkTx-2_9PaPS5rJuk7TM8Y4nmU76BW5Bqn0D9eeS4zdYgID2WXGtZL0iB6-Pw6ObkgxQ-Hr6lW7in7lnFEuA4AllmZGyKTFAnTkN4BZdtUXRbPy1pGE0d77v_vGrqoH7b4zveblTY4TAPjJeU0loN0iPWfl_e0SUv64c_iHKM1lXLpERw1Eu-eAypgYQXRvEyffvtOxecEx6AWIbQFCN40e_yGP16C2joYvb3BsHz-0WAePt0D5pL3x0L7SBKiBlZOwBsASDnxT32_mJMoM0k0BR2woX5aOR66RLWYCW2UiOS58hAj1RAZxUxzuJBQ=='

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

    // Récupérer les paramètres de la requête entrante
    const incoming = new URL(request.url)
    const params = incoming.searchParams

    // Ajouter la clé MF (supprimer d'abord si déjà présente pour éviter le doublon)
    params.delete('apikey')
    params.set('apikey', MF_KEY)

    // Construire l'URL Météo-France
    const mfUrl = `${MF_BASE}?${params.toString()}`

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

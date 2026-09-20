# arome-proxy

Worker Cloudflare — proxy CORS pour l'API WMS AROME Prévision Immédiate de Météo-France.

Utilisé par VIGIE pour afficher les précipitations futures H+0 à H+6 sur la carte.

## Structure
```
arome-proxy/
├── src/
│   └── index.js   ← code du Worker
├── wrangler.toml  ← config Cloudflare
└── README.md
```

## Pour modifier la clé MF_KEY
Éditer `src/index.js` ligne 5, commiter → Cloudflare redéploie automatiquement.

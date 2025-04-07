<h1 align="center"><a href="https://api-platform.com"><img src="https://api-platform.com/images/logos/Logo_Circle%20webby%20text%20blue.png" alt="API Platform" width="250" height="250"></a></h1>

# Voting system

## Getting started
```bash
# Run backend
make up

# Run frontend dev stack
cd api && yarn && yarn dev
```

## Persistence

### File upload
Files are being saved into disk, location `api/public/media`.

### Jwt
Lexik jwt bundle requires persistent jwt certificates, location `api/config/jwt`.
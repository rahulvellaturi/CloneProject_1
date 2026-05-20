# Free infrastructure setup — go live with $0/month

This guide uses **only free tiers** suitable for a real demo/MVP deployment.

## Architecture overview

| Layer | Free choice | Purpose |
|-------|-------------|---------|
| **Database** | [Neon](https://neon.tech) PostgreSQL | Managed Postgres (512 MB free) |
| **Backend API** | [Render](https://render.com) Web Service (Docker) | Spring Boot on free tier |
| **Frontend** | Render Static Site **or** same Docker/nginx | React build |
| **Containers** | Docker + Docker Compose | Local & CI builds |
| **Registry** | GitHub Container Registry (GHCR) | Free for public images |
| **CI/CD** | GitHub Actions | Free for public repos |
| **CI/CD (optional)** | Jenkins (self-hosted Docker) | `infra/jenkins/docker-compose.yml` |
| **Kubernetes (local)** | minikube / kind | Practice & staging |
| **Kubernetes (cloud)** | Oracle Cloud Always Free VM + k3s | Optional advanced path |

---

## Phase 1 — Run everything locally (Docker)

**Requirements:** Docker Desktop (free for personal use)

```bash
# From repo root
cp .env.example .env
# Edit JWT_SECRET in .env (32+ characters)

docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Health | http://localhost:8080/actuator/health |
| Postgres | localhost:5432 |

---

## Phase 2 — Free PostgreSQL (Neon)

1. Sign up at https://neon.tech (free, no credit card for starter).
2. Create project → database `facebook_clone`.
3. Copy the **connection string** (with `?sslmode=require`).
4. Map to Spring env vars:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
```

---

## Phase 3 — Free cloud deploy (Render)

### Backend (Docker web service)

1. https://dashboard.render.com → **New** → **Web Service** → connect GitHub repo.
2. **Root directory:** leave default; set **Dockerfile path:** `backend/Dockerfile`.
3. **Plan:** Free.
4. **Environment variables:**

| Key | Value |
|-----|--------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `SPRING_DATASOURCE_URL` | Neon JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Neon user |
| `SPRING_DATASOURCE_PASSWORD` | Neon password |
| `JWT_SECRET` | Random 32+ char string |
| `APP_ALLOWED_ORIGINS` | Your frontend URL (e.g. `https://facebook-clone-web.onrender.com`) |

5. Deploy. Note API URL: `https://facebook-clone-api.onrender.com`

Or use the blueprint: **New** → **Blueprint** → select `render.yaml` in repo.

### Frontend (static site — recommended free option)

1. **New** → **Static Site** → same repo.
2. **Build command:** `cd frontend && npm ci && npm run build`
3. **Publish directory:** `frontend/build`
4. **Environment variable:**

```
REACT_APP_API_URL=https://facebook-clone-api.onrender.com/api
```

5. Add rewrite rule: `/*` → `/index.html` (SPA routing).

**Note:** Render free web services spin down after inactivity (~50s cold start).

### Alternatives (also free tier)

- **Fly.io** — Docker deploy, small free allowance
- **Railway** — $5/month credit (not forever free)
- **Vercel/Netlify** — frontend only; point `REACT_APP_API_URL` to Render API

---

## Phase 4 — CI/CD (GitHub Actions)

Workflows in `.github/workflows/`:

- **`ci.yml`** — Maven tests, npm build/test, Docker push to GHCR on `main`
- **`deploy-render.yml`** — optional Render deploy hook (set `RENDER_DEPLOY_HOOK_URL` secret)

Enable: push to `main` → images published to `ghcr.io/<your-user>/facebook-clone-backend`.

---

## Phase 5 — Jenkins (optional, free self-hosted)

```bash
docker compose -f infra/jenkins/docker-compose.yml up -d
```

1. Open http://localhost:8081
2. Get initial admin password: `docker logs facebook-clone-jenkins`
3. Install suggested plugins → create pipeline job → **Pipeline script from SCM** → point to `Jenkinsfile`

Jenkins uses the host Docker socket to run `docker compose build` in the pipeline.

---

## Phase 6 — Kubernetes

### Local (minikube — free)

```bash
minikube start
kubectl apply -f k8s/namespace.yaml
cp k8s/secrets.example.yaml k8s/secrets.yaml   # edit with Neon credentials
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
# Update image names in backend-deployment.yaml / frontend-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
minikube addons enable ingress
kubectl apply -f k8s/ingress.yaml
echo "$(minikube ip) facebook-clone.local" | sudo tee -a /etc/hosts
```

### Production K8s on free cloud (advanced)

- **Oracle Cloud Always Free** — 4 OCPU ARM VM → install k3s → apply `k8s/` manifests
- Use **Neon** for DB (do not run Postgres in cluster for production on free tier)

---

## Environment checklist (production)

- [ ] Strong `JWT_SECRET` (32+ characters)
- [ ] Neon Postgres with SSL
- [ ] `APP_ALLOWED_ORIGINS` = exact frontend origin(s)
- [ ] `REACT_APP_API_URL` = public API `/api` URL
- [ ] Firebase keys in Render/Vercel env (if using Firebase)
- [ ] Never commit `.env` or `k8s/secrets.yaml`

---

## Next steps (product)

After infra is live:

1. Define business problem & target users
2. Prioritize pages/features (MVP vs full Facebook parity)
3. Wire Firebase Auth (optional) to replace or complement JWT
4. Add monitoring (free: UptimeRobot + Render metrics)

See `SETUP.md` for developer setup and `ARCHITECTURE.md` for code structure.

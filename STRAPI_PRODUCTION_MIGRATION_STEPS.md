# Strapi v4 to v5 Production Migration Steps

This document outlines the step-by-step procedure for safely migrating the `strapi-backend` from v4.26.1 to v5.x in the production environment.

## 1. Stabilize Database with v4.26.1 (Intermediate Baseline)
First, ensure the v4 backend boots successfully so the automatic migrations up to v4.26.1 (including the manual script for `folder_path`) are fully executed against your production database.

```bash
# Ensure docker-compose.yaml is still pointing to ./strapi-backend
docker-compose build strapi
docker-compose up -d strapi

# Monitor the logs to ensure it boots without errors
docker-compose logs -f strapi
```
*Wait until you see the "Project is running" log message.*

## 2. Create a Pre-v5 Database Backup
Before initiating the irreversible v5 data migration, create a full SQL dump of your PostgreSQL database. 

```bash
# Run this from your host or database container (adjust credentials & host based on your production env)
pg_dump -U postgres -h <DATABASE_HOST> -d <DATABASE_NAME> > strapi_v4_backup.sql
```

## 3. Switch to Strapi v5 Dockerfile
Update your `docker-compose.yaml` to build the v5 codebase instead of v4. 

Locate the `strapi` service in `docker-compose.yaml` and change the `build` path:
```yaml
  strapi:
    restart: always
    environment:
      # ...
    build: ./strapi-backend-v5 # <-- CHANGE THIS from ./strapi-backend
    image: strapi:1.0.0
```

## 4. Execute Major Migration (v5 Boot)
Rebuild the container using the v5 Dockerfile. When Strapi v5 starts for the first time, it will automatically detect the v4 database and run the irreversible v5 data migration scripts.

```bash
# Build the new v5 image (using --no-cache to ensure a clean build)
docker-compose build --no-cache strapi

# Start the new v5 container
docker-compose up -d strapi

# Watch the logs closely for the major data migration progress
docker-compose logs -f strapi
```

## 5. Verification Checklist
Once the v5 container is running, verify the following in production:
- [ ] **Media Library:** Displays all files correctly (verifies the `folder_path` patch).
- [ ] **GraphQL API:** Correctly handles network-token validation (`src/index.ts`).
- [ ] **Lifecycles:** Automated image resizing in `NW-2-Party` triggers properly via the Document Service.
- [ ] **Admin Panel:** Check if all i18n content migrated successfully to the new core format.

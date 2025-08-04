#!/bin/bash

# Exit on errors
set -e

# Export variables from .env into the environment
set -a
source .env
set +a

# Build and push the Docker image for amd64 platform
docker buildx build \
  --platform linux/amd64 \
  -t $GCR_IO_LINK \
  --push .

# Deploy the image to Google Cloud Run
gcloud run deploy $PAGE_NAME \
  --image $GCR_IO_LINK \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated

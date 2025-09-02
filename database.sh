#!/bin/bash

set -e  # Exit on error

echo "📌 Pushing Prisma schema to database..."
npx prisma db push

echo "⚡ Generating Prisma Client..."
npx prisma generate

echo "✅ Database synced & Prisma Client generated successfully!"

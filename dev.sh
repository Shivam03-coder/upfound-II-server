#!/bin/bash

set -e

read -p "Do you want to push the Prisma schema to the database? (y/n): " push_db

if [[ "$push_db" == "y" || "$push_db" == "Y" ]]; then
  echo "📌 Pushing Prisma schema to database..."
  npx prisma db push
fi

read -p "Do you want to preview the Prisma database in Studio? (y/n): " preview

if [[ "$preview" == "y" || "$preview" == "Y" ]]; then
  echo "🔍 Opening Prisma Studio..."
  npx prisma studio &
fi

echo "🚀 Starting development server..."
pnpm dev

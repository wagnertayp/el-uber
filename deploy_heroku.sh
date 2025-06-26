#!/bin/bash

echo "🚀 Preparando deploy para Heroku..."

# Copy the correct requirements for Heroku
cp requirements_heroku.txt requirements.txt

echo "✅ Requirements atualizados para Heroku"

# Show what we're deploying
echo "📋 Principais correções:"
echo "  - Removido connect_timeout inválido"
echo "  - Configurado Procfile para Python direto"
echo "  - Gunicorn incluído nos requirements"
echo "  - PORT do Heroku configurado"

# Add all changes
git add .

# Commit changes
git commit -m "Fix Heroku deployment - database config and gunicorn fix"

echo "✅ Alterações commitadas"

# Push to heroku
git push heroku main

echo "🎉 Deploy concluído!"
echo "Aguarde alguns segundos e acesse: https://uber-0f683ccf97b7.herokuapp.com"
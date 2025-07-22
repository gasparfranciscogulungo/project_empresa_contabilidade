# EMJ Consultoria - Build Instructions

## Otimização para Produção

### 1. Minificação de CSS
```bash
# Instalar ferramenta de minificação
npm install -g clean-css-cli

# Minificar arquivos CSS
cleancss -o css/style.min.css css/style.css
cleancss -o css/cookies.min.css css/cookies.css
cleancss -o css/publicidade.min.css css/publicidade.css
```

### 2. Minificação de JavaScript
```bash
# Instalar ferramenta de minificação
npm install -g terser

# Minificar arquivos JavaScript
terser js/script.js -o js/script.min.js -c -m
terser js/cookies.js -o js/cookies.min.js -c -m
terser js/publicidade.js -o js/publicidade.min.js -c -m
```

### 3. Otimização de Imagens
- Use ferramentas como TinyPNG ou ImageOptim
- Converta imagens para formatos modernos (WebP, AVIF)
- Implemente lazy loading (já implementado)

### 4. Performance Checklist
- [x] Lazy loading de imagens
- [x] CSS otimizado com variáveis
- [x] JavaScript modular
- [x] Preload de recursos críticos
- [x] Fonte moderna (system fonts)
- [x] Transições otimizadas
- [x] PWA Manifest
- [ ] Service Worker
- [ ] Critical CSS inline
- [ ] CDN para recursos estáticos

### 5. Configuração do Servidor
```apache
# .htaccess para Apache
# Compressão GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache Headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/x-javascript "access plus 1 month"
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

### 6. SEO Checklist
- [x] Meta tags completas
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Estrutura semântica HTML5
- [x] Alt text para imagens
- [x] Heading hierarchy (h1-h6)
- [ ] Schema.org markup
- [ ] Sitemap.xml
- [ ] robots.txt

### 7. Acessibilidade Checklist
- [x] Navegação por teclado
- [x] Focus indicators
- [x] ARIA labels
- [x] Contraste de cores adequado
- [x] Texto alternativo para imagens
- [x] Estrutura semântica
- [x] Skip links (implementar se necessário)

### 8. Testes
- Teste em diferentes navegadores
- Teste de responsividade
- Teste de performance (Lighthouse)
- Teste de acessibilidade (WAVE, axe)
- Teste de SEO (Google Search Console)

### 9. Deploy
1. Minificar todos os recursos
2. Atualizar caminhos para versões minificadas
3. Configurar headers do servidor
4. Testar todas as funcionalidades
5. Configurar monitoramento

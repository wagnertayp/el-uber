/**
 * Mobile-Only Protection System
 * Impede acesso desktop e redireciona para about:blank
 */
(function() {
    'use strict';
    
    // Detecção abrangente de dispositivos móveis
    function isMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'windows phone', 'opera mini', 'silk', 'kindle'
        ];
        
        const hasMobileKeyword = mobileKeywords.some(keyword => 
            userAgent.includes(keyword)
        );
        
        // Verifica tamanho da tela (mobile geralmente < 768px)
        const hasSmallScreen = window.screen.width <= 768 || window.innerWidth <= 768;
        
        // Verifica capacidade de toque
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Verifica suporte a orientação (recurso mobile)
        const hasOrientationSupport = typeof window.orientation !== 'undefined';
        
        return hasMobileKeyword || (hasSmallScreen && hasTouchScreen) || hasOrientationSupport;
    }
    
    // Detecta padrões de desktop
    function isDesktopCloner() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        const desktopBrowsers = ['chrome', 'firefox', 'safari', 'edge', 'opera'];
        const mobileExclusions = ['mobile', 'android', 'iphone', 'ipad'];
        
        const hasDesktopBrowser = desktopBrowsers.some(browser => 
            userAgent.includes(browser)
        );
        
        const lacksMobileIndicators = !mobileExclusions.some(mobile => 
            userAgent.includes(mobile)
        );
        
        // Tela grande típica de desktop
        const hasLargeScreen = window.screen.width > 1024 && window.screen.height > 768;
        
        return hasDesktopBrowser && lacksMobileIndicators && hasLargeScreen;
    }
    
    // Detecta ferramentas de scraping
    function isScrapingTool() {
        const userAgent = navigator.userAgent.toLowerCase();
        const scrapingTools = [
            'wget', 'curl', 'httrack', 'webzip', 'teleport', 
            'offline explorer', 'web copier', 'sitesuck',
            'python', 'java', 'go-http-client', 'node'
        ];
        
        return scrapingTools.some(tool => userAgent.includes(tool));
    }
    
    // Executa proteção imediatamente
    function executeProtection() {
        if (!isMobileDevice() || isDesktopCloner() || isScrapingTool()) {
            // Limpa todo o conteúdo imediatamente
            document.documentElement.innerHTML = '';
            document.body.innerHTML = '';
            
            // Limpa título e metadados da página
            document.title = '';
            
            // Remove todas as folhas de estilo
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
            stylesheets.forEach(sheet => sheet.remove());
            
            // Bloqueia execução de scripts
            window.stop && window.stop();
            
            // Redireciona para about:blank após breve delay
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 100);
            
            return false;
        }
        return true;
    }
    
    // Executa proteção imediatamente quando script carrega
    if (!executeProtection()) {
        return;
    }
    
    // Monitora redimensionamento de janela
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isMobileDevice() || isDesktopCloner()) {
                executeProtection();
            }
        }, 100);
    });
    
    // Monitora abertura de ferramentas de desenvolvedor
    let devToolsOpen = false;
    const devToolsChecker = setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || 
            window.outerWidth - window.innerWidth > 200) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                executeProtection();
            }
        } else {
            devToolsOpen = false;
        }
    }, 1000);
    
    // Bloqueia menu de contexto (previne inspecionar elemento)
    document.addEventListener('contextmenu', function(e) {
        if (!isMobileDevice()) {
            e.preventDefault();
            executeProtection();
            return false;
        }
    });
    
    // Bloqueia atalhos de desenvolvedor
    document.addEventListener('keydown', function(e) {
        // Bloqueia F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            executeProtection();
            return false;
        }
    });
    
    // Proteção adicional contra embedding em iframe
    if (window.top !== window.self) {
        executeProtection();
    }
    
})();
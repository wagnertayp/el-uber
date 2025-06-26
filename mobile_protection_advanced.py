"""
Advanced mobile-only protection system
Prevents desktop access and redirects to about:blank
"""
from flask import request, Response
from functools import wraps
import re
import random

def is_mobile_device(user_agent):
    """Detecta se a requisição vem de um dispositivo móvel"""
    if not user_agent:
        return False
    
    user_agent = user_agent.lower()
    mobile_keywords = [
        'mobile', 'android', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'opera mini', 
        'silk', 'kindle', 'webos', 'palm'
    ]
    
    return any(keyword in user_agent for keyword in mobile_keywords)

def is_desktop_browser(user_agent):
    """Detecta navegadores desktop sem indicadores mobile"""
    if not user_agent:
        return True
    
    user_agent = user_agent.lower()
    
    desktop_patterns = [
        r'windows nt.*chrome',
        r'macintosh.*chrome',
        r'x11.*linux.*chrome',
        r'windows nt.*firefox',
        r'macintosh.*firefox',
        r'windows nt.*edge',
        r'macintosh.*safari(?!.*mobile)',
    ]
    
    mobile_exclusions = ['mobile', 'android', 'iphone', 'ipad']
    
    has_desktop_pattern = any(re.search(pattern, user_agent) for pattern in desktop_patterns)
    has_mobile_indicator = any(mobile in user_agent for mobile in mobile_exclusions)
    
    return has_desktop_pattern and not has_mobile_indicator

def is_scraping_tool(user_agent):
    """Detecta ferramentas de scraping e bots"""
    if not user_agent:
        return True
    
    user_agent = user_agent.lower()
    scraping_tools = [
        'wget', 'curl', 'httrack', 'webzip', 'teleport', 
        'offline explorer', 'web copier', 'sitesuck',
        'python', 'java', 'go-http-client', 'node',
        'bot', 'spider', 'crawler', 'scraper'
    ]
    
    return any(tool in user_agent for tool in scraping_tools)

def advanced_mobile_only(f):
    """Decorator avançado para proteger rotas contra acesso desktop"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Desabilita proteção móvel no ambiente Replit para preview
        import os
        if os.environ.get('REPLIT_DEPLOYMENT_TYPE') or os.environ.get('REPL_SLUG'):
            return f(*args, **kwargs)
        
        user_agent = request.headers.get('User-Agent', '')
        
        # Verifica se é desktop, ferramenta de scraping ou não-mobile
        if (is_desktop_browser(user_agent) and not is_mobile_device(user_agent)) or is_scraping_tool(user_agent):
            # Respostas variadas para confundir scrapers
            responses = [
                Response('', status=404),
                Response('', status=503),
                Response('Access denied', status=403),
                Response('''
                <!DOCTYPE html>
                <html>
                <head><title></title></head>
                <body>
                    <script>
                        document.documentElement.innerHTML = '';
                        document.body.innerHTML = '';
                        document.title = '';
                        setTimeout(() => {
                            window.location.href = 'about:blank';
                        }, 100);
                    </script>
                </body>
                </html>
                ''', mimetype='text/html'),
                Response('', status=200, headers={'Content-Type': 'text/html'})
            ]
            return random.choice(responses)
        
        return f(*args, **kwargs)
    
    return decorated_function
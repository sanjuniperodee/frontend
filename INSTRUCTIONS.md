## Карта Меток - Полная инструкция по установке и развертыванию

### 1. Требования к системе

- Node.js 18+
- npm 8+
- Git
- Redis (опционально, для кэширования)
- Nginx (для продакшена)
- SSL сертификат (для продакшена)

### 2. Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/interactive-map-system.git
cd interactive-map-system
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполните `.env` файл:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:5173
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SEGMENT_WRITE_KEY=your-segment-write-key
VITE_GA_TRACKING_ID=your-ga-tracking-id
VITE_MAP_API_KEY=your-map-api-key
```

5. Запустите проект в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### 3. Тестирование

1. Запуск unit-тестов:
```bash
npm run test
```

2. Запуск e2e тестов:
```bash
npm run test:e2e
```

3. Запуск нагрузочного тестирования:
```bash
npm run test:load
```

### 4. Сборка для продакшена

1. Создайте файл `.env.production`:
```env
VITE_API_URL=https://api.your-domain.com
VITE_SOCKET_URL=wss://api.your-domain.com
VITE_SENTRY_DSN=your-sentry-dsn
VITE_SEGMENT_WRITE_KEY=your-segment-write-key
VITE_GA_TRACKING_ID=your-ga-tracking-id
VITE_MAP_API_KEY=your-map-api-key
```

2. Соберите проект:
```bash
npm run build
```

3. Протестируйте сборку локально:
```bash
npm run preview
```

### 5. Развертывание

#### Вариант 1: Netlify

1. Установите Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Войдите в аккаунт:
```bash
netlify login
```

3. Инициализируйте проект:
```bash
netlify init
```

4. Настройте переменные окружения в панели управления Netlify.

5. Деплой:
```bash
netlify deploy --prod
```

#### Вариант 2: VPS/Dedicated Server

1. Подготовка сервера:
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y nginx certbot python3-certbot-nginx

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PM2
npm install -g pm2
```

2. Настройка Nginx:
```bash
sudo nano /etc/nginx/sites-available/map-app
```

Добавьте конфигурацию:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/map-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. Настройка SSL:
```bash
sudo certbot --nginx -d your-domain.com
```

5. Клонирование и настройка проекта:
```bash
cd /var/www
git clone https://github.com/your-username/interactive-map-system.git
cd interactive-map-system
npm install
npm run build
```

6. Настройка PM2:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 6. Мониторинг и обслуживание

1. Настройка логирования PM2:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. Мониторинг логов:
```bash
# PM2 логи
pm2 logs

# Nginx логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

3. Обновление приложения:
```bash
cd /var/www/interactive-map-system
git pull
npm install
npm run build
pm2 restart all
```

### 7. Безопасность

1. Настройка файрвола:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

2. Настройка fail2ban:
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 8. Резервное копирование

1. Создайте скрипт для бэкапа:
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d)
tar -czf $BACKUP_DIR/map-app-$DATE.tar.gz /var/www/interactive-map-system
find $BACKUP_DIR -type f -mtime +7 -delete
```

2. Добавьте в crontab:
```bash
0 0 * * * /path/to/backup-script.sh
```

### 9. Масштабирование

1. Настройка балансировщика нагрузки:
```nginx
upstream map_app {
    server localhost:5173;
    server localhost:5174;
    server localhost:5175;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://map_app;
    }
}
```

2. Запуск нескольких инстансов:
```bash
pm2 start ecosystem.config.js -i max
```

### 10. Устранение неполадок

1. Проверка статуса сервисов:
```bash
systemctl status nginx
pm2 status
```

2. Проверка логов:
```bash
pm2 logs map-app
tail -f /var/log/nginx/error.log
```

3. Перезапуск сервисов:
```bash
sudo systemctl restart nginx
pm2 restart all
```

### 11. Дополнительные команды

1. Анализ производительности:
```bash
npm run analyze
```

2. Проверка типов:
```bash
npm run typecheck
```

3. Форматирование кода:
```bash
npm run format
```

### 12. Docker

1. Сборка образа:
```bash
docker build -t map-app .
```

2. Запуск контейнера:
```bash
docker-compose up -d
```

3. Просмотр логов:
```bash
docker-compose logs -f
```

### 13. CI/CD

GitHub Actions автоматически:
1. Запускает тесты при каждом пуше
2. Проверяет типы и линтинг
3. Собирает проект
4. Деплоит на Netlify при пуше в main

### Полезные ссылки

- [Документация API](./src/docs/api.md)
- [Руководство по разработке](./CONTRIBUTING.md)
- [Список изменений](./CHANGELOG.md)
- [Лицензия](./LICENSE)
## Карта Меток - Интерактивная карта с метками интересных мест

### Требования

- Node.js 18+ 
- npm 8+
- MongoDB 5+ (для продакшена)
- Redis (опционально, для кэширования)

### Локальная разработка

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

4. Заполните переменные окружения в `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:5173
VITE_SECRET_KEY=your-secret-key
VITE_MAP_API_KEY=your-map-api-key
VITE_ANALYTICS_ID=your-analytics-id
```

5. Запустите проект в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Сборка для продакшена

1. Соберите проект:
```bash
npm run build
```

2. Протестируйте сборку локально:
```bash
npm run preview
```

### Развертывание на сервере

#### Вариант 1: Статический хостинг (Netlify, Vercel, etc.)

1. Создайте файл `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Настройте переменные окружения в панели управления хостинга.

3. Подключите репозиторий к хостингу для автоматического деплоя.

#### Вариант 2: VPS/Dedicated Server

1. Установите Node.js и npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Установите PM2 для управления процессами:
```bash
npm install -g pm2
```

3. Настройте Nginx:
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

4. Настройте SSL с помощью Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

5. Запустите приложение через PM2:
```bash
pm2 start server.js --name "map-app"
pm2 save
pm2 startup
```

### Структура проекта

```
├── public/             # Статические файлы
├── src/
│   ├── components/    # React компоненты
│   ├── hooks/        # Пользовательские хуки
│   ├── store/        # Zustand сторы
│   ├── types/        # TypeScript типы
│   ├── utils/        # Утилиты
│   ├── App.tsx       # Главный компонент
│   └── main.tsx      # Точка входа
├── .env.example      # Пример переменных окружения
├── index.html        # HTML шаблон
├── package.json      # Зависимости и скрипты
├── server.js         # Express сервер
├── tsconfig.json     # Конфигурация TypeScript
└── vite.config.ts    # Конфигурация Vite
```

### Основные команды

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка проекта
- `npm run preview` - Предпросмотр сборки
- `npm run lint` - Проверка кода
- `npm run test` - Запуск тестов

### Мониторинг и логирование

1. Настройте PM2 мониторинг:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

2. Настройте Nginx логирование:
```nginx
access_log /var/log/nginx/map-app-access.log;
error_log /var/log/nginx/map-app-error.log;
```

### Бэкапы

1. Настройте ежедневное резервное копирование:
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d)
tar -czf $BACKUP_DIR/map-app-$DATE.tar.gz /path/to/app
find $BACKUP_DIR -type f -mtime +7 -delete
```

2. Добавьте скрипт в crontab:
```bash
0 0 * * * /path/to/backup-script.sh
```

### Безопасность

1. Настройте файрвол:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

2. Настройте fail2ban:
```bash
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Масштабирование

Для горизонтального масштабирования:

1. Настройте балансировщик нагрузки (например, HAProxy)
2. Запустите несколько инстансов приложения на разных портах
3. Используйте Redis для синхронизации состояния между инстансами

### Мониторинг производительности

1. Установите и настройте Prometheus:
```bash
wget https://github.com/prometheus/prometheus/releases/download/v2.x.x/prometheus-2.x.x.linux-amd64.tar.gz
tar xvf prometheus-*.tar.gz
cd prometheus-*
./prometheus
```

2. Установите и настройте Grafana:
```bash
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
sudo apt-get update
sudo apt-get install grafana
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

### Поддержка

При возникновении проблем:

1. Проверьте логи:
```bash
pm2 logs map-app
tail -f /var/log/nginx/map-app-error.log
```

2. Проверьте статус сервисов:
```bash
systemctl status nginx
pm2 status
```

3. Перезапустите сервисы при необходимости:
```bash
pm2 restart map-app
sudo systemctl restart nginx
```
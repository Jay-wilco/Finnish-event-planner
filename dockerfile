FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip curl libpq-dev libzip-dev zip \
    nodejs npm \
    && docker-php-ext-install pdo pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm ci
RUN npm run build

# Clear caches at build-time (safe)
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Render provides $PORT
CMD ["sh", "-c", "php artisan migrate --force && php -S 0.0.0.0:$PORT -t public"]


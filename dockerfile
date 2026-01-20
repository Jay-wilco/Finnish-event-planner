# ---------- Base image ----------
FROM php:8.3-cli

# ---------- System dependencies ----------
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libpq-dev \
    libzip-dev \
    zip \
    nodejs \
    npm \
    && docker-php-ext-install pdo pdo_pgsql zip

# ---------- Composer ----------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ---------- App directory ----------
WORKDIR /app

# ---------- Copy files ----------
COPY . .

# ---------- Install PHP dependencies ----------
RUN composer install --no-dev --optimize-autoloader

# ---------- Install JS dependencies & build assets ----------
RUN npm ci
RUN npm run build

# ---------- Laravel optimizations ----------
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# ---------- Expose port ----------
EXPOSE 10000

# ---------- Start Laravel ----------
CMD php -S 0.0.0.0:10000 -t public

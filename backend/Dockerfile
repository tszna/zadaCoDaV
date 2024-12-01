FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    unzip

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

COPY . .

CMD ["bash", "-c", "composer install && php-fpm"]

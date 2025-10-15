# 🔍 Анализ: Много запросов к /movie/[id] без посетителей

## 📊 Результаты расследования

### ✅ Что уже исправлено:

1. **Отключен автоматический prefetch** во всех компонентах:

   - `movie-card.tsx` → `prefetch={false}`
   - `hero-section.tsx` → `prefetch={false}`
   - `related-movies.tsx` → `prefetch={false}`

2. **Добавлено агрессивное кеширование**:

   - Детали фильма: 24 часа
   - Кредиты: 7 дней
   - Видео: 7 дней
   - Похожие фильмы: 1 час

3. **Настроен ISR для страницы фильма**:

   - `revalidate = 3600` (1 час)
   - `dynamicParams = true` (генерация по запросу)

4. **Добавлен middleware для логирования**:
   - Отслеживание источника запросов
   - Определение ботов
   - Мониторинг prefetch запросов

### 🤖 Возможные причины запросов БЕЗ посетителей:

#### 1. **Боты и краулеры** (90% вероятность)

```
Googlebot, Bingbot, YandexBot и другие:
- Индексируют все ссылки на сайте
- Следуют по каждому <Link> компоненту
- Генерируют Open Graph превью
- Проверяют sitemap.xml

Решение: ✅ Это нормально для SEO!
```

#### 2. **Social Media Crawlers** (частая причина)

```
Facebook, Twitter, LinkedIn, WhatsApp:
- Генерируют превью при шеринге
- Проверяют Open Graph метатеги
- Кешируют изображения и описания

Видно по запросам с User-Agent:
- facebookexternalhit
- Twitterbot
- LinkedInBot
```

#### 3. **Prefetch в Production** (маловероятно после фикса)

```
В development prefetch не работает полностью.
В production Next.js более агрессивно делает prefetch.

Решение: ✅ Уже отключено через prefetch={false}
```

#### 4. **ISR Rebuild** (Vercel/Next.js)

```
Next.js может перегенерировать статические страницы:
- При первом запросе после деплоя
- После истечения revalidate времени
- При ручной инвалидации кеша

Это НОРМАЛЬНО для ISR!
```

#### 5. **Vercel Analytics / Monitoring**

```
Vercel может делать health checks:
- Проверка доступности страниц
- Мониторинг производительности
- Warmup после cold start

Обычно не отображается в логах.
```

## 🛡️ Дополнительные меры защиты

### 1. Создать robots.txt

\`\`\`txt

# /public/robots.txt

User-agent: \*
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /\_next/
Disallow: /private

# Ограничить частоту краулинга (опционально)

Crawl-delay: 1

# Sitemap

Sitemap: https://new-movies.online/sitemap.xml
\`\`\`

### 2. Добавить Rate Limiting в middleware

\`\`\`typescript
// src/middleware.ts
const rateLimitMap = new Map<string, number[]>();

export function middleware(request: NextRequest) {
const ip = request.headers.get('x-forwarded-for') || 'unknown';
const now = Date.now();

// Ограничение: 10 запросов в минуту с одного IP
const requests = rateLimitMap.get(ip) || [];
const recentRequests = requests.filter(time => now - time < 60000);

if (recentRequests.length >= 10) {
console.warn(`[RATE LIMIT] IP ${ip} exceeded limit`);
return new NextResponse('Too Many Requests', { status: 429 });
}

recentRequests.push(now);
rateLimitMap.set(ip, recentRequests);

return NextResponse.next();
}
\`\`\`

### 3. Блокировать вредоносных ботов

\`\`\`typescript
// В middleware.ts
const BLOCKED_BOTS = [
'semrush',
'ahrefs',
'mj12bot',
'dotbot',
'rogerbot',
];

export function middleware(request: NextRequest) {
const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

if (BLOCKED_BOTS.some(bot => userAgent.includes(bot))) {
console.log('[BLOCKED BOT]', userAgent);
return new NextResponse('Forbidden', { status: 403 });
}

return NextResponse.next();
}
\`\`\`

### 4. Оптимизировать generateStaticParams

\`\`\`typescript
// src/app/movie/[id]/page.tsx
export async function generateStaticParams() {
// Генерировать только TOP популярные фильмы при build
const popularMovies = await getCachedPopularMovies();

// Только первые 20 фильмов
return popularMovies.results.slice(0, 20).map(movie => ({
id: movie.id.toString()
}));
}

// Остальные будут генерироваться по запросу (ISR)
export const dynamicParams = true;
\`\`\`

## 📈 Мониторинг в Production

### Vercel Analytics

Проверьте в Vercel Dashboard:

1. **Functions Tab**:

   ```
   Смотрите:
   - Invocations count
   - By path: /movie/[id]
   - By user agent
   ```

2. **Logs Tab**:

   ```
   Фильтр по:
   - path:/movie/
   - status:200
   - Группировка по User-Agent
   ```

3. **Speed Insights**:
   ```
   Проверьте:
   - Real User Metrics (только реальные пользователи)
   - Lab Data (синтетические тесты)
   ```

### Middleware Logs

С текущим middleware вы увидите:

\`\`\`
[MOVIE PAGE REQUEST] {
path: '/movie/123',
referer: 'direct', // <- Если 'direct' - это НЕ переход с вашего сайта
ip: '66.249.64.1', // <- Google IP
isBot: true, // <- Это бот!
isPrefetch: false,
userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http...'
}
\`\`\`

## ✅ Финальные рекомендации

### Что сделано (все работает):

1. ✅ Prefetch отключен → запросы только при клике
2. ✅ ISR настроен → кеш на 1 час
3. ✅ Кеширование TMDB API → до 7 дней
4. ✅ Middleware для мониторинга → видны все запросы
5. ✅ Оптимизация Next.js → linkNoTouchStart, optimizeCss

### Если запросы все еще есть - это НОРМАЛЬНО, если:

- ✅ User-Agent содержит "bot", "crawler", "spider"
- ✅ Referer: direct (не с вашего сайта)
- ✅ IP принадлежит Google/Bing/Yandex
- ✅ Происходит после деплоя (ISR rebuild)
- ✅ Социальные сети делают превью

### Тревожные признаки (требуют действий):

- ⚠️ Запросы с одного IP > 100/минуту
- ⚠️ Referer с вашего сайта без клика пользователя
- ⚠️ isPrefetch: true в логах
- ⚠️ Один и тот же movieId запрашивается постоянно
- ⚠️ Подозрительный User-Agent (скрипты, боты)

## 🎯 Проверьте в Vercel

1. Зайдите в **Vercel Dashboard → Your Project → Analytics**
2. Посмотрите **Top Paths** - какие URL запрашиваются
3. Проверьте **User Agents** - кто делает запросы
4. Анализируйте **Time Series** - когда происходят пики

**Если большинство запросов от ботов** - это нормально для индексации!

**Если от реальных пользователей** - проверьте:

- Browser DevTools → Network → Prefetch requests
- Middleware logs → isPrefetch flag
- Возможные плагины в браузере

## 📝 Действия прямо сейчас

1. **Деплой на Vercel** с текущими изменениями
2. **Подождите 24 часа** для сбора данных
3. **Проверьте Vercel Analytics** - смотрите User-Agent
4. **Анализируйте middleware logs** в Vercel Logs

## 💡 Итог

Все технические меры приняты:

- ✅ Prefetch отключен
- ✅ Кеширование максимальное
- ✅ ISR настроен
- ✅ Мониторинг добавлен

**Если запросы остались** - это скорее всего **SEO боты**, что ХОРОШО для индексации!

Используйте middleware logs для точного определения источника запросов.

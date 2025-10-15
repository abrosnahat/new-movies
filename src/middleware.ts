import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Логируем только запросы к страницам фильмов
  if (pathname.startsWith('/movie/')) {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || 'direct';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Проверяем, это бот или реальный пользователь
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    const isPrefetch = request.headers.get('purpose') === 'prefetch' || 
                      request.headers.get('x-purpose') === 'prefetch';
    
    console.log('[MOVIE PAGE REQUEST]', {
      path: pathname,
      referer,
      ip,
      isBot,
      isPrefetch,
      userAgent: userAgent.substring(0, 50)
    });
  }
  
  return NextResponse.next();
}

// Применяем middleware только к страницам фильмов
export const config = {
  matcher: '/movie/:id*',
};

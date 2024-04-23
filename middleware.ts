import { NextRequest, NextResponse } from 'next/server'

export const middleware = (request: NextRequest) => {
  // the order of functions is important
  const handlers = [
    handleArticlesRoute(),
    handleArticlesCategoryRoute,
    handleArticlesCategoryWithNoPaginationRoute()
  ];
  return handlers.reduce((prevResponse, handler) => handler(prevResponse, request), NextResponse.next());
};

const handleArticlesRoute = () => (prevResponse: NextResponse, request: NextRequest) => request.nextUrl.pathname === '/articles'
  ? NextResponse.rewrite(new URL(`/${request.nextUrl.locale}/articles/category/all/page/1`, request.url))
  : prevResponse;

const handleArticlesCategoryRoute = (prevReponse: NextResponse, request: NextRequest) => request.nextUrl.pathname === '/articles/category/all'
  // Redirect to the /articles when manually type the /articles/category/all URL
  ? NextResponse.redirect(new URL(`/${request.nextUrl.locale}/articles`, request.url))
  : prevReponse;

const handleArticlesCategoryWithNoPaginationRoute = () => (prevResponse: NextResponse, request: NextRequest) => /^\/articles\/category\/[^/]+$/.test(request.nextUrl.pathname)
  // If there is no pagination, but category provided - add the first page ti URL path
  ? NextResponse.rewrite(new URL(`/${request.nextUrl.locale}/${request.nextUrl.pathname}/page/1`, request.url))
  : prevResponse

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|ce|styles|favicon.png|logo.png|assets|html|robots).*)',
    '/'
  ],
};
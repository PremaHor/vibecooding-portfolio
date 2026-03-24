import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type RouteMatch =
  | { name: 'home' }
  | { name: 'project'; slug: string }
  | { name: 'privacy' }
  | { name: 'notfound' };

function normalizePath(pathname: string): string {
  if (pathname !== '/' && pathname.endsWith('/')) return pathname.slice(0, -1) || '/';
  return pathname || '/';
}

function matchPath(pathname: string): RouteMatch {
  const p = normalizePath(pathname);
  if (p === '/') return { name: 'home' };
  if (p === '/ochrana-soukromi') return { name: 'privacy' };
  const m = /^\/project\/([^/]+)$/.exec(p);
  if (m) return { name: 'project', slug: decodeURIComponent(m[1]) };
  return { name: 'notfound' };
}

type RouterValue = {
  pathname: string;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
  match: RouteMatch;
};

const RouterContext = createContext<RouterValue | null>(null);

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin);
    const path = url.pathname + url.search + url.hash;
    if (opts?.replace) window.history.replaceState(null, '', path);
    else window.history.pushState(null, '', path);
    setPathname(normalizePath(window.location.pathname));
  }, []);

  useEffect(() => {
    const onPop = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const match = useMemo(() => matchPath(pathname), [pathname]);
  const value = useMemo(() => ({ pathname, navigate, match }), [pathname, navigate, match]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useLocation must be used within BrowserRouter');
  return {
    pathname: ctx.pathname,
    key: ctx.pathname,
    search: '',
    hash: '',
    state: null as unknown,
  };
}

export function useParams(): { slug?: string } {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useParams must be used within BrowserRouter');
  if (ctx.match.name === 'project') return { slug: ctx.match.slug };
  return {};
}

export function useRouteMatch(): RouteMatch {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouteMatch must be used within BrowserRouter');
  return ctx.match;
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; replace?: boolean };

export function Link({ to, children, className, onClick, replace, ...rest }: LinkProps) {
  const ctx = useContext(RouterContext);
  return (
    <a
      {...rest}
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (rest.target === '_blank') return;
        e.preventDefault();
        ctx?.navigate(to, { replace: !!replace });
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

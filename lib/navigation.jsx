'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import NextLink from 'next/link';
import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useParams as useNextParams
} from 'next/navigation';

export function Link({ to, href, children, ...props }) {
  const target = to || href || '#';
  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useNextRouter();
  return useCallback(
    (path, options) => {
      if (typeof path === 'number') {
        if (typeof window !== 'undefined' && path === -1) {
          window.history.back();
        }
        return;
      }
      if (options?.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    },
    [router]
  );
}

export function useLocation() {
  const pathname = useNextPathname() || '/';
  const [search, setSearch] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search);
      setHash(window.location.hash);
    }
  }, [pathname]);

  return useMemo(
    () => ({
      pathname,
      search,
      hash
    }),
    [pathname, search, hash]
  );
}

export function useParams() {
  const params = useNextParams();
  return params || {};
}

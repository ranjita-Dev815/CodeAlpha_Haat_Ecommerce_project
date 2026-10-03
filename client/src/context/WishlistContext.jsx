import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [ids, setIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const applyList = (list) => {
    setItems(list);
    setIds(new Set(list.map((p) => p._id)));
  };

  const refresh = useCallback(async () => {
    if (!user) {
      applyList([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/users/wishlist');
      applyList(data);
    } catch {
      // Leave the last known list in place rather than clearing it on a
      // transient network error.
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Re-fetch whenever login state changes (login, logout, or the
  // auth:expired event AuthContext already listens to)
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Stable across renders (depends only on the current id set), so consumers
  // that memoize on it (e.g. ProductCard) don't re-render needlessly and
  // never hold a stale reference after login/logout.
  const isWishlisted = useCallback((productId) => ids.has(productId), [ids]);

  const toggle = useCallback(
    async (productId) => {
      if (!user) return;
      try {
        const { data } = ids.has(productId)
          ? await api.delete(`/users/wishlist/${productId}`)
          : await api.post(`/users/wishlist/${productId}`);
        applyList(data);
      } catch {
        // Swallow for now; the button simply won't flip. A toast/Notice
        // could be wired in here if the app has a global one.
      }
    },
    [user, ids]
  );

  const value = useMemo(
    () => ({ items, loading, isWishlisted, toggle, refresh }),
    [items, loading, isWishlisted, toggle, refresh]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);

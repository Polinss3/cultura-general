import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

// Live count of pending friend requests received by the current user.
// Powers the badge dot on the Amigos tab.
export function usePendingFriendRequests(): { count: number } {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      const { count: c } = await supabase
        .from('friendships')
        .select('id', { count: 'exact', head: true })
        .eq('friend_id', user.id)
        .eq('status', 'pending');
      if (!cancelled) setCount(c ?? 0);
    };

    refresh();

    // Realtime: react to anything that could change my pending count.
    const channel = supabase
      .channel(`pending-friends-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'friendships', filter: `friend_id=eq.${user.id}` },
        () => { refresh(); },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { count };
}

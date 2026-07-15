import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';

export const PWAUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm border border-sprocket bg-frame p-4 shadow-lg sm:right-4 sm:left-auto"
    >
      <p className="edge">New cut available</p>
      <p className="mt-1 text-sm text-foreground">
        A newer version of XMDB is ready. Reload to pick it up.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => void updateServiceWorker(true)}>
          Reload
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setNeedRefresh(false)}>
          Later
        </Button>
      </div>
    </div>
  );
};

import { useAppHotkeyList, useFormatForDisplay } from '@tanstack/react-hotkeys';

/** List of all app hotkeys with platform-correct display labels, for cheat sheets/settings. */
export function CheatSheet() {
  const items = useAppHotkeyList();
  const formatForDisplay = useFormatForDisplay();

  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const hk = item.appHotkey.hotkey;
        const statusColor = {
          active: 'text-emerald-400',
          suspended: 'text-muted-foreground',
          disabled: 'text-red-400',
          inactive: 'text-muted-foreground',
          unbound: 'text-muted-foreground',
        }[item.status];
        return (
          <li key={item.appHotkey.id} className="flex items-center justify-between gap-3">
            <span className="text-foreground">{item.appHotkey.meta?.name ?? item.appHotkey.id}</span>
            <span className={`font-mono text-xs ${statusColor}`}>
              {hk ? formatForDisplay(hk) : 'Unbound'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

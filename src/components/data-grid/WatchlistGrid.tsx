import { Link } from '@tanstack/react-router';
import {
  columnFilteringFeature,
  createColumnHelper,
  createCoreRowModel,
  createSortedRowModel,
  createFilteredRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type TableFeatures,
} from '@tanstack/react-table';
import { useLibrary, type WatchlistInput } from '@/hooks/use-library';
import { cn } from '@/lib/utils';

/** Stable grid feature object — only the feature plugins this grid needs. */
export const features = tableFeatures({
  columnFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  coreRowModel: createCoreRowModel(),
});

type WatchlistRow = WatchlistInput & { _index: number; addedAt: number };

const columnHelper = createColumnHelper<TableFeatures, WatchlistRow>();

const columns = columnHelper.columns([
  columnHelper.accessor('_index', {
    header: '#',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => {
      const row = info.row.original as WatchlistRow;
      const to = row.mediaType === 'movie' ? '/movie/$movieId' : '/tv/$tvId';
      return (
        <Link
          to={to as never}
          params={{ [row.mediaType === 'movie' ? 'movieId' : 'tvId']: String(row.id) } as never}
          className="text-cyan-400 hover:underline"
        >
          {row.title}
        </Link>
      );
    },
  }),
  columnHelper.accessor('mediaType', {
    header: 'Type',
    cell: (info) => (info.getValue() === 'movie' ? 'Movie' : 'TV Series'),
  }),
  columnHelper.accessor('addedAt', {
    header: 'Added',
    cell: (info) => {
      const date = new Date(info.getValue() as number).toLocaleDateString();
      return <span className="text-xs text-muted-foreground">{date}</span>;
    },
  }),
]);

/**
 * Headless TanStack Table V9 grid for the watchlist.
 * State lives in TanStack Table; URL sync for sort/filter owned externally where needed.
 */
export function WatchlistGrid() {
  const { watchlist, toggleWatchlist, isInWatchlist } = useLibrary();

  const rows: WatchlistRow[] = watchlist.map((item, i) => ({ ...item, _index: i + 1 }));

  const table = useTable({
    features,
    columns,
    data: rows,
    initialState: {
      sorting: [{ id: '_index', desc: false }],
      columnFilters: [],
    },
  }) as unknown as {
    getHeaderGroups: () => Array<{
      id: string;
      headers: Array<{
        id: string;
        column: {
          columnDef: { enableSorting?: boolean; header: string | ((props: any) => any) };
          toggleSorting: () => void;
          getIsSorted: () => 'asc' | 'desc' | false;
        };
        isPlaceholder: boolean;
      }>;
    }>;
    getRowModel: () => { rows: Array<{ id: string; original: WatchlistRow }> };
    state: { rowSelection: Record<string, boolean> };
    toggleRowSelection: (id: string) => void;
  };

  // Row selection state lives on the table; read via state for reactive renders.
  const rowSelection = table.state.rowSelection;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full text-sm text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort =
                  header.column.columnDef.enableSorting ?? true;
                const headerValue = header.column.columnDef.header;
                const headerText =
                  typeof headerValue === 'function' ? '' : String(headerValue);
                return (
                  <th
                    key={header.id}
                    className={cn(
                      'border-b border-border bg-muted px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground',
                      canSort ? 'cursor-pointer select-none hover:bg-muted/50' : '',
                    )}
                    onClick={canSort ? () => header.column.toggleSorting() : undefined}
                  >
                    {header.isPlaceholder ? null : headerText}
                    {canSort && header.column.getIsSorted() === 'asc' ? ' ▲' : ''}
                    {canSort && header.column.getIsSorted() === 'desc' ? ' ▼' : ''}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const item = row.original;
            const isSelected = rowSelection[row.id] ?? false;
            const inWatchlist = isInWatchlist(item.id, item.mediaType);
            return (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-border hover:bg-muted/50 transition-colors',
                  isSelected ? 'bg-muted' : '',
                )}
                onClick={() => table.toggleRowSelection(row.id)}
              >
                <td className="px-4 py-3 font-mono text-muted-foreground">{item._index}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.mediaType === 'movie' ? 'Movie' : 'TV Series'}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {item.mediaType === 'movie' ? 'Movie' : 'TV Series'}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {new Date(item.addedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist({
                        id: item.id,
                        mediaType: item.mediaType,
                        title: item.title,
                        posterPath: item.posterPath,
                      });
                    }}
                    className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                    aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    {inWatchlist ? '✓ Remove' : '+ Add'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

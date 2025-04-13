import React from 'react';
import PropTypes from 'prop-types';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import Input from './Input';
import Button from './Button';

/**
 * Table component based on react-table
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table columns configuration
 * @param {Array} props.data - Table data
 * @param {boolean} [props.sortable=true] - Whether the table is sortable
 * @param {boolean} [props.pagination=true] - Whether to show pagination
 * @param {boolean} [props.searchable=true] - Whether to show search input
 * @param {string} [props.className] - Additional CSS classes
 */
const Table = ({
  columns,
  data,
  sortable = true,
  pagination = true,
  searchable = true,
  className = '',
}) => {
  // Use the react-table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    gotoPage,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <div className={`bg-white rounded-card shadow-card overflow-hidden ${className}`}>
      {/* Search and page size controls */}
      {(searchable || pagination) && (
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Search input */}
          {searchable && (
            <div className="w-full sm:w-64">
              <Input
                id="table-search"
                name="table-search"
                placeholder="Search..."
                value={globalFilter || ''}
                onChange={e => setGlobalFilter(e.target.value || undefined)}
                leftIcon={<FiSearch size={16} />}
              />
            </div>
          )}
          
          {/* Page size selector */}
          {pagination && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Show</span>
              <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700 ml-2">entries</span>
            </div>
          )}
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(sortable ? column.getSortByToggleProps() : undefined)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      {sortable && column.isSorted ? (
                        column.isSortedDesc ? (
                          <FiChevronDown className="ml-1" />
                        ) : (
                          <FiChevronUp className="ml-1" />
                        )
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.length > 0 ? (
              page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing {page.length > 0 ? pageIndex * pageSize + 1 : 0} to {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              variant="outline"
              size="sm"
              aria-label="First page"
            >
              <span className="sr-only">First page</span>
              <FiChevronLeft className="mr-1" />
              <FiChevronLeft />
            </Button>
            
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              variant="outline"
              size="sm"
              aria-label="Previous page"
            >
              <span className="sr-only">Previous page</span>
              <FiChevronLeft />
            </Button>
            
            <span className="text-sm text-gray-700 mx-2">
              Page <span className="font-medium">{pageIndex + 1}</span> of <span className="font-medium">{pageCount}</span>
            </span>
            
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              variant="outline"
              size="sm"
              aria-label="Next page"
            >
              <span className="sr-only">Next page</span>
              <FiChevronRight />
            </Button>
            
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              variant="outline"
              size="sm"
              aria-label="Last page"
            >
              <span className="sr-only">Last page</span>
              <FiChevronRight />
              <FiChevronRight className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortable: PropTypes.bool,
  pagination: PropTypes.bool,
  searchable: PropTypes.bool,
  className: PropTypes.string,
};

export default Table;
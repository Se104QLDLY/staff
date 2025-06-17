import React from 'react';

interface ColumnConfig {
  key: string;
  header: string;
  minWidth?: string;
  hiddenOn?: 'sm' | 'md' | 'lg' | 'xl';
  truncate?: boolean;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  data: any[];
  columns: ColumnConfig[];
  className?: string;
  striped?: boolean;
  hover?: boolean;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  className = '',
  striped = true,
  hover = true
}) => {
  const getHiddenClass = (hiddenOn?: string) => {
    switch (hiddenOn) {
      case 'sm': return 'hidden sm:table-cell';
      case 'md': return 'hidden md:table-cell';
      case 'lg': return 'hidden lg:table-cell';
      case 'xl': return 'hidden xl:table-cell';
      default: return '';
    }
  };

  const getAlignClass = (align?: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const renderCell = (column: ColumnConfig, row: any) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    if (column.truncate && typeof value === 'string') {
      return (
        <div 
          className={`truncate ${column.maxWidth || 'max-w-[200px]'}`}
          title={value}
        >
          {value}
        </div>
      );
    }

    return value;
  };

  return (
    <div className="overflow-x-auto rounded-2xl shadow-xl border-2 border-blue-100 bg-white">
      <table className={`min-w-full bg-white border border-blue-200 ${className}`}>
        <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
          <tr className="uppercase text-sm">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  py-3 px-4 whitespace-nowrap font-semibold
                  ${getAlignClass(column.align)}
                  ${getHiddenClass(column.hiddenOn)}
                  ${column.minWidth ? `min-w-[${column.minWidth}]` : ''}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-100">
          {data.map((row, index) => (
            <tr 
              key={row.id || index} 
              className={`
                ${hover ? 'hover:bg-gray-50' : ''}
                ${striped && index % 2 === 1 ? 'bg-gray-25' : ''}
              `}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-4 py-3 text-gray-800
                    ${getAlignClass(column.align)}
                    ${getHiddenClass(column.hiddenOn)}
                    ${column.key === 'id' || column.key === 'code' ? 'font-semibold text-gray-900 whitespace-nowrap' : ''}
                  `}
                >
                  {renderCell(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Action buttons component for consistent styling
interface ActionButtonsProps {
  actions: Array<{
    label: string;
    shortLabel?: string;
    onClick?: () => void;
    href?: string;
    variant: 'view' | 'edit' | 'delete' | 'primary';
    icon?: React.ReactNode;
  }>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ actions }) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'view':
        return 'text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100';
      case 'edit':
        return 'text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100';
      case 'delete':
        return 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100';
      case 'primary':
        return 'text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100';
      default:
        return 'text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
      {actions.map((action, index) => {
        const baseClasses = `
          px-2 sm:px-3 py-1 text-xs font-bold rounded-lg transition-colors 
          text-center whitespace-nowrap
          ${getVariantClasses(action.variant)}
        `;

        const content = (
          <>
            {action.icon && <span className="mr-1">{action.icon}</span>}
            <span className="hidden sm:inline">{action.label}</span>
            <span className="sm:hidden">{action.shortLabel || action.label}</span>
          </>
        );

        if (action.href) {
          return (
            <a
              key={index}
              href={action.href}
              className={baseClasses}
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={index}
            onClick={action.onClick}
            className={baseClasses}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
};

// Status badge component
interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  shortText?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'info',
  shortText 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap ${getVariantClasses()}`}>
      <span className="hidden sm:inline">{status}</span>
      <span className="sm:hidden">{shortText || status}</span>
    </span>
  );
}; 
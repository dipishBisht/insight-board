"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface TableColumn {
    key: string;
    title: string;
    render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
    data: any[];
    columns: TableColumn[];
    searchable?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, searchable = true }) => {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey) return 0;

        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();

        if (sortDirection === 'asc') {
            return aString.localeCompare(bString);
        } else {
            return bString.localeCompare(aString);
        }
    });

    const filteredData = sortedData.filter(item => {
        if (!searchQuery) return true;

        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="w-full">
            {searchable && (
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center">
                                        <span>{column.title}</span>
                                        {sortKey === column.key && (
                                            <span className="ml-1">
                                                {sortDirection === 'asc' ?
                                                    <ChevronUp className="h-4 w-4" /> :
                                                    <ChevronDown className="h-4 w-4" />
                                                }
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="py-4 px-4 text-sm text-gray-800">
                                            {column.render ? column.render(item[column.key], item) : item[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-4 px-4 text-center text-sm text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export interface TableColumn<T> {
    key: keyof T;
    title: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    searchable?: boolean;
}

const DataTable = <T extends Record<string, unknown>>({
    columns,
    searchable = true,
}: DataTableProps<T>) => {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSort = (key: keyof T) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

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
                                    key={String(column.key)}
                                    className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort(column.key)}
                                >
                                    <div className="flex items-center">
                                        <span>{column.title}</span>
                                        {sortKey === column.key && (
                                            <span className="ml-1">
                                                {sortDirection === 'asc' ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    );
};

export default DataTable;

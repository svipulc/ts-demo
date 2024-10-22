import { createColumnHelper, useTable } from '@svipulc/custom-ts-table';
import React, { useEffect, useState } from 'react';

// Define the customer data type
interface Customer {
    id: string;
    name: string;
    description: string;
    type: 'Customer' | 'Churned' | 'Active';
    users: number;
    licenseUse: number;
    actions: boolean
}



const columnHelper = createColumnHelper<Customer>();
const columns = [
    columnHelper.accessor('name', {
        id: '1',
        header: 'Company',
        cell(info) {
            return (
                <div className="px-4 py-3 flex items-center">
                    <div className="bg-blue-500 rounded-full w-8 h-8 mr-3 flex items-center justify-center text-white font-bold">
                        {info.row.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{info.row.name}</span>
                </div>
            );
        },
    }),
    columnHelper.accessor('type', {
        id: '2',
        header: 'Status',
        cell(info) {
            return (
                <div className="px-4 py-3 capitalize">
                    <span
                        className={`px-2 py-1 rounded-full text-sm ${info.row.type === 'Customer'
                            ? 'bg-green-100 text-green-600'
                            : info.row.type === 'Churned'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}
                    >
                        {info.row.type}
                    </span>
                </div>
            );
        },
    }),
    columnHelper.accessor('description', {
        id: '3',
        header: 'Description',
        cell: (info) => {
            return <div className="px-4 py-3">{info.row.description}</div>;
        },
    }),
    columnHelper.accessor('users', {
        id: '4',
        header: 'Users',
        cell(info) {
            return <div className="px-4 py-3">{info.row.users}</div>;
        },
    }),
    columnHelper.accessor('licenseUse', {
        id: '5',
        header: 'License Use',
        cell(info) {
            return (
                <div className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(info.row.licenseUse / 100) * 100}%` }}
                        ></div>
                    </div>
                </div>
            );
        },
    }),
    columnHelper.accessor('actions', {
        id: '6',
        header: 'Actions',
        cell: (info) => {
            return (
                <div className="px-4 py-3 flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md" onClick={() => alert(`Edit ${info.row.name}`)}>
                        Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md" onClick={() => alert(`Delete ${info.row.name}`)}>
                        Delete
                    </button>
                </div>
            );
        },
    }),
];

// Main component
const CustomersList: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(generateDummyCustomers());
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const table = useTable({
        data: customers,
        columns,
        globalFilter: searchTerm,
        pagination: {
            page: currentPage,
            pageSize,
        },
    });

    const { getFooterGroup, getHeaderGroup, getPaginationInfo, getRowModel } = table;
    const page = getPaginationInfo()?.currentPage!
    const pageCount = getPaginationInfo()?.totalPages


    useEffect(() => {
        setCurrentPage(page)
    }, [page, searchTerm])

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-8">
            <h1 className="text-2xl font-bold mb-6">Customers</h1>
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        Add customer
                    </button>
                </div>
                <table className="w-full">
                    <thead>
                        {getHeaderGroup().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-gray-200 text-gray-700">
                                {headerGroup.headers.map((header) => (
                                    <th className="px-4 py-3 text-left" key={header.id}>
                                        {header.header}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {getRowModel().rows.map(row => (
                            <tr key={row.id} className="table-row">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>{cell.render()}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>Total page:{getPaginationInfo()?.totalPages}</div>
                <div>current page:{getPaginationInfo()?.currentPage}</div>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
                        disabled={page === 1}
                        onClick={() => setCurrentPage(page - 1)}
                    >
                        Previous
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        disabled={page === pageCount}
                        onClick={() => setCurrentPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomersList;



// Generate 30 dummy customers
const generateDummyCustomers = (): Customer[] => {
    const customers: Customer[] = [];
    for (let i = 1; i <= 30; i++) {
        const id = `customer-${i}`;
        const name = `Customer ${i}`;
        const description = [
            'Content curating app',
            'Design software',
            'Data prediction',
            'Productivity app',
            'Web app integrations',
            'Sales CRM',
            'Automation and workflow',
        ][Math.floor(Math.random() * 7)];
        const type: Customer['type'] = (['Customer', 'Churned', 'Active'] as const)[Math.floor(Math.random() * 3)];
        const users = Math.floor(Math.random() * 50) + 1;
        const licenseUse = Math.floor(Math.random() * 100) + 1;
        const actions = Math.floor(Math.random()) > 0 ? true : false
        customers.push({ id, name, description, type, users, licenseUse, actions });
    }
    return customers;
};
import React, { useState, useMemo } from 'react'
import { createColumnHelper, useTable, FilterFunction, DeepKeys, } from '@svipulc/custom-ts-table'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Bell, Search, ArrowUpDown } from 'lucide-react'

// Define the user data type
interface User {
    id: number
    name: string
    email: string
    role: 'RN' | 'LPN' | 'LVN'
    visibility: 'visible' | 'invisible'
    phoneNumber: string
    city: string
    yearsOfExperience: number
}

// Column-specific filtering
// const columnFilters: Record<string, FilterFunction> = {
//     role: (rows, id, filterValue) => rows.filter(row => row.getValue(id) === filterValue),
//     visibility: (rows, id, filterValue) => rows.filter(row => row.getValue(id) === filterValue),
//     yearsOfExperience: (rows, id, filterValue) => rows.filter(row => {
//         const years = row.getValue(id) as number
//         return filterValue === 'less5' ? years < 5 : years >= 5
//     }),
// }

const columnHelper = createColumnHelper<User>()
const columns = [
    columnHelper.accessor('name', {
        id: 'name',
        header: 'Name',
        cell: (info) => (
            <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={info.row.name} />
                    <AvatarFallback>{info.row.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span>{info.row.name}</span>
            </div>
        ),
        sortable: true
    }),
    columnHelper.accessor('email', {
        id: 'email',
        header: 'E-mail',
        cell: (info) => <div>{info.row.email}</div>,
        sortable: true
    }),
    columnHelper.accessor('role', {
        id: 'role',
        header: 'Role',
        cell: (info) => (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${info.row.role === 'RN' ? 'bg-green-100 text-green-800' :
                info.row.role === 'LPN' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                {info.row.role}
            </span>
        ),
    }),
    columnHelper.accessor('visibility', {
        id: 'visibility',
        header: 'Visibility',
        cell: (info) => <div>{info.row.visibility}</div>,
    }),
    columnHelper.accessor('phoneNumber', {
        id: 'phoneNumber',
        header: 'Phone Number',
        cell: (info) => <div>{info.row.phoneNumber}</div>,
    }),
    columnHelper.accessor('city', {
        id: 'city',
        header: 'City',
        cell: (info) => <div>{info.row.city}</div>,
    }),
    columnHelper.accessor('yearsOfExperience', {
        id: 'yearsOfExperience',
        header: 'Years of Experience',
        cell: (info) => <div>{info.row.yearsOfExperience} years</div>,
        sortable: true
    }),
    columnHelper.accessor('id', {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
            <Button variant="link" className="text-indigo-600 hover:text-indigo-900">
                Reactivate
            </Button>
        ),
    }),
]

// Generate 30 dummy users
const generateDummyUsers = (): User[] => {
    const roles: ('RN' | 'LPN' | 'LVN')[] = ['RN', 'LPN', 'LVN']
    const cities = ['Austin', 'Naperville', 'Fairfield', 'Orange', 'Toledo']

    return Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        visibility: Math.random() > 0.5 ? 'visible' : 'invisible',
        phoneNumber: `(${Math.floor(Math.random() * 900) + 100}) 555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        yearsOfExperience: Math.floor(Math.random() * 20) + 1,
    }))
}

// Main component
const UserArchive: React.FC = () => {
    const [users] = useState<User[]>(generateDummyUsers())
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(4)
    const [roleFilter, setRoleFilter] = useState<string | undefined>()
    const [visibilityFilter, setVisibilityFilter] = useState<string | undefined>()
    const [experienceFilter, setExperienceFilter] = useState<string | undefined>()
    const [sortinga, setSorting] = useState<{
        key: DeepKeys<User>;
        direction: "ascending" | "descending" | "none";
    } | null>(null)

    // const filteredUsers = useMemo(() => {
    //     return users.filter(user =>
    //         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         user.city.toLowerCase().includes(searchTerm.toLowerCase())
    //     )
    // }, [users, searchTerm])

    const requestSort = (key: DeepKeys<User>) => {
        let direction: "ascending" | "descending" | "none" = "ascending";
        if (sortinga && sortinga.key === key && sortinga.direction === "ascending") {
            direction = "descending";
        }
        if (sortinga && sortinga.key === key && sortinga.direction === "descending") {
            direction = "none";
        }
        setSorting({ key, direction });
    };

    const table = useTable({
        data: users,
        sorting: sortinga,
        columns,
        globalFilter: searchTerm,
        // columnFilter: {
        //     role: roleFilter,
        //     visibility: visibilityFilter,
        //     yearsOfExperience: experienceFilter,
        // },
        pagination: {
            page: currentPage,
            pageSize,
        },
    })

    const { getFooterGroup, getHeaderGroup, getPaginationInfo, getRowModel } = table
    const page = getPaginationInfo()?.currentPage!
    const pageCount = getPaginationInfo()?.totalPages

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-2 text-xl font-bold text-gray-800">St. Mary Hospital</div>
                    </div>
                    <div className="flex items-center">
                        <Input type="text" placeholder="Search patients, task, forms" className="mr-4" />
                        <Button variant="outline" className="mr-2">New Patient</Button>
                        <Button>New Task</Button>
                        <div className="ml-4 relative">
                            <Bell className="h-6 w-6 text-gray-400" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                        </div>
                        <Avatar className="ml-4">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Jacob Warren" />
                            <AvatarFallback>JW</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Archive</h2>
                    <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Users Archive</h3>
                                    <p className="mt-1 text-sm text-gray-500">12,430 USERS</p>
                                </div>
                                <Button variant="outline">Import Data</Button>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <Button variant="outline" className="text-sm">Super Admin</Button>
                                <Button variant="outline" className="text-sm">Local Admin</Button>
                                <Button variant="outline" className="text-sm">Nurses</Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border-b">
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <div className="flex space-x-2">
                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RN">RN</SelectItem>
                                        <SelectItem value="LPN">LPN</SelectItem>
                                        <SelectItem value="LVN">LVN</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Visibility" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="visible">Visible</SelectItem>
                                        <SelectItem value="invisible">Invisible</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Experience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="less5">Less than 5 years</SelectItem>
                                        <SelectItem value="more5">5 years or more</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {getHeaderGroup().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                onClick={() =>
                                                    header.column.sortable &&
                                                    requestSort(header.column.accessorKey as DeepKeys<User>)
                                                }
                                                style={{
                                                    cursor: header.column.sortable ? "pointer" : "default",
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    {header.header}
                                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getRowModel().rows.map((row) => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                {cell.render()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(page + 1)}
                                    disabled={page === pageCount}
                                >
                                    Next
                                </Button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    {/* <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(page * pageSize, filteredUsers.length)}</span> of{' '}
                                        <span className="font-medium">{filteredUsers.length}</span> results
                                    </p> */}
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        {Array.from({ length: pageCount! }, (_, i) => i + 1).map((pageNum) => (
                                            <Button
                                                key={pageNum}
                                                variant={pageNum === page ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        ))}
                                        <Button
                                            variant="outline"
                                            size="sm"

                                            onClick={() => setCurrentPage(page + 1)}
                                            disabled={page === pageCount}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserArchive
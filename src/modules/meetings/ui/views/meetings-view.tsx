"use client"

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useMeetingsFilters } from "../../hooks/use-meeting-filter";
import { useRouter } from "next/navigation";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {

    const [filters,setFilters] = useMeetingsFilters();

    const router = useRouter();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters
    }))

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable 
            data={data.items} 
            columns={columns}
            onRowClick={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
            />
            {data.items.length === 0 && (
                <EmptyState 
                title="Create Your First Meeting"
                description="Schedule a Meeting to connect with others. Each Meeting lets you collaborate, share ideas, and interact with participants in real time."
                />
            )}
        </div>
    )
}

export const MeetingsViewLoading = () => {
    return(
        <LoadingState
        title="Loading Meetings"
        description="This May Take a Few Seconds..."
        />
    )
}

export const MeetingsViewError = () => {
    return(
        <ErrorState
        title='Error Loading Meetings'
        description='Something Went Wrong...'
        />
    )
}
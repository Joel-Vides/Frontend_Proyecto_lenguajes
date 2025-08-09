import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react"
import { useNavigate } from "react-router";
import { getPaginationBusesAction } from "../../core/actions/statistics/buses/get-pagination-buses.action";
import { getOneBusAction } from "../../core/actions/statistics/buses/get-one-bus.action";
import type { BusModel } from "../../core/models/bus.models";
import { createBusAction } from "../../core/actions/statistics/buses/create-bus.action";
import { editBusAction } from "../../core/actions/statistics/buses/edit-bus.action";
import { deleteBusAction } from "../../core/actions/statistics/buses/delete-bus.action";

export const useBuses = (busId?: string) => {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const busesPaginationQuery = useQuery({
        queryKey: ["bus", page, pageSize, searchTerm],
        queryFn: () => getPaginationBusesAction(page, pageSize, searchTerm),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })

    const oneBusQuery = useQuery({
        queryKey: ["bus", busId],
        queryFn: () => getOneBusAction(busId!),
        enabled: !!busId,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })

    const createBusMutation = useMutation({
        mutationFn: (form: FormData) => createBusAction(form),
        onSuccess: (data) => {
            if (data.status) {
                navigate("/");
            }
        },
        onError: (data) => {
            console.log(data);
        }
    });

    const editBusMutation = useMutation({
        mutationFn: (bus: BusModel) => editBusAction(bus, busId!),
        onSuccess: (data) => {
            if (data.status) {
                refreshBuses();
                navigate("/buses");
            }
        },
        onError: (data) => {
            console.log(data);
        },
    });

    const deleteBusMutation = useMutation({
        mutationFn: () => deleteBusAction(busId!),
        onSuccess: (data) => {
            if (data.status) {
                refreshBuses();
                navigate("/buses");
            }
        },
        onError: (data) => {
            console.log(data);
        },
    });

    const refetch = busesPaginationQuery.refetch;

    const refreshBuses = useCallback(() => {
        refetch();
    }, [refetch]);

  return {
    // Properties
    page,
    pageSize,
    searchTerm,
    busesPaginationQuery,
    oneBusQuery,
    createBusMutation,
    editBusMutation,
    deleteBusMutation,

    // Methods
    setPage,
    setPageSize,
    setSearchTerm,
    refreshBuses,
  }
}
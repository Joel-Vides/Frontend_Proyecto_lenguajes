import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react"
import { useNavigate } from "react-router";
import { getPaginationCompaniesAction } from "../../core/actions/statistics/companies/get-pagination-companies.action";
import { getOneCompanyAction } from "../../core/actions/statistics/companies/get-one-company.action";
import type { CompanyModel } from "../../core/models/company.models";
import { createCompanyAction } from "../../core/actions/statistics/companies/create-company.action";
import { editCompanyAction } from "../../core/actions/statistics/companies/edit-company.action";
import { deleteCompanyAction } from "../../core/actions/statistics/companies/delete-company.action";

export const useCompanies = (companyId?: string) => {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    const companiesPaginationQuery = useQuery({
        queryKey: ["companies", page, pageSize, searchTerm],
        queryFn: () => getPaginationCompaniesAction(page, pageSize, searchTerm),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const oneCompanyQuery = useQuery({
        queryKey: ["company", companyId],
        queryFn: () => getOneCompanyAction(companyId!),
        enabled: !!companyId,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    const createCompanyMutation = useMutation({
        mutationFn: (company: CompanyModel) => createCompanyAction(company),
        onSuccess: (data) => {
            if (data.status) {
                navigate("/companies");
            }
        },
        onError: (data) => {
            console.log(data);
        }
    });

    const editCompanyMutation = useMutation({
        mutationFn: (company: CompanyModel) => editCompanyAction(company, companyId!),
        onSuccess: (data) => {
            if (data.status) {
                refreshCompanies();
                navigate("/companies");
            }
        },
        onError: (data) => {
            console.log(data);

        }
    });

    const deleteCompanyMutation = useMutation({
        mutationFn: () => deleteCompanyAction(companyId!),
        onSuccess: (data) => {
            if (data.status) {
                refreshCompanies();
                navigate("/companies");
            }
        }
    })

    const refetch = companiesPaginationQuery.refetch;

    const refreshCompanies = useCallback(() => {
        refetch();
    }, [refetch]);

    return {
        // Properties
        page,
        pageSize,
        searchTerm,
        companiesPaginationQuery,
        oneCompanyQuery,
        createCompanyMutation,
        editCompanyMutation,
        deleteCompanyMutation,

        // Methods
        setPage,
        setPageSize,
        setSearchTerm,
        refreshCompanies,
    }
}
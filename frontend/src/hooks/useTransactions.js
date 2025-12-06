import { useQuery } from '@tanstack/react-query';
import { transactionAPI } from '../services/api';

export const useTransactions = (filters, page = 1, limit = 10) => {
  const params = {
    page,
    limit,
    ...filters,
  };

  // Convert arrays to comma-separated strings
  if (params.regions?.length > 0) {
    params.region = params.regions.join(',');
    delete params.regions;
  }
  if (params.genders?.length > 0) {
    params.gender = params.genders.join(',');
    delete params.genders;
  }
  if (params.categories?.length > 0) {
    params.category = params.categories.join(',');
    delete params.categories;
  }
  if (params.tags?.length > 0) {
    params.tags = params.tags.join(',');
  }
  if (params.paymentMethods?.length > 0) {
    params.paymentMethod = params.paymentMethods.join(',');
    delete params.paymentMethods;
  }

  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionAPI.getTransactions(params),
    select: (response) => response.data,
  });
};

export const useFilterOptions = () => {
  return useQuery({
    queryKey: ['filterOptions'],
    queryFn: () => transactionAPI.getFilterOptions(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};


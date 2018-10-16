package com.dz.bashapp;

import org.springframework.data.repository.PagingAndSortingRepository;

public interface QuoteRepository extends PagingAndSortingRepository<dz_quote, Integer> {

}
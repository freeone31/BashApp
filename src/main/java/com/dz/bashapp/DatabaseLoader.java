package com.dz.bashapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

	private final UserRepository userRepository;
	private final QuoteRepository quoteRepository;

	@Autowired
	public DatabaseLoader(UserRepository iUserRepository, QuoteRepository iQuoteRepository) {
		this.userRepository = iUserRepository;
		this.quoteRepository = iQuoteRepository;
	}

	@Override
	public void run(String... strings) throws Exception {
	
	}
}
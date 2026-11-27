package br.com.senac.backend;

import br.com.senac.backend.model.Business;
import br.com.senac.backend.model.Product;
import br.com.senac.backend.repository.BusinessRepository;
import br.com.senac.backend.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:backend-test;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class BackendApplicationTests {

	@Autowired
	private BusinessRepository businessRepository;

	@Autowired
	private ProductRepository productRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void savesAndReadsBusinessFromDatabase() {
		Business business = new Business(
				null,
				1L,
				"Padaria Central",
				"Padaria",
				"Centro",
				"08:00 às 18:00"
		);

		Business saved = businessRepository.save(business);

		assertNotNull(saved.getId());
		assertEquals("Padaria Central", businessRepository.findById(saved.getId())
				.orElseThrow()
				.getName());
	}

	@Test
	void savesAndFindsProductsByBusinessFromDatabase() {
		Product product = new Product();

		product.setName("Produto Teste");
		product.setPrice(new BigDecimal("10.00"));
		product.setNotes("obs");
		product.setDescription("desc");
		product.setImageUrl("img");
		product.setBusinessId(1L);

		Product saved = productRepository.save(product);

		assertNotNull(saved.getId());
		assertTrue(productRepository.findByBusinessId(1L).stream()
				.anyMatch(found -> found.getId().equals(saved.getId())));
	}
}

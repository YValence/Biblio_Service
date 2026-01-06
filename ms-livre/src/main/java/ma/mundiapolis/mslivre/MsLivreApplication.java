package ma.mundiapolis.mslivre;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient

public class MsLivreApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsLivreApplication.class, args);
    }

}

package ma.mundiapolis.msemprunt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients // Important pour activer Feign
@EnableScheduling
public class MsEmpruntApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsEmpruntApplication.class, args);
    }

}

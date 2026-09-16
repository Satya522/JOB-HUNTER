package com.jobhunter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean; // ✅ Ye import add kiya
import org.springframework.web.client.RestTemplate; // ✅ Ye import add kiya

@SpringBootApplication
@EnableCaching
@EnableScheduling
public class JobHunterApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobHunterApplication.class, args);
    }

    // ✅ Ye naya method add kiya gaya hai
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
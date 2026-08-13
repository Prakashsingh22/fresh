package com.zepto.zepto_backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;

import java.util.Properties;

@Configuration
public class AppConfiguration {
    @Bean
    public JavaMailSender createJavaMailSender(){
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setPort(587);
        javaMailSender.setHost("sandbox.smtp.mailtrap.io");
        javaMailSender.setUsername("16132f74708164");
        javaMailSender.setPassword("c6e16a8cf244d7");
        Properties props = javaMailSender.getJavaMailProperties();
        props.put("mail.smtp.auth","true");
        props.put("mail.smtp.starttls.enable","true");
        props.put("mail.debug", "true");
        return javaMailSender;
    }
    @Bean
    public TemplateEngine createTemplateEngine(){
        return new TemplateEngine();
    }
}

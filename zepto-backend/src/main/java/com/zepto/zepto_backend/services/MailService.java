package com.zepto.zepto_backend.services;

import com.zepto.zepto_backend.enums.UserType;
import com.zepto.zepto_backend.models.User;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
@Slf4j
@Service
public class MailService {
    @Autowired
    JavaMailSender javaMailSender;
    @Autowired
    TemplateEngine templateEngine;
    public void sendMailToInviteAdmin(User appAdmin,String inviterName,String userType){
        Context context  = new Context();
        context.setVariable("adminName",appAdmin.getUserName());
        context.setVariable("inviterName",inviterName);
        context.setVariable("appName","Fresh Cart");
        context.setVariable("role",userType);
        if(userType.equals(UserType.ZEPTO_APP_ADMIN.toString())){
            context.setVariable("acceptUrl","http://localhost:5050/api/v1/admin/invite/accept/"+appAdmin.getId());
            context.setVariable("rejectUrl","http://localhost:5050/api/v1/admin/invite/reject/"+appAdmin.getId());
        }else{
            context.setVariable("acceptUrl","http://localhost:5050/api/v1/warehouse-admin/invite/accept/"+appAdmin.getId());
            context.setVariable("rejectUrl","http://localhost:5050/api/v1/admin/invite/reject/"+appAdmin.getId());
        }
        context.setVariable("acceptUrl","http://localhost:5050/api/v1/admin/invite/accept/"+appAdmin.getId());
        context.setVariable("rejectUrl","http://localhost:5050/api/v1/admin/invite/reject/"+appAdmin.getId());
        String htmlCode =templateEngine.process("invite-admin-email",context);

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage);
        try {
            mimeMessageHelper.setText(htmlCode,true);
            mimeMessageHelper.setTo(appAdmin.getEmail());
            mimeMessageHelper.setSubject("Admin Invitation");
            javaMailSender.send(mimeMessage);

        } catch (Exception e) {
            log.error(e.getMessage());
        }

    }
}

package com.voltsolutions.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Properties;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
@RequestMapping(value="Properties")
public class PropertiesController {

    private static final Logger log = LoggerFactory.getLogger(PropertiesController.class);

    @RequestMapping(method=GET)
    public @ResponseBody
    Properties findAllContactsByFilterType(HttpServletRequest req){
        log.debug("Start findAllProperties");
        //return System.getProperties();
        Properties props = new Properties();
        props.setProperty("env", System.getProperty("env", "DEV"));
        props.setProperty("scheme", req.getScheme());
        props.setProperty("host", req.getServerName());
        props.setProperty("port", String.valueOf(req.getServerPort()));
        props.setProperty("context", req.getContextPath());
        props.setProperty("page-title", "Contact Management");
        return props;
    }
}

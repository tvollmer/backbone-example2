package com.voltsolutions.app.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.voltsolutions.app.dao.ContactDao;
import com.voltsolutions.model.Contact;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static org.springframework.web.bind.annotation.RequestMethod.*;

import java.util.*;

@Controller
@RequestMapping(value="Contacts")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    // mvn -Dlog4j.DEBUG -Dlog4j.configuration=file:/opt/java/log4j.properties jetty:run
    // http://localhost:8080/backbone-example/app/Contacts

    private ContactDao contactDao;

    @Autowired(required = true)
    public void setContactDao(ContactDao contactDao){
        this.contactDao = contactDao;
    }

    @RequestMapping(method=GET)
    public @ResponseBody List<Contact> findAllContactsByFilterType(@RequestParam(value="filterType", defaultValue = "all") String filterType){
        log.debug("Start findAllContactsByFilterType");
        return contactDao.findAllByFilterType(filterType);
    }

    @RequestMapping(value = "{id}", method = GET)
    public @ResponseBody Contact findContactById(@PathVariable("id") int contId){
        log.debug("Start findContactById. ID=" + contId);
        return contactDao.findById(contId);
    }

    @RequestMapping(method = POST)
    public @ResponseBody Contact saveContact(@RequestBody Contact contact){
        log.debug("Start saveContact");
        return contactDao.save(contact);
    }

    @RequestMapping(value = "{id}", method=PUT)
    public @ResponseBody Contact updateContact(@RequestBody Contact contact){
        log.debug("Start updateContact");
        return contactDao.update(contact);
    }

    @RequestMapping(value = "{id}", method = DELETE)
    public @ResponseBody Contact removeContact(@PathVariable("id") int contactId){
        log.debug("Start removeContact");
        return contactDao.remove(contactId);
    }

    @RequestMapping(value = "types", method=GET)
    public @ResponseBody List<String> findAllContactTypes(){
        log.debug("Start findAllContactTypes");
        return contactDao.findAllContactTypes();
    }
}

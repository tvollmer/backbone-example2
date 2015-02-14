package com.voltsolutions.app.controller;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.voltsolutions.model.Contact;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private Map<Integer, Contact> contactData = Maps.newHashMap();

    public ContactController(){
        log.debug("Creating ContactController, and pre-populating some data in the map.");
        contactData.put(1, new Contact().withId(1).withName("Contact 1").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
        contactData.put(2, new Contact().withId(2).withName("Contact 2").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
        contactData.put(3, new Contact().withId(3).withName("Contact 3").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend"));
        contactData.put(4, new Contact().withId(4).withName("Contact 4").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("colleague"));
        contactData.put(5, new Contact().withId(5).withName("Contact 5").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
        contactData.put(6, new Contact().withId(6).withName("Contact 6").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("colleague"));
        contactData.put(7, new Contact().withId(7).withName("Contact 7").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend"));
        contactData.put(8, new Contact().withId(8).withName("Contact 8").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
    }

    @RequestMapping(method=GET)
    public @ResponseBody List<Contact> findAllContactsByFilterType(@RequestParam("filterType") String filterType){
        log.debug("Start findAllContactsByFilterType");
        if (StringUtils.isEmpty(filterType) || "all".equals(filterType)){
            return new ArrayList<Contact>(contactData.values());
        }

        return findFilteredContactsByFilterType(filterType, contactData.values());
    }

    private List<Contact> findFilteredContactsByFilterType(String filterType, Collection<Contact> allContacts) {
        List<Contact> filteredContacts = Lists.newArrayList();
        for (Contact contact : allContacts){
            if (filterType.equalsIgnoreCase(contact.getType())){
                filteredContacts.add(contact);
            }
        }
        return filteredContacts;
    }

    @RequestMapping(value = "{id}", method = GET)
    public @ResponseBody Contact findContactById(@PathVariable("id") int contId){
        log.debug("Start findContactById. ID=" + contId);
        return contactData.get(contId);
    }

    @RequestMapping(method = POST)
    public @ResponseBody Contact saveContact(@RequestBody Contact contact){
        log.debug("Start saveContact");
        Date now = new Date();
        int newId = Long.valueOf(now.getTime()).intValue();
        contact.withId(newId).withCreatedDate(now);
        contactData.put(newId, contact);
        return contact;
    }

    @RequestMapping(value = "{id}", method=PUT)
    public @ResponseBody Contact updateContact(@RequestBody Contact contact){
        log.debug("Start updateContact");
        contactData.put(contact.getId(), contact);
        return contact;
    }

    @RequestMapping(value = "{id}", method = DELETE)
    public @ResponseBody Contact removeContact(@PathVariable("id") int contactId){
        log.debug("Start removeContact");
        return contactData.remove(contactId);
    }

    @RequestMapping(value = "types", method=GET)
    public @ResponseBody List<String> findAllContactTypes(){
        log.debug("Start findAllContactTypes");
        Set<String> contactTypes = new HashSet<String>();
        for (Contact contact : contactData.values()){
            contactTypes.add(contact.getType().toLowerCase());
        }
        return Lists.newArrayList(contactTypes);
    }
}

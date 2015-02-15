package com.voltsolutions.app.dao;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.voltsolutions.model.Contact;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class SimpleContactDao implements ContactDao {

    private static final Logger log = LoggerFactory.getLogger(SimpleContactDao.class);

    private Map<Integer, Contact> contactData = Maps.newHashMap();

    public SimpleContactDao(){
        contactData.put(1, new Contact().withId(1).withName("Contact 1").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
        contactData.put(2, new Contact().withId(2).withName("Contact 2").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
        contactData.put(3, new Contact().withId(3).withName("Contact 3").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend"));
        contactData.put(4, new Contact().withId(4).withName("Contact 4").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("colleague"));
        contactData.put(5, new Contact().withId(5).withName("Contact 5").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
        contactData.put(6, new Contact().withId(6).withName("Contact 6").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("colleague"));
        contactData.put(7, new Contact().withId(7).withName("Contact 7").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend"));
        contactData.put(8, new Contact().withId(8).withName("Contact 8").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("family"));
    }

    @Override
    public List<Contact> findAllByFilterType(String filterType){
        if (StringUtils.isEmpty(filterType) || "all".equals(filterType)){
            return new ArrayList<Contact>(contactData.values());
        }

        List<Contact> filteredContacts = Lists.newArrayList();
        for (Contact contact : contactData.values()){
            if (filterType.equalsIgnoreCase(contact.getType())){
                filteredContacts.add(contact);
            }
        }
        return filteredContacts;
    }

    @Override
    public Contact findById(int id){
        return contactData.get(id);
    }

    @Override
    public Contact save(Contact contact){
        Integer currentId = contact.getId();
        if (currentId != null && contactData.containsKey(currentId)){
            throw new RuntimeException("wtf exception; if you're trying to do an update, then call update.");
        }
        Date now = new Date();
        int newId = Long.valueOf(now.getTime()).intValue();
        contact.withId(newId).withCreatedDate(now);
        contactData.put(newId, contact);
        return contact;
    }

    @Override
    public Contact update(Contact contact){
        Integer currentId = contact.getId();
        if (currentId == null || !contactData.containsKey(currentId)){
            throw new RuntimeException("wtf exception; if you're trying to do an insert, then call save.");
        }
        contactData.put(contact.getId(), contact);
        return contact;
    }

    @Override
    public Contact remove(int id){
        return contactData.remove(id);
    }

    @Override
    public List<String> findAllContactTypes(){
        Set<String> contactTypes = new HashSet<String>();
        for (Contact contact : contactData.values()){
            contactTypes.add(contact.getType().toLowerCase());
        }
        return Lists.newArrayList(contactTypes);
    }
}

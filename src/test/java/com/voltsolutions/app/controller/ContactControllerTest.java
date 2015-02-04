package com.voltsolutions.app.controller;

import static org.junit.Assert.*;

import com.google.common.collect.Lists;
import com.voltsolutions.model.Contact;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;

public class ContactControllerTest {

    ContactController contactController;

    @Before
    public void setUp() throws Exception {
        contactController = new ContactController();
    }

    @Test
    public void shouldFindAllContactsByFilterTypeAll() throws Exception {
        assertEquals(8, contactController.findAllContactsByFilterType("all").size());
    }

    @Test
    public void shouldFindAllContactsByFilterTypeNone() throws Exception {
        assertEquals(8, contactController.findAllContactsByFilterType("").size());
        assertEquals(8, contactController.findAllContactsByFilterType(null).size());
    }

    @Test
    public void shouldFindAllContactsByFilterTypeOne() throws Exception {
        assertEquals(2, contactController.findAllContactsByFilterType("friend").size());
    }

    @Test
    public void testFindContactById() throws Exception {
        assertNotNull(contactController.findContactById(3));
    }

    @Test
    public void testSaveContact() throws Exception {
        String newName = RandomStringUtils.randomAlphabetic(25);
        Contact contact = contactController.findContactById(3).clone();
        contact.setId(0);
        contact.setCreatedDate(null);
        contact.setName(newName);
        Contact savedContact = contactController.saveContact(contact);

        assertNotNull(savedContact.getId());
        assertNotNull(savedContact.getCreatedDate());
        assertEquals(newName, savedContact.getName());
    }

    @Test
    public void testUpdateContact() throws Exception {
        String newName = RandomStringUtils.randomAlphabetic(25);
        Contact contact = contactController.findContactById(3).clone();
        contact.setName(newName);
        Integer id = contact.getId();
        Contact savedContact = contactController.updateContact(contact);

        assertEquals(id, savedContact.getId());
        assertEquals(newName, savedContact.getName());
    }

    @Test
    public void testRemoveContact() throws Exception {
        Contact contactLhs = contactController.findContactById(3).clone();
        Contact contactRhs = contactController.removeContact(3);
        assertTrue(contactLhs.equals(contactRhs));
        assertEquals(7, contactController.findAllContactsByFilterType("all").size());
    }

    @Test
    public void testFindAllContactTypes() throws Exception {
        assertEquals(Lists.newArrayList("family", "colleague", "friend"), contactController.findAllContactTypes());
    }
}

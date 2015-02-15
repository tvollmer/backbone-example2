package com.voltsolutions.app.dao;

import static org.junit.Assert.*;

import com.google.common.collect.Lists;
import com.voltsolutions.app.controller.ContactController;
import com.voltsolutions.app.dao.ContactDao;
import com.voltsolutions.app.dao.SimpleContactDao;
import com.voltsolutions.model.Contact;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;

public class ContactDaoTest {

    ContactDao contactDao;

    @Before
    public void setUp() throws Exception {
        contactDao = new SimpleContactDao();
    }

    @Test
    public void shouldFindAllContactsByFilterTypeAll() throws Exception {
        assertEquals(8, contactDao.findAllByFilterType("all").size());
    }

    @Test
    public void shouldFindAllContactsByFilterTypeNone() throws Exception {
        assertEquals(8, contactDao.findAllByFilterType("").size());
        assertEquals(8, contactDao.findAllByFilterType(null).size());
    }

    @Test
    public void shouldFindAllContactsByFilterTypeOne() throws Exception {
        assertEquals(2, contactDao.findAllByFilterType("friend").size());
    }

    @Test
    public void testFindContactById() throws Exception {
        assertNotNull(contactDao.findById(3));
    }

    @Test
    public void testSaveContact() throws Exception {
        String newName = RandomStringUtils.randomAlphabetic(25);
        Contact contact = contactDao.findById(3).clone();
        contact.setId(0);
        contact.setCreatedDate(null);
        contact.setName(newName);
        Contact savedContact = contactDao.save(contact);

        assertNotNull(savedContact.getId());
        assertNotNull(savedContact.getCreatedDate());
        assertEquals(newName, savedContact.getName());
    }

    @Test(expected = RuntimeException.class)
    public void shouldNotSaveExistingContact() throws Exception {
        Contact contact = contactDao.findById(3).clone();
        contactDao.save(contact);
    }

    @Test
    public void testUpdateContact() throws Exception {
        String newName = RandomStringUtils.randomAlphabetic(25);
        Contact contact = contactDao.findById(3).clone();
        contact.setName(newName);
        Integer id = contact.getId();
        Contact savedContact = contactDao.update(contact);

        assertEquals(id, savedContact.getId());
        assertEquals(newName, savedContact.getName());
    }

    @Test(expected = RuntimeException.class)
    public void shouldNotUpdateNewContact() throws Exception {
        String newName = RandomStringUtils.randomAlphabetic(25);
        Contact contact = contactDao.findById(3).clone();
        contact.setId(500);
        contact.setName(newName);
        contactDao.update(contact);
    }

    @Test
    public void testRemoveContact() throws Exception {
        Contact contactLhs = contactDao.findById(3).clone();
        Contact contactRhs = contactDao.remove(3);
        assertTrue(contactLhs.equals(contactRhs));
        assertEquals(7, contactDao.findAllByFilterType("all").size());
    }

    @Test
    public void testFindAllContactTypes() throws Exception {
        assertEquals(Lists.newArrayList("family", "colleague", "friend"), contactDao.findAllContactTypes());
    }
}

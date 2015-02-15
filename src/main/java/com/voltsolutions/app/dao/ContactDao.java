package com.voltsolutions.app.dao;

import com.voltsolutions.model.Contact;

import java.util.List;

public interface ContactDao {
    List<Contact> findAllByFilterType(String filterType);

    Contact findById(int id);

    Contact save(Contact contact);

    Contact update(Contact contact);

    Contact remove(int id);

    List<String> findAllContactTypes();
}

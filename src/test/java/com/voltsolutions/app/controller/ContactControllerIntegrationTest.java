package com.voltsolutions.app.controller;

import com.google.gson.Gson;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.spi.JsonProvider;
import com.jayway.jsonpath.spi.JsonProviderFactory;
import com.voltsolutions.model.Contact;
import org.junit.Before;
import org.junit.Test;
import static org.junit.matchers.JUnitMatchers.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations={"classpath:servlet-context.xml"})
public class ContactControllerIntegrationTest {

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = webAppContextSetup(this.wac).build();
    }

    @Test
    public void shouldGetContactById() throws Exception {
        this.mockMvc.perform(get("/Contacts/1").accept("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"))
                .andExpect(jsonPath("$.name").value("Contact 1"));
    }

    // TODO : not currently able to test the default GET
//    @Test
//    public void shouldGetAllContacts() throws Exception {
//        this.mockMvc.perform(get("/Contacts").accept("application/json"))
//                .andExpect(status().isOk())
//                .andExpect(content().contentType("application/json;charset=UTF-8"))
//                .andExpect(jsonPath("$.name").value("Contact 1"));
//    }

    @Test
    public void shouldGetTypes() throws Exception {
        this.mockMvc.perform(get("/Contacts/types").accept("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"))
                .andExpect(content().string(containsString("friend")));
    }

    @Test
    public void shouldSaveContact() throws Exception {
        Contact contact = new Contact().withId(3).withName("Contact 3").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend");
        Gson gson = new Gson();
        String contactAsJson = gson.toJson(contact);
        this.mockMvc.perform(post("/Contacts").accept("application/json").content(contactAsJson).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"));
    }

    @Test
    public void shouldUpdateContact() throws Exception {
        Contact contact = new Contact().withId(3).withName("Contact 3").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend");
        Gson gson = new Gson();
        String contactAsJson = gson.toJson(contact);
        this.mockMvc.perform(put("/Contacts/3").accept("application/json").content(contactAsJson).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"));
    }

    @Test
    public void shouldDeleteContact() throws Exception {
        this.mockMvc.perform(delete("/Contacts/3").accept("application/json"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"));
    }

}

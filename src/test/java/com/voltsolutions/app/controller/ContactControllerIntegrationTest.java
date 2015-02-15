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
import org.springframework.test.context.ContextHierarchy;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextHierarchy({
    @ContextConfiguration(locations={"classpath:root-context.xml"}),
    @ContextConfiguration(locations={"classpath:servlet-context.xml"})
})
public class ContactControllerIntegrationTest {

    private static final String APP_JSON_UTF8 = "application/json;charset=UTF-8";

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        this.mockMvc = webAppContextSetup(this.wac).build();
    }

    @Test
    public void shouldGetContactById() throws Exception {
        this.mockMvc.perform(get("/Contacts/1").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APP_JSON_UTF8))
                .andExpect(jsonPath("$.name").value("Contact 1"));
    }

    @Test
    public void shouldGetAllContacts() throws Exception {
        this.mockMvc.perform(get("/Contacts").accept(MediaType.APPLICATION_JSON))
//                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(APP_JSON_UTF8))
                .andExpect(jsonPath("$[?(@.id==1)].name").value("Contact 1"))
                .andExpect(jsonPath("$[?(@.id==2)].name").value("Contact 2"))
                .andExpect(jsonPath("$[?(@.id==3)].name").value("Contact 3"))
//                .andExpect(jsonPath("$[?(@.id==4)].name").value("Contact 4")) // could be removed by a different test
                .andExpect(jsonPath("$[?(@.id==5)].name").value("Contact 5"))
                .andExpect(jsonPath("$[?(@.id==6)].name").value("Contact 6"))
                .andExpect(jsonPath("$[?(@.id==7)].name").value("Contact 7"))
                .andExpect(jsonPath("$[?(@.id==8)].name").value("Contact 8"))
                ;
    }

    @Test
    public void shouldGetTypes() throws Exception {
        this.mockMvc.perform(get("/Contacts/types").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APP_JSON_UTF8))
                .andExpect(content().string(containsString("friend")));
    }

    @Test
    public void shouldSaveContact() throws Exception {
        Contact contact = new Contact().withId(9).withName("Contact 9").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend");
        Gson gson = new Gson();
        String contactAsJson = gson.toJson(contact);
        this.mockMvc.perform(post("/Contacts").accept(MediaType.APPLICATION_JSON).content(contactAsJson).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APP_JSON_UTF8));
    }

//    @Test
//    public void shouldNotSaveExistingContact() throws Exception {
//        Contact contact = new Contact().withId(3).withName("Contact 3").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend");
//        Gson gson = new Gson();
//        String contactAsJson = gson.toJson(contact);
//        this.mockMvc.perform(post("/Contacts").accept(MediaType.APPLICATION_JSON).content(contactAsJson).contentType(MediaType.APPLICATION_JSON))
//                .andDo(MockMvcResultHandlers.print())
//                .andExpect(status().isConflict())
//                .andExpect(content().contentType(APP_JSON_UTF8));
//    }

    @Test
    public void shouldUpdateContact() throws Exception {
        Contact contact = new Contact().withId(3).withName("Contact 3").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend");
        Gson gson = new Gson();
        String contactAsJson = gson.toJson(contact);
        this.mockMvc.perform(put("/Contacts/3").accept(MediaType.APPLICATION_JSON).content(contactAsJson).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APP_JSON_UTF8));
    }

//    @Test
//    public void shouldNotUpdateContact() throws Exception {
//        Contact contact = new Contact().withId(35).withName("Contact 35").withAddress("1, a street, a town, a city, AB12 3CD").withTel("0123456789").withEmail("anemail@me.com").withPhoto("img/placeholder.png").withType("friend");
//        Gson gson = new Gson();
//        String contactAsJson = gson.toJson(contact);
//        this.mockMvc.perform(put("/Contacts/35").accept(MediaType.APPLICATION_JSON).content(contactAsJson).contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isConflict())
//                .andExpect(content().contentType(APP_JSON_UTF8));
//    }

    @Test
    public void shouldDeleteContact() throws Exception {
        this.mockMvc.perform(delete("/Contacts/4").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APP_JSON_UTF8));
    }

}

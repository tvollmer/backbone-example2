package com.voltsolutions.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.DateSerializer;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

import java.io.Serializable;
import java.util.Date;

public class Contact implements Serializable {

    private static final long serialVersionUID = -3288619177798444712L;

    private int id;
    private String name;
    private String address;
    private String tel;
    private String email;
    private String type;
    private String photo; // should probably be a fileName, fileId, or byte[]
    private Date createdDate;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Contact withId(int id){
        this.id = id;
        return this;
    }

    @JsonSerialize(using=DateSerializer.class)
    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Contact withCreatedDate(Date createdDate){
        this.createdDate = createdDate;
        return this;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Contact withType(String type){
        this.type = type;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Contact withEmail(String email){
        this.email = email;
        return this;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public Contact withTel(String tel){
        this.tel = tel;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Contact withAddress(String address) {
        this.address = address;
        return this;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Contact withName(String name){
        this.name = name;
        return this;
    }

    public String getPhoto(){
        return photo;
    }

    public void setPhoto(String photo){
        this.photo = photo;
    }

    public Contact withPhoto(String photo){
        this.photo = photo;
        return this;
    }

    public String toString(){
        return new ReflectionToStringBuilder(this).toString();
    }
}

package com.voltsolutions.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.DateSerializer;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;

public class Contact implements Serializable, Cloneable {

    private static final long serialVersionUID = -3288619177798444712L;

    private Integer id;
    private String name;
    private String address;
    private String tel;
    private String email;
    private String type;
    private String photo; // should probably be a fileName, fileId, or byte[]
    private Date createdDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public int hashCode(){
        return new HashCodeBuilder(3, 7)
                .append(id)
                .append(name)
                .append(tel)
                .append(email)
                .toHashCode();
    }

    public final boolean equals(Object other){
        if (other == null){ return false; }
        if (!(other instanceof Contact)){ return false; }
        Contact that = (Contact)other;
        return new EqualsBuilder()
                .append(this.id, that.id)
                .append(this.name, that.name)
                .append(this.tel, that.tel)
                .append(this.email, that.email)
                .isEquals();
    }

    public String toString(){
        return new ReflectionToStringBuilder(this).toString();
    }

    @Override
    public Contact clone() throws CloneNotSupportedException {
        Contact contact = new Contact();
        BeanUtils.copyProperties(this, contact);
        return contact;
    }
}

package com.voltsolutions.specs;

import org.concordion.integration.junit4.ConcordionRunner;
import org.junit.runner.RunWith;

@RunWith(ConcordionRunner.class)
public class HelloWorldFixture {

    public String greetingFor(String firstName) {
        return "Hello " + firstName + "!";
    }

}

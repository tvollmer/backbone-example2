
example/demo from http://code.tutsplus.com/tutorials/build-a-contacts-manager-using-backbonejs-part-1--net-24277,
with patches and fixes ( use cases from part 4 have not been flushed out yet ).


Also refer to vinentmac's version here : https://github.com/vincentmac/ContactManager/blob/master/public/javascripts/app.js, 
utilizing Node.js as well.

HotSwap ( not Hot Deploy )  w/ mvn/jetty/intellij
1) in the pom, make sure that the jetty plugin is configured with a scanIntervalSeconds set to 0
2) Create a new run config : Run > Edit Configurations > Add New Configuration, add a goal of "jetty:run" ( or "tomcat:run" ) with personal vm args (intellij 11+ doesn't need you to add debug options)
3) Debug your new config
4) make a change, and hit CTRL+SHIFT+F9 or command+shift+f9 ... you should see a little green box show up in the bottom


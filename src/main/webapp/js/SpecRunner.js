require(['jquery'], function($){

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push('spec/utils/FormsSpec');
    specs.push('spec/model/ContactSpec');
    specs.push('spec/collection/DirectorySpec');
    specs.push('spec/view/ContactViewSpec');
    specs.push('spec/view/DirectoryViewSpec');
    specs.push('spec/RouterSpec');
    specs.push('spec/AppSpec');

    $(function(){
        require(specs, function(){
            jasmineEnv.execute();
        });
    });

});
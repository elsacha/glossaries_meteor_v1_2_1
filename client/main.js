// subscribe to read data
Meteor.subscribe("glossaries");
Meteor.subscribe("users");


// set up the main template the the router will use to build pages
Router.configure({
  layoutTemplate: 'layout'
});

// specify the top level route, the page users see when they arrive at the site
Router.route('/', function () {
    console.log("rendering root");
    this.render('home');
});

Router.route('/glossaries', function () {
    console.log("rendering /glossaries");
    this.render('glossaries'); 
});

Router.route('/add', function () {
  if (!Meteor.user()) {
    this.render("not_authorized");
  } else {
    console.log("rendering /add");
    this.render('insertGlossaryForm');
  }
});

//view glossary by id
Router.route('/view/:_id', function(){
  if (!Meteor.user()) { //not logged users can see only public glossaries
    var item = Glossaries.findOne({_id: this.params._id, public: true});
    this.render('glossary_full_view', {data: item});
  } else { //logged in users can see public glossaries and glossaries created by them
    var item = Glossaries.findOne({ $or: [{_id: this.params._id, public: true},
                                          {_id: this.params._id, glossary_author: Meteor.userId()}]});
    //console.log("current user: " + Meteor.userId());
    this.render('glossary_full_view', {data: item});
  }
});

Router.route('/update/:_id', function (){
  var glos = Glossaries.findOne({_id: this.params._id});
  console.log("current user: " + Meteor.userId());
  console.log("glossary author: " + glos.glossary_author);
    console.log("glossary public: " + glos.public);
  //users can edit only glossaries created by them or public glossaries

  if (!Meteor.user() || (glos.glossary_author !== Meteor.userId() && !glos.public)) {
    this.render('not_authorized');
  } else {
    //var item = Glossaries.findOne({_id: this.params._id});
    this.render('updateGlossaryForm', {data: glos});
  }
});

Router.route('/my_glossaries', function () {
    console.log("rendering /my_glossaries");
    this.render('myGlossaries'); 
});

Router.route('/search', function () {
    console.log("rendering /search");
    this.render('searchBox');
});

// Router.route('/pagination', function () {
//     console.log("rendering /pagination");
//     this.render('pagination'); 
// });



//delete null values from the array of terms when terms are deleted in the update form
AutoForm.addHooks(['updateGlossaryForm'],
{
  formToModifier: function(modifier) {
    if (modifier.$set.terms) {
      modifier.$set.terms = _.compact(modifier.$set.terms);
    }
    return modifier;
  }
});

//Reactive tabs configuration
//register
ReactiveTabs.createInterface({
  template: 'basicTabs',
  onChange: function (slug, template) {
    // This callback runs every time a tab changes.
    // The `template` instance is unique per {{#basicTabs}} block.
    console.log('[tabs] Tab has changed! Current tab:', slug);
    console.log('[tabs] Template instance calling onChange:', template);
  }
});





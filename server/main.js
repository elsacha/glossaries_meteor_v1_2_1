Meteor.startup(() => {
  // code to run on server at startup
  if (!Glossaries.findOne()){
        console.log("creating sample glossaries");
        var glos = 
        [
           {
             title: "Terms for business meetings",
        	   source_language: "English",
        	   target_language: "French",
        	   subject: "business terminology",
        	terms: 
        	[
        		{
	        		source_term: "business meeting",
	        		target_term: "réunion d'affaires",
	        		term_author: "admin"
        		},

        		{
	        		source_term: "sign a contract",
	        		target_term: "signer un contrat",
	        		term_author: "admin"
        		}
        	],
        	
        	glossary_author: "admin",
          public: true
    	   },
    	   {
    	   	title: "Tourism",
        	source_language: "English",
        	target_language: "Spanish",
        	subject: "tourism",
        	terms: 
        	[
        		{
	        		source_term: "travel agency",
	        		target_term: "agencia de viajes",
	        		term_author: "admin"
        		},

        		{
	        		source_term: "sea",
	        		target_term: "mar",
	        		term_author: "admin"
        		}
        	],
       		glossary_author: "admin",
          public: true
    	   },
         {
          title: "Computer science",
          source_language: "English",
          target_language: "French",
          subject: "computer science",
          terms: 
          [
            {
              source_term: "computer",
              target_term: "ordinateur",
              term_author: "admin"
            },

            {
              source_term: "network",
              target_term: "réseau",
              term_author: "admin"
            }
          ],
          glossary_author: "admin",
          public: true
         },
         {
          title: "Medical terms",
          source_language: "English",
          target_language: "French",
          subject: "medical terms, visit of a doctor",
          terms: 
          [
            {
              source_term: "sore throat",
              target_term: "mal à la gorge",
              term_author: "admin"
            },

            {
              source_term: "ophthalmologist",
              target_term: "ophtalmologue",
              term_author: "admin"
            }
          ],
          glossary_author: "admin",
          public: true
         },
         {
          title: "Air travel",
          source_language: "English",
          target_language: "Spanish",
          subject: "helpful phrases to use at the airport",
          terms: 
          [
            {
              source_term: "boarding",
              target_term: "abordaje",
              term_author: "admin"
            },

            {
              source_term: "ticket",
              target_term: "billete",
              term_author: "admin"
            }
          ],
          glossary_author: "admin",
          public: true
         }
    	];
    	//apparently multiple document insert does not work in Meteor's mongodb
    	_.each(glos, function(g) { 
  			Glossaries.insert(g);
		})
   }
});

Meteor.publish("glossaries", function(){
  var filter = {$or:[
                {glossary_author : this.userId}, 
                {public : true}
                ]};
  return Glossaries.find(filter);
})

Meteor.publish('users', function() {
    return Meteor.users.find();
});

Glossaries.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change public documents or private documents that you created
    return ((doc.glossary_author === userId) || doc.public);
    //return true;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.glossary_author === userId;
  },
  fetch: ['glossary_author']
});

// Glossaries.deny({
//   update: function (userId, doc, fields, modifier) {
//     // can't change owners
//     return _.contains(fields, 'glossary_author');
//   },
//   remove: function (userId, doc) {
//     // can't remove locked documents
//     return doc.locked;
//   },
//   fetch: ['locked'] // no need to fetch 'owner'
// });


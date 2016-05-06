Meteor.startup(() => {
  // code to run on server at startup
  if (!Glossaries.findOne()){
        console.log("created sample glossaries");
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
	        		term_author: "test"
        		},

        		{
	        		source_term: "sign a contract",
	        		target_term: "signer un contrat",
	        		term_author: "test"
        		}
        	],
        	
            public: true,
            glossary_author: "test"
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
	        		term_author: "test"
        		},

        		{
	        		source_term: "sea",
	        		target_term: "mar",
	        		term_author: "test"
        		}
        	],
       		public: true,
            glossary_author: "test"
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
              term_author: "test"
            },

            {
              source_term: "network",
              target_term: "réseau",
              term_author: "test"
            }
          ],
          public: true,
          glossary_author: "test"
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
              term_author: "test"
            },

            {
              source_term: "ophthalmologist",
              target_term: "ophtalmologue",
              term_author: "test"
            }
          ],
          public: true,
          glossary_author: "test"
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
              term_author: "test"
            },

            {
              source_term: "ticket",
              target_term: "billete",
              term_author: "test"
            }
          ],
          public: true,
          glossary_author: "test"
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
                {glossary_author : "test"}, //allow edit test glossaries loaded on first launch of the app
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
  update: function (userId, doc) {
    return (userId);
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.glossary_author === userId;
  },
  fetch: ['glossary_author']
});

//Glossaries.allow({
//  insert: function (userId, doc) {
//    // the user must be logged in, and the document must be owned by the user
//    return (userId);
//  },
//  update: function (userId, doc, fields, modifier) {
//  //update: function (userId, doc) {
//    // can only change public documents or private documents that you created
//    //return ((doc.glossary_author === userId) || doc.public);
//    console.log(doc);
//    console.log('update glos author:' + doc.glossary_author);
//    console.log('update user id:' + userId);
//    console.log('update glos public?:' + doc.public);
//    return true;
//  },
//  remove: function (userId, doc) {
//    // can only remove your own documents
//    return doc.glossary_author === userId;
//  },
//  fetch: ['glossary_author']
//});

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


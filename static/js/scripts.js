var Actors = {
	init: function( config ) {
		this.config = config;

		this.setupTemplates();
		this.bindEvents();

		$.ajaxSetup({
			type: 'POST'
		});

		$('button').remove(); // little lazy
	},

	bindEvents: function() {
		this.config.letterSelection.on( 'change', this.fetchActors );
		this.config.actorsList.on( 'click', 'li', this.displayAuthorInfo );
		this.config.actorInfo.on( 'click', 'span.close', this.closeOverlay );
	},

	setupTemplates: function() {
		this.config.actorListTemplate = Handlebars.compile( this.config.actorListTemplate);
		this.config.actorInfoTemplate = Handlebars.compile( this.config.actorInfoTemplate);

		Handlebars.registerHelper( 'fullName', function( actor ) {
			return actor.first_name + ' ' + actor.last_name;
		});
	},

	fetchActors: function() {
		var self = Actors;

		$.ajax({
			data: self.config.form.serialize(),
			dataType: 'json',
			success: function(results) {
				self.config.actorsList.empty();

				if ( results.data[0] ) {
					self.config.actorsList.append( self.config.actorListTemplate( results.data ) );
					console.log($('#actor_list_template'));
				} else {
					self.config.actorsList.append('<li>Nothing returned.</li>');
				}
			}
		});
	},

	displayAuthorInfo: function( e ) {
		var self = Actors;

		self.config.actorInfo.slideUp( 300 );

		$.ajax({
			type: 'GET',
			url: $(this).find("a").attr("href"),
			//data: { actor_id: $(this).data( 'actor_id' ) }
		}).then(function( result ) {
			self.config.actorInfo.html( self.config.actorInfoTemplate( { info : result.data } ) ).slideDown(300);
		});

		e.preventDefault();
	},

	closeOverlay: function() {
		Actors.config.actorInfo.slideUp(300);
	}
};

Actors.init({
	letterSelection: $('#q'),
	form: $('#actor-selection'),
	actorListTemplate: $('#actor_list_template').html(),
	actorInfoTemplate: $('#actor_info_template').html(),
	actorsList: $('ul.actors_list'),
	actorInfo: $('div.actor_info')
});





window.App = Em.Application.create({
  LOG_TRANSITIONS: true,
  // Browser aware replaceState, via Discourse
  replaceState: function(path) {
    if (window.history &&
        window.history.pushState &&
        window.history.replaceState &&
        !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/)) {
      if (window.location.pathname !== path) {
        return history.replaceState({
          path: path
        }, null, path);
      }
    }
  }
});

// ROUTERS

App.Router.map(function(){
  this.resource('index', {path: ''}, function(){
    this.route('a');
    this.route('b');
  });
});

App.Router.reopen({
  location: 'history'
});

App.IndexRoute = Em.Route.extend({
  renderTemplate: function(){
    this._super();
    this.render('index/a', { into: 'index' });
  }
});

App.IndexARoute = Em.Route.extend({
  renderTemplate: function(){
    this.render('index/a', { into: 'index' });
  }
});

App.IndexBRoute = Em.Route.extend({
  renderTemplate: function(){
    this.render('index/b', { into: 'index' });
  }
});

// CONTROLLERS

App.IndexController = Em.Controller.extend({
  indexSection: null,
  replaceRouteWithSection: function(){
    App.replaceState('/'+this.get('indexSection'));
  },
  replaceRouteWithIndex: function(){
    App.replaceState('/');
  }
});

App.IndexSubController = Em.Controller.extend({
  needs: ['index'],
  indexSectionBinding: 'controllers.index.indexSection'
});

App.IndexAController = App.IndexSubController.extend();
App.IndexBController = App.IndexSubController.extend();

// VIEWS

App.IndexView = Em.View.extend({
  didInsertElement: function(){
    this.$('.fixable-header').waypoint({
      handler: $.proxy(function(dir){ this[dir].apply(this) }, this)
    });
  },
  down: function(){
    this.get('controller').replaceRouteWithSection();
  },
  up: function(){
    this.get('controller').replaceRouteWithIndex();
  }
});

App.IndexSubView = Em.View.extend({
  indexSectionName: null,
  didInsertElement: function(){
    this.set('controller.indexSection', this.get('indexSectionPath'));
    this.$().css('min-height', window.innerHeight);
  },
  willDestroyElement: function(){
    this.set('controller.indexSection', null);
  }
});

App.IndexAView = App.IndexSubView.extend({
  indexSectionPath: 'a'
});

App.IndexBView = App.IndexSubView.extend({
  indexSectionPath: 'b'
});

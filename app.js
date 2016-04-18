/*globals performance:false */
(function() {
  'use_strict';
  return {

    storage: {},

    events: {
      'app.created'             : 'onAppCreated',
      'ticket.save'             : 'onTicketSave',
      'click .modal-save'       : 'onModalSaveClicked',
      'shown .modal'            : 'onModalShown',
      'hidden .modal'           : 'onModalHidden',
    },

    onAppCreated: function() {
	  this.switchTo('modal', {
		header: this.I18n.t('modal_header'),
        body: this.I18n.t('modal_body')
      });
    },

    onTicketSave: function() {
	  var comment = this.comment();
	  if (comment.type() === 'publicReply') {return true;}
	  var ticket = this.ticket();
	  if (ticket.customField("custom_field_25335739") === "yes") {
        return this.promise(function(done, fail) {
		  this.saveHookPromiseDone = done;
		  this.saveHookPromiseFail = fail;
		  
		  this.$('.modal').modal('show');
        }.bind(this));
      } else {
        return true;
      }
    },

    onModalSaveClicked: function() {
	  var ticket = this.ticket();
	  if (this.$('.modal-checkbox').is(':checked')) {
		  ticket.customField("custom_field_25335739", "yes");
	  } else if (!this.$('.modal-checkbox').is(':checked')) {
		  ticket.customField("custom_field_25335739", "no");
	  }
		
      try {
        this.saveHookPromiseIsDone = true;
        this.$('.modal').modal('hide');
        this.saveHookPromiseDone();
      } catch (e) {
        throw e;
      }
    },

    onModalShown: function() {
	  var ticket = this.ticket();
	  if (ticket.customField("custom_field_25335739") === "yes") {
		  this.$('.modal-checkbox').prop('checked', true);
	  }
		
      var timeout = 25,
          $timeout = this.$('span.modal-timer'),
          $modal = this.$('.modal');

      this.modalTimeoutID = setInterval(function() {
        timeout -= 1;

        $timeout.html(timeout);

        if (timeout === 0) {
          $modal.modal('hide');
        }
      }.bind(this), 1000);

      $modal.find('.modal-save').focus();
    },

    onModalHidden: function() {
      clearInterval(this.modalTimeoutID);

      if (!this.saveHookPromiseIsDone) {
        this.saveHookPromiseFail(this.I18n.t('errors.save_hook'));
      }
    }
  };
}());
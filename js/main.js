_ = require('lodash');
var Section = require('./section.js');

/**
 * Creates a new SideComments instance.
 * @param {[type]} el               The selector for the element for which side comments need
 *                                  to be initialized
 * @param {[type]} existingComments An array of existing comments, in the proper structure.
 * 
 * TODO: **GIVE EXAMPLE OF STRUCTURE HERE***
 */
function SideComments( el, existingComments ) {
  this.$el = $(el);
  this.$body = $('body');

  this.existingComments = existingComments || [];
  this.sections = [];
  this.activeSection = null;
  
  // Event bindings
  this.$el.on('showComments', _.bind(this.showComments ,this));
  this.$el.on('hideComments', _.bind(this.hideComments ,this));
  this.$el.on('sectionSelected', _.bind(this.sectionSelected ,this));
  this.$el.on('sectionDeselected', _.bind(this.sectionDeselected ,this));
  this.$body.on('click', _.bind(this.bodyClick, this));

  this.initialize(this.existingComments);
}

/**
 * Adds the comments beside each commentable section.
 */
SideComments.prototype.initialize = function( existingComments ) {
  _.each(this.$el.find('.commentable-section'), function( section ){
    var $section = $(section);
    var sectionId = $section.data('section-id').toString();
    var sectionComments = _.find(this.existingComments, { sectionId: sectionId });

    this.sections.push(new Section(this.$el, $section, sectionComments));
  }, this);
};

/**
 * Shows the side comments.
 */
SideComments.prototype.showComments = function() {
  this.$body.addClass('side-comments-open');
};

/**
 * Hide the comments.
 */
SideComments.prototype.hideComments = function() {
  this.$body.removeClass('side-comments-open');
};

/**
 * Callback after a section has been selected.
 * @param  {Object} event The event object.
 * @param  {Object} section The Section object to be selected.
 */
SideComments.prototype.sectionSelected = function( event, section ) {
  this.showComments();

  if (this.activeSection) {
    this.activeSection.deselect();
  }
  
  this.activeSection = section;
};

/**
 * Callback after a section has been deselected.
 * @param  {Object} event The event object.
 * @param  {Object} section The Section object to be selected.
 */
SideComments.prototype.sectionDeselected = function( event, section ) {
  this.hideComments();
  this.activeSection = null;
};

/**
 * Checks if comments are visible or not.
 * @return {Boolean} Whether or not the comments are visible.
 */
SideComments.prototype.commentsAreVisible = function() {
  return this.$body.hasClass('side-comments-open');
};

/**
 * Callback for body clicks. We hide the comments if someone clicks outside of the comments section.
 * @param  {Object} event The event object.
 */
SideComments.prototype.bodyClick = function( event ) {
  var $target = $(event.target);
  
  if ($target.closest('.side-comment').length < 1) {
    this.hideComments();
  }
};

/**
 * Destroys the instance of SideComments, including unbinding from DOM events.
 */
SideComments.prototype.destroy = function() {
  this.hideComments();
  this.$el.off();
};

module.exports = SideComments;
window.SideComments = SideComments;
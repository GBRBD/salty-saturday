/**
 * Bootstrap essential stuff
 */
import '../sass/light.theme.scss'

$(document).on('click', '.js-dropdown', function(e) {
    e.stopImmediatePropagation();
    $(this).find('.dropdown').toggle();
});

$(document).on('click', function(e) {
    $('.js-dropdown').find('.dropdown').hide();
});

$('.flash__remove').on('click', function(e) {
    $(this).closest('.card').remove();
});

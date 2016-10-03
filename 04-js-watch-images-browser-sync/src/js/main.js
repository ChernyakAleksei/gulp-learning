$(function() {
  const link = $('.main-menu__item-link');
  link.on('mouseenter', function () {
    $(this).css({ color: 'red' })
  });
  link.on('mouseleave', function () {
    $(this).css({ color: 'black' })
  })
});

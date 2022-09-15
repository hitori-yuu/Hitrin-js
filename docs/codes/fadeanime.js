function fadeAnime(){
    $('.item').each(function(){
    var elemPos = $(this).offset().top - 100;
    var scroll = $(window).scrollTop();
    var windowHeight = $(window).height();
    if (scroll >= elemPos - windowHeight){
        $(this).addClass('fadeUp');
    }else{
        $(this).removeClass('fadeUp');
    }
});
}

$(window).scroll(function (){
    fadeAnime();
});
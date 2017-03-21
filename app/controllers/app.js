'use strict';

(function($){
    /*
    *@ Main app.js FCC Voting App by mnemosdev
    */
    var polls_container = $('.polls');
    var URL = 'https://fcc-boilerplate-mnemosdev.c9users.io/';
    var POLLS_ENDPOINT = 'polls';
    var NEWPOLL_ENDPOINT = 'api/polls';
    
    /*
    *@ Container for polls
    */
    var polls = [];
    
    $('document').ready(function(){
       
       /*
       *@ ajax request for polls
       */
       $.ajax({
           type: 'GET',
           dataType: 'json',
           url: URL + NEWPOLL_ENDPOINT
       })
       .done(function(data, status, jqXHR){
           console.warn('data retrieved');
           /*
           *@ append data to polls div
           */
           
           data.forEach(function(val, i, arr){
               // Append data to div
               polls.push(val);
               polls_container.append('<div><h2>' + val.name + '</h2><button><a href="/polls/' + val._id + '">Vote</a></button></div>');
           });
           
           /*
           *@ display polls div
           */
           polls_container.css('display', 'block');
       })
       .fail(function(jqXHR, status, err){
           console.error('ajax request failed', err);
       });
       
    });
    
    /*
    *@ Event handlers
    */
    $('#newpollform').on('submit', function(e){
        e.preventDefault();
        var pollname = $('#pollname').val();
        var pollchoices = $('#pollchoices').val().split(';');
        
        /*
        *@ Set votes to 0 for each new choice
        */
        pollchoices = pollchoices.map(function(val, i, arr){
            return {'name' : val, 'votes' : 0};
        });
        
        $.ajax({
            type: 'POST',
            url: URL + NEWPOLL_ENDPOINT,
            data: {
                name: pollname,
                pollchoices: pollchoices
            }
        })
        .done(function(data, status, jqXHR){
            console.log(data, status);
        })
        .fail(function(jqXHR, status, err){
            console.log(status, err);
        })
    });
})(jQuery);
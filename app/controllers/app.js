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
           
           for(let i = data.length - 1; i >= 0; i--){
               // Append data to div
               polls.push(data[i]);
               polls_container.append('<div class="col-sm-12 col-md-4 text-center center-block"><div class="card"><div class="card-content">' + data[i].name + '</div><div class="card-action"><a href="/polls/' + data[i]._id + '">VOTE</a></div></div></div>');
           };
           
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
        // var pollchoices = $('#pollchoices').val().split(';');
        var pollchoices = document.getElementsByTagName("li");
        var pollchoices_ = [];
        
        /*
        *@ Set votes to 0 for each new choice
        */
        
        $.each(pollchoices, function(current, index, array){
            pollchoices_.push({'name' : index.textContent, 'votes' : 0})
        })
        
        $.ajax({
            type: 'POST',
            url: URL + NEWPOLL_ENDPOINT,
            data: {
                name: pollname,
                pollchoices: pollchoices_
            }
        })
        .done(function(data, status, jqXHR){
            console.log(data, status);
            window.location.replace('/');
        })
        .fail(function(jqXHR, status, err){
            console.log(status, err);
        })
    });
    
    $('#newoption').on('submit', function(e){
        e.preventDefault();
        
        var path = "/" + location.pathname.split("/")[2];
        // console.log(path);
        
        var option = $('#newoptiontext').val();
        // console.log(option);
        // console.log(URL + NEWPOLL_ENDPOINT + path);
        
        $.ajax({
            type: 'POST',
            url: URL + NEWPOLL_ENDPOINT + path,
            data: {
                name: option
            }
        })
        .done(function(data, status, jqXHR){
            console.log(data);
            console.log("done");
            $("#vote select").append("<option>" + option + "</option>");
        })
        .fail(function(jqXHR, status, err){
            console.error(err);
            console.log("err");
        })
    });
    
    $('#vote').on('submit', function(e){
       e.preventDefault();
       
       var path = "/" + location.pathname.split("/")[2];
       
       var option = $('#vote select').val();
       var url = URL + NEWPOLL_ENDPOINT + path + "/vote";
       console.log(url);
       $.ajax({
           type: 'POST',
           url: url,
           data: {
               option: option
           }
       })
       .done(function(data, status, jqXHR){
           console.log(data);
           var votes = new CustomEvent('votes', { detail: { data : data} , bubbles: true, cancelable: false});
           if(data.voted){
               $(".container").append("<p>You already voted</p>");
               $(".container p:first-child").fadeOut(2000);
               window.location.replace("https://fcc-boilerplate-mnemosdev.c9users.io/");
           }
           if(data._id && data.name && data != undefined){
               document.getElementById("poll").dispatchEvent(votes);
           }
       })
       .fail(function(jqXHR, status, err){
           console.log(err);
       })
    });
})(jQuery);
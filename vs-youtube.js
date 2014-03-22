(function() {
  var VsYoutubeProto = {
    attachedCallback: function(){
      this.setAttribute('pending', 'pending');

      if(window.YT && window.YT.loaded) {
        this.onYoutubeApiReady();
      }
    },

    onYoutubeApiReady: function(){
      var placeholder = document.createElement('div');
      this.appendChild(placeholder);

      var options = {
        events: {
          'onReady': this.onPlayerReady.bind(this),
          'onStateChange': this.onPlayerStateChange.bind(this)
        }
      };

      this.player = new window.YT.Player(placeholder, options);
    },

    onPlayerReady: function(){
      this.cueCurrentVideo();
    },

    onPlayerStateChange: function(e){
    },

    cueCurrentVideo: function(){
      if(this.videoId && this.player) {
        this.player.cueVideoById(this.videoId);
        this.removeAttribute('pending');
      }
    },

    attributeChangedCallback: function(name, old, current){
      if(name == 'video-id') { this.cueCurrentVideo(); }
    }
  };

  Object.defineProperty(VsYoutubeProto, 'videoId', {
    get: function(){ return this.getAttribute('video-id'); },
    set: function(id) { this.setAttribute('video-id', id); }
  });

  function registerYouTubeAPIOnce(){
    window.onYouTubeIframeAPIReady = function(){
      resolvePendingPlayers();
    };
  };

  function resolvePendingPlayers() {
    var existing = document.querySelectorAll('vs-youtube');

    Array.prototype.forEach.call(existing, function(el) {
      if(el.onYoutubeApiReady) {
        el.onYoutubeApiReady();
      }
    });
  }

  registerYouTubeAPIOnce();

  window.Versal.registerElement('vs-youtube', VsYoutubeProto);
})();
